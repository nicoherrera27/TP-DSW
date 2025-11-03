// Backend/src/sale/sale.controller.ts
import { Request, Response, NextFunction } from "express";
import { orm } from "../shared/db/orm.js";
import { Sale } from "./sale.entity.js";
import { Ticket } from "../ticket/ticket.entity.js";
import { Show } from "../show/show.entity.js";
import { TicketType } from "../ticket_type/ticketType.entity.js";
import { User } from "../user/user.entity.js";
import { Timetable } from "../time_table/timetable.entity.js";
// No importamos PendingSale si no la usamos

// --- IMPORTACIÓN PARA SDK v3+ ---
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
// --- FIN IMPORTACIÓN ---

// Usar un tipo más específico si es posible, o any si es necesario
const em = orm.em.fork();

// config mp
const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;
const MP_WEBHOOK_SECRET = process.env.MP_WEBHOOK_SECRET;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:4321';
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000'; 

let mpClient: MercadoPagoConfig | null = null;
if (MP_ACCESS_TOKEN) {
    try {
        // Crear cliente para v3+
        mpClient = new MercadoPagoConfig({ accessToken: MP_ACCESS_TOKEN });
        console.log("Mercado Pago configurado correctamente.");
    } catch(configError: any){ // Tipar error como any
        console.error("¡ERROR Configurando Mercado Pago!:", configError.message || configError);
        mpClient = null; // Asegurar que sea null si falla la configuración
    }
} else {
    console.error("¡ERROR! MP_ACCESS_TOKEN no está configurado.");
}
// --- FIN CONFIGURACIÓN MERCADO PAGO ---

async function createPreference(req: Request, res: Response) {
    if (!mpClient) { 
         return res.status(500).json({ message: 'Mercado Pago no está configurado correctamente.' });
    }
    // @ts-ignore
    const userId = req.user?.id;
    const { showId, timetableId, tickets } = req.body; // tickets: [{ typeId: number | null, quantity: number }]

    // Validar datos de entrada
    if (!showId || !timetableId || !Array.isArray(tickets) || tickets.length === 0) {
        return res.status(400).json({ message: 'Faltan datos requeridos (showId, timetableId, tickets).' });
    }
    if (isNaN(Number(showId)) || isNaN(Number(timetableId))) {
         return res.status(400).json({ message: 'showId y timetableId deben ser números.' });
    }


    try {
        // Buscar la función y sus relaciones necesarias
        const show = await em.findOne(Show, { id: Number(showId) }, { populate: ['showCat', 'showMovie', 'showRoom'] });
        if (!show || !show.showCat || !show.showMovie || !show.showRoom) {
            return res.status(404).json({ message: 'Función no encontrada o datos asociados incompletos (categoría, película o sala).' });
        }

        let totalAmount = 0;
        const items: any[] = []; // Array para los ítems de la preferencia
        let description = `Entradas para ${show.showMovie.name}`; // Descripción general
        let ticketsForReference: string[] = []; // Para construir la referencia externa

        // Procesar cada tipo de ticket solicitado
        for (const ticketInfo of tickets) {
            const quantity = Number(ticketInfo.quantity);
            // Ignorar si la cantidad no es válida
            if (isNaN(quantity) || quantity <= 0) continue;

            let unit_price = Number(show.showCat.price) || 0; // Precio base de la categoría
            let title = `Entrada General - ${show.showMovie.name}`; // Título por defecto
            let typeIdString = 'null'; // Para la referencia externa

            // Si es un ticket con tipo específico (descuento)
            if (ticketInfo.typeId !== null && ticketInfo.typeId !== undefined) {
                 const numericTypeId = Number(ticketInfo.typeId);
                 if (!isNaN(numericTypeId)){
                    const ticketType = await em.findOne(TicketType, { id: numericTypeId });
                    // Si se encuentra el tipo de ticket, aplicar bonificación
                    if (ticketType) {
                        const bonification = Number(ticketType.bonification) || 0;
                        unit_price = unit_price * (1 - bonification); // Aplicar descuento
                        title = `${ticketType.description} - ${show.showMovie.name}`;
                        description += ` (${quantity}x ${ticketType.description})`;
                        typeIdString = ticketType.id.toString(); // Guardar ID para referencia
                    } else {
                         console.warn(`WARN: TicketType ID ${numericTypeId} no encontrado. Usando precio general.`);
                    }
                } else {
                     console.warn(`WARN: TicketType ID inválido: ${ticketInfo.typeId}. Usando precio general.`);
                }
            } else {
                 // Si es entrada general
                 description += ` (${quantity}x General)`;
                 typeIdString = 'null'; // Marcar como general en la referencia
            }

            // Acumular el monto total
            totalAmount += quantity * unit_price;
            // Añadir ítem a la lista para Mercado Pago
            items.push({
                title: title,
                quantity: quantity,
                unit_price: Number(unit_price.toFixed(2)), // MP requiere número, 2 decimales
                currency_id: 'ARS' // Moneda Argentina
            });
            // Guardar info para la referencia externa (formato: typeId:quantity)
            ticketsForReference.push(`${typeIdString}:${quantity}`);
        }

        // Si después de procesar no hay ítems válidos
        if (items.length === 0) {
             return res.status(400).json({ message: 'No se seleccionaron entradas válidas.' });
        }

        // --- Verificación de capacidad ANTES de crear la preferencia ---
        const existingTicketsCount = await em.count(Ticket, { showTicket: showId, timetable: timetableId });
        const totalTicketsRequested = tickets.reduce((sum, t) => sum + Number(t.quantity || 0), 0); // Sumar cantidades solicitadas
        const roomCapacity = Number(show.showRoom.capacity);

        if (isNaN(roomCapacity) || (existingTicketsCount + totalTicketsRequested) > roomCapacity) {
             const available = Math.max(0, roomCapacity - existingTicketsCount);
             console.log(`Capacidad excedida al crear pref: Show ${showId}, Timetable ${timetableId}. Req ${totalTicketsRequested}, Exists ${existingTicketsCount}, Cap ${roomCapacity}`);
             return res.status(409).json({ message: `No hay suficientes entradas disponibles (${available} restantes).` }); // 409 Conflict
        }
        // --- Fin Verificación Capacidad ---

        // Construir la referencia externa para identificar la compra en el webhook
        const userIdForRef = userId || 'guest';
        const ticketsString = ticketsForReference.join(','); // Ej: "null:2,5:1"
        const externalReference = `${showId}|${timetableId}|${userIdForRef}|${ticketsString}|${Date.now()}`;
        console.log("Generated External Reference:", externalReference);

        // --- URLs ---
        const successUrl = `${FRONTEND_URL}/purchase/success`;
        const failureUrl = `${FRONTEND_URL}/purchase/failure`;
        const pendingUrl = `${FRONTEND_URL}/purchase/pending`;
        const notificationUrl = `${BACKEND_URL}/api/sales/webhook?source_news=webhooks`;

        // Validar URLs (simple check for existence)
        if (!FRONTEND_URL || !BACKEND_URL) {
             console.error("¡ERROR! FRONTEND_URL o BACKEND_URL no están definidas. Revisa .env y reinicia.");
             return res.status(500).json({ message: "Error interno: URLs de configuración faltantes." });
        }

        // Definir el cuerpo (payload) para la creación de la preferencia
        const preferenceBody = {
            items: items,
            back_urls: { // URLs a donde redirigir al usuario
                success: successUrl,
                failure: failureUrl,
                pending: pendingUrl,
            },
            auto_return: 'approved' as 'approved', // Redirigir solo si el pago es aprobado
            notification_url: notificationUrl,     // URL de tu webhook
            external_reference: externalReference, // Referencia para identificar la compra
        };

        // --- Crear preferencia usando SDK v3+ ---
        const preference = new Preference(mpClient); // Crear instancia de Preference con el cliente
        const mpResponse = await preference.create({ body: preferenceBody }); // Crear la preferencia
        // --- FIN Crear preferencia v3+ ---

        const preferenceId = mpResponse.id; // ID de la preferencia creada
        const initPoint = mpResponse.init_point; // URL de redirección a Mercado Pago

        // Validar respuesta de MP
        if (!preferenceId || !initPoint) {
             console.error("Respuesta inesperada de MP V3 al crear preferencia:", mpResponse);
             throw new Error("Mercado Pago v3 no devolvió ID de preferencia o punto de inicio.");
        }

        console.log(`Preferencia ${preferenceId} creada (v3). Redirigiendo a MP.`);
        // Enviar la URL de pago al frontend
        res.status(201).json({ init_point: initPoint });

    } catch (error: any) { // Capturar cualquier error
        console.error("Error creando preferencia MP v3:", error);
        // Intentar obtener más detalles del error si viene de MP
        const mpErrorBody = error.cause?.response?.data || error.response?.data;
        const errorMessage = mpErrorBody?.message || error.message || 'Error al iniciar el proceso de pago';
        console.error("Detalles del error de MP v3:", mpErrorBody || error);
        // Devolver un error 500 o el código de estado de MP si está disponible
        res.status(error.statusCode || error.status || 500).json({ message: errorMessage, details: mpErrorBody?.cause || mpErrorBody });
    }
}


// --- handleWebhook para SDK v3+ ---
async function handleWebhook(req: Request, res: Response) {
    if (!mpClient) { // Verificar si el cliente v3+ está configurado
         console.error("Webhook ignorado: Cliente de Mercado Pago v3+ no configurado.");
         return res.sendStatus(500); // Error interno del servidor
    }

    // Inicializar variables para logging
    let paymentInfo: any = null;
    let externalReference: string | undefined = undefined;
    let paymentIdNum: number | undefined = undefined;

    // Obtener datos de la notificación
    const paymentIdQuery = req.query.id as string; // ID desde query param (puede ser pago o merchant_order)
    const paymentIdBody = req.body.data?.id as string; // ID desde el cuerpo (preferido para pagos v3)
    const topicOrType = req.query.topic as string || req.body.topic as string || req.body.type; // Tópico o tipo de evento
    const paymentId = paymentIdBody || paymentIdQuery; // Usar ID del cuerpo si existe

    console.log(`Webhook v3 recibido: ID=${paymentId}, Topic/Type=${topicOrType}`);

    // --- VERIFICACIÓN DE FIRMA (Opcional pero Recomendado) ---
    const signatureHeader = req.get('x-signature');
    const requestId = req.get('x-request-id'); // ID de solicitud de MP

    if (MP_WEBHOOK_SECRET && signatureHeader && paymentId && requestId) {
        try {
            // Parsear la cabecera x-signature
            const signatureData = signatureHeader.split(',').reduce((acc, part) => {
                const [key, value] = part.split('=');
                if (key && value) {
                     (acc as { [key: string]: string })[key.trim()] = value.trim();
                }
                return acc; // <-- ¡RETURN ACC!
            }, {} as { [key: string]: string });

            const timestamp = signatureData['ts']; // Timestamp de la firma
            const receivedHash = signatureData['v1']; // Hash recibido (generalmente v1)

            if (!timestamp || !receivedHash) {
                 console.warn('Webhook ignorado: Cabecera x-signature mal formada (falta ts o v1).');
                 return res.sendStatus(400); // Bad Request
            }

            // Crear el manifiesto para verificar
            const manifest = `id:${paymentId};request-id:${requestId};ts:${timestamp};`;
            const crypto = require('crypto');
            // Calcular el hash esperado usando el secreto
            const expectedHash = crypto.createHmac('sha256', MP_WEBHOOK_SECRET)
                                       .update(manifest)
                                       .digest('hex');

            // Comparar hashes
            if (expectedHash !== receivedHash) {
                 console.error('¡ALERTA! Webhook ignorado: Firma inválida.');
                 return res.sendStatus(403); // Forbidden (firma no coincide)
            }
             console.log('Firma del Webhook verificada correctamente.');

        } catch (sigError: any) {
             console.error("Error verificando firma del webhook:", sigError.message);
             return res.sendStatus(400); // Error al procesar firma
        }
    } else if (MP_WEBHOOK_SECRET) {
         // Si se configuró secreto pero no llegó la cabecera o datos
         console.warn('Webhook ignorado: Falta cabecera x-signature o datos para verificarla (secreto configurado).');
         return res.sendStatus(400); // Bad Request
    } // Si no hay secreto configurado, se salta la verificación (NO RECOMENDADO)
    // --- FIN VERIFICACIÓN DE FIRMA ---

    // Procesar solo si es un evento de pago y tenemos un ID de pago
    if ((topicOrType === 'payment') && paymentId) {
        try {
            paymentIdNum = Number(paymentId);
            if (isNaN(paymentIdNum)) {
                throw new Error(`Payment ID inválido recibido: ${paymentId}`);
            }

            // --- Obtener detalles del pago usando SDK v3+ ---
            const payment = new Payment(mpClient); // Crear instancia de Payment con el cliente
            paymentInfo = await payment.get({ id: paymentIdNum }); // Obtener datos del pago por ID
            // --- FIN Obtener pago v3+ ---

            if (!paymentInfo) {
                // Esto no debería ocurrir si MP envió el webhook, pero por si acaso
                throw new Error(`No se encontró información para el pago ${paymentIdNum} en Mercado Pago.`);
            }

            // Obtener la referencia externa del pago
            externalReference = paymentInfo?.external_reference;

            // Procesar solo si el pago fue aprobado
            if (paymentInfo?.status === 'approved') {
                console.log(`Pago ${paymentIdNum} aprobado (v3). Ref: ${externalReference}`);

                // --- Evitar Procesamiento Duplicado ---
                // Buscar si ya existe una Venta (Sale) con este ID de pago de MP
                const existingSale = await em.findOne(Sale, { mpPaymentId: paymentIdNum.toString() });
                if (existingSale) {
                    console.log(`Venta para Pago ${paymentIdNum} ya fue procesada anteriormente (ID Venta: ${existingSale.id}). Ignorando webhook.`);
                    return res.sendStatus(200); // OK, ya se procesó
                }
                // --- Fin Evitar Duplicado ---

                // Validar que tengamos la referencia externa
                if (!externalReference) {
                     // Loguear error crítico y responder OK a MP para evitar reintentos infinitos
                     console.error(`¡ERROR CRÍTICO! Pago ${paymentIdNum} aprobado pero no tiene external_reference. Datos del pago:`, paymentInfo);
                     return res.sendStatus(200); // Aceptar webhook pero loguear error
                }

                // --- Parsear external_reference para obtener detalles de la compra ---
                const parts = externalReference.split('|');
                if (parts.length < 5) { // showId|timetableId|userId|tickets|timestamp
                    throw new Error(`External reference ${externalReference} con formato inválido.`);
                }
                const showId = parseInt(parts[0], 10);
                const timetableId = parseInt(parts[1], 10);
                const userId = parts[2] === 'guest' ? null : parseInt(parts[2], 10);
                const ticketsString = parts[3];
                // Parsear la cadena de tickets (typeId:quantity,...)
                const tickets: { typeId: number | null, quantity: number }[] = ticketsString.split(',')
                    .map(pair => {
                        const [typeIdStr, qtyStr] = pair.split(':');
                        const quantity = parseInt(qtyStr, 10);
                        const typeId = typeIdStr === 'null' ? null : parseInt(typeIdStr, 10);
                        // Validar números parseados
                        if (isNaN(quantity) || (typeId !== null && isNaN(typeId))) {
                            console.warn(`Par inválido encontrado en ticketsString de external reference: ${pair}`);
                            return null; // Marcar como inválido para filtrar después
                        }
                        return { typeId, quantity };
                    })
                    .filter(t => t !== null && t.quantity > 0) as { typeId: number | null, quantity: number }[]; // Filtrar nulos/inválidos y asegurar tipo

                // Validar IDs parseados y que haya tickets válidos
                if (isNaN(showId) || isNaN(timetableId) || (parts[2] !== 'guest' && (userId === null || isNaN(userId))) || tickets.length === 0) {
                     throw new Error(`Error parseando datos de external reference ${externalReference}.`);
                }
                console.log(`Datos parseados de Ref:`, { showId, timetableId, userId, tickets });
                // --- FIN PARSEO ---


                // --- INICIO TRANSACCIÓN ---
                // Ejecutar la lógica de negocio dentro de una transacción de base de datos
                await em.transactional(async (transactionalEm) => {
                    // Usar 'transactionalEm' para todas las operaciones dentro de la transacción

                    // 1. Obtener Show y ShowRoom (con bloqueo si es necesario y soportado)
                    const show = await transactionalEm.findOneOrFail(Show, { id: showId }, { populate: ['showRoom'] });
                    const roomCapacity = Number(show.showRoom.capacity);
                     if (isNaN(roomCapacity)) {
                         // Abortar transacción si la capacidad no es válida
                         throw new Error(`Capacidad inválida para ShowRoom ${show.showRoom.id}`);
                     }

                    // 2. RE-VERIFICACIÓN DE CAPACIDAD (CRUCIAL DENTRO DE LA TX)
                    // Contar tickets ya vendidos para ESTE horario específico
                    const currentTicketsCount = await transactionalEm.count(Ticket, {
                        showTicket: showId,      // De esta función
                        timetable: timetableId // De este horario
                    });
                    // Calcular cuántos tickets se están comprando ahora
                    const totalTicketsRequested = tickets.reduce((sum, t) => sum + t.quantity, 0);

                    // Si la suma excede la capacidad, abortar la transacción
                    if ((currentTicketsCount + totalTicketsRequested) > roomCapacity) {
                        console.error(`FALLO TRANSACCIÓN por capacidad: Show ${showId}, TT ${timetableId}. Req ${totalTicketsRequested}, Exists ${currentTicketsCount}, Cap ${roomCapacity}. Pago ${paymentIdNum}`);
                        throw new Error(`Capacidad excedida (${roomCapacity}). Solo quedan ${roomCapacity - currentTicketsCount} asientos.`);
                    }

                    // 3. Crear la entidad Sale
                    const sale = transactionalEm.create(Sale, {
                        amount: totalTicketsRequested, // Cantidad total de tickets en esta venta
                        total_price: Number(paymentInfo.transaction_amount), // Monto total pagado a MP
                        dateTime: new Date(paymentInfo.date_approved || Date.now()), // Fecha de aprobación o actual
                        mpPaymentId: paymentIdNum?.toString(), // Guardar ID de pago de MP
                        mpExternalReference: externalReference, // Guardar la referencia
                        // Asignar usuario si existe, si no, dejar indefinido (asumiendo userSale es opcional '?')
                        userSale: userId ? transactionalEm.getReference(User, userId) : undefined
                    });
                    // Persistir la venta para obtener su ID DENTRO de la transacción
                    await transactionalEm.persist(sale);

                    // 4. Crear las entidades Ticket asociadas a la Venta
                    for (const ticketInfo of tickets) { // Iterar sobre los tickets parseados
                        const quantity = Number(ticketInfo.quantity);
                        let ticketTypeRef = null; // Referencia al tipo de ticket (puede ser null)
                        // Si tiene un typeId, obtener la referencia a TicketType
                        if (ticketInfo.typeId !== null) {
                            ticketTypeRef = transactionalEm.getReference(TicketType, ticketInfo.typeId);
                        }
                        // Crear 'quantity' número de tickets de este tipo
                        for (let i = 0; i < quantity; i++) {
                            const ticket = transactionalEm.create(Ticket, {
                                type: `TICKET-${sale.id}-${Date.now().toString(36)}-${i}`, // Generar un código único
                                ticketSale: sale, // Asociar con la Venta creada en esta TX
                                showTicket: transactionalEm.getReference(Show, showId), // Asociar con la Función
                                timetable: transactionalEm.getReference(Timetable, timetableId), // Asociar con el Horario
                                ticketType: ticketTypeRef // Asociar con el Tipo (o null si es general)
                                // row y column podrían asignarse aquí si hubiera selección de asientos
                            });
                             // Persistir cada ticket DENTRO de la transacción
                             await transactionalEm.persist(ticket);
                        }
                    }
                    // MikroORM hará flush automáticamente al finalizar la transacción exitosa
                    console.log(`Venta ${sale.id} y ${totalTicketsRequested} tickets creados en transacción para Pago ${paymentIdNum}`);

                }); // --- FIN TRANSACCIÓN ---

                // Si la transacción fue exitosa, no hay PendingSale que actualizar

            } else { // Si el estado del pago no es 'approved'
                 // Usar 'externalReference' que ahora está en scope
                 console.log(`Pago ${paymentIdNum} no aprobado (v3). Estado: ${paymentInfo?.status}. Ref: ${externalReference || '(no encontrada)'}`);
                 // Podrías añadir lógica aquí si necesitas manejar otros estados (rejected, pending, etc.)
            }

            // Responder OK a Mercado Pago para confirmar recepción del webhook
            res.sendStatus(200);

        } catch (error: any) { // Capturar cualquier error durante el procesamiento del webhook
            // Usar 'externalReference' y 'paymentIdNum' que ahora están en scope para logging
            console.error(`Error CRÍTICO procesando webhook v3 para Pago ${paymentIdNum}, Ref ${externalReference || '(no encontrada)'}:`, error);
            // SDK v3 puede tener info en error.cause o error.response.data
            const mpErrorBody = error.cause?.response?.data || error.response?.data;
            console.error("Detalles del error MP v3:", mpErrorBody || error);
            // Responder error 500 para indicar a MP que hubo un problema y podría reintentar
            res.status(500).send(`Error procesando webhook v3: ${error.message}`);
        }
    } else { // Si el tópico/tipo no es 'payment' o falta el ID
         console.log('Webhook ignorado (sin ID de pago válido o tópico/tipo incorrecto)');
         // Responder OK para que MP no reintente webhooks no relevantes
        res.sendStatus(200);
    }
}


// --- Resto de funciones CRUD estándar para Sale (findAll, findOne, etc.) ---
// Deben estar definidas y exportadas si las necesitas en otras partes

// Función para sanitizar datos (ejemplo básico)
function sanitizeSaleInput(req: Request, res: Response, next: NextFunction) {
    req.body.sanitizedInput = {
      amount: req.body.amount,
      dateTime: req.body.date_and_time, // Asegúrate que el formato sea compatible con Date
      total_price: req.body.total_price,
      userSaleId: req.body.userSaleId, // Asumiendo que pasas el ID del usuario
    }
    // Eliminar propiedades undefined
    Object.keys(req.body.sanitizedInput).forEach((key) => {
      if (req.body.sanitizedInput[key] === undefined) {
        delete req.body.sanitizedInput[key]
      }
    })
    next();
}

// Encontrar todas las ventas
async function findAll (req: Request, res: Response) {
  try{
    // Popula relaciones al listar
    const sales = await em.find(Sale, {}, { populate: ['userSale', 'tickets'] });
    res.status(200).json({message: 'find all sales', data: sales});
  } catch (error: any){
    console.error("Error en findAll Sales:", error);
    res.status(500).json({ message: error.message || 'Error al buscar ventas' });
  }
}

// Encontrar una venta por ID
async function findOne (req: Request, res: Response) {
     try{
       const id = Number.parseInt(req.params.id);
       if (isNaN(id)) return res.status(400).json({ message: 'ID de venta inválido' });

       // Popula relaciones necesarias al ver una venta específica
       const sale = await em.findOne(Sale, { id }, { populate: ['userSale', 'tickets', 'tickets.showTicket', 'tickets.timetable', 'tickets.ticketType'] });

       if (!sale) {
            return res.status(404).json({ message: 'Venta no encontrada'});
       }
       res.status(200).json({message: 'found sale', data: sale});

     } catch (error: any){
       console.error(`Error en findOne Sale (${req.params.id}):`, error);
       res.status(500).json({ message: error.message || 'Error al buscar la venta'});
     }
}

// Función 'create' manual (probablemente no necesaria si se usa webhook)
async function create (req: Request, res: Response) {
  try{
    const input = req.body.sanitizedInput;
    const sale = em.create(Sale, {
        amount: input.amount,
        dateTime: input.dateTime ? new Date(input.dateTime) : new Date(),
        total_price: input.total_price,
        userSale: input.userSaleId ? em.getReference(User, input.userSaleId) : undefined // Asume opcional
    });
    await em.flush();
    res.status(201).json({ message: 'Venta manual creada (DEBUG)', data: sale});
  } catch (error: any){
    console.error("Error en create Sale:", error);
    res.status(500).json({ message: error.message || 'Error al crear venta manual'});
  }
}


// Actualizar una venta (uso limitado)
async function update (req: Request, res: Response) {
  try{
    const id = Number.parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: 'ID de venta inválido' });

    const saleRef = await em.findOne(Sale, { id });
    if (!saleRef) return res.status(404).json({ message: 'Venta no encontrada para actualizar' });

    const updateData = req.body;
    // Evitar actualizar campos críticos
    delete updateData.id;
    delete updateData.userSaleId;
    delete updateData.mpPaymentId;
    delete updateData.mpExternalReference;
    // Puedes permitir actualizar otros campos si tiene sentido (ej. notas internas)

    em.assign(saleRef, updateData);
    await em.flush();
    res.status(200).json({message: 'Venta actualizada'});
  } catch (error: any){
    console.error(`Error en update Sale (${req.params.id}):`, error);
    res.status(500).json({ message: error.message || 'Error al actualizar la venta'});
  }
}

// Eliminar una venta (¡Usar con precaución!)
async function remove(req: Request, res: Response) {
  try{
    const id = Number.parseInt(req.params.id);
     if (isNaN(id)) return res.status(400).json({ message: 'ID de venta inválido' });

    const saleToRemove = await em.findOne(Sale, { id });
    if (!saleToRemove) {
        return res.status(404).json({ message: 'Venta no encontrada para eliminar' });
    }

    // Considera la lógica de negocio: ¿realmente se debe borrar o marcar como cancelada?
    // Si borras, ¿qué pasa con los tickets asociados? (MikroORM podría borrarlos en cascada si está configurado)
    await em.removeAndFlush(saleToRemove);
    res.status(200).send({message: 'Venta eliminada'});

  } catch (error: any){
    console.error(`Error en remove Sale (${req.params.id}):`, error);
    res.status(500).json({ message: error.message || 'Error al eliminar la venta'});
  }
}

// Asegúrate de exportar todas las funciones necesarias para tus rutas
export { sanitizeSaleInput, findAll, findOne, create, update, remove, handleWebhook, createPreference };