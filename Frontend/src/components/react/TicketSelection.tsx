import React, { useState, useEffect, useMemo } from 'react';
import { api } from '@/services/apiClient';
// Asegúrate que la ruta sea correcta según dónde guardes el CSS
import '../../styles/ticket-selection.css';

// Tipos para las props
interface ShowDetails {
    movieName: string;
    roomName: string;
    date: string;
    time: string;
    format: string;
    variant: string;
    basePrice: number;
    showId: number;
    timetableId: number;
    roomCapacity: number; // <-- Capacidad añadida
}

interface TicketType {
    id: number;
    description: string;
    bonification: number;
}

interface TicketSelectionProps {
    showDetails: ShowDetails;
    ticketTypes: TicketType[];
}

const TicketSelection: React.FC<TicketSelectionProps> = ({ showDetails, ticketTypes }) => {
    const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    // Inicializar cantidades a 0
    useEffect(() => {
        const initialQuantities: { [key: string]: number } = { general: 0 };
        ticketTypes.forEach(type => {
            initialQuantities[`type_${type.id}`] = 0;
        });
        setQuantities(initialQuantities);
    }, [ticketTypes]);

    // Calcular total de tickets seleccionados actualmente
    const currentTotalTickets = useMemo(() => {
        // Asegurarse de que quantities esté inicializado antes de calcular
        if (Object.keys(quantities).length === 0) return 0;
        return Object.values(quantities).reduce((sum, quantity) => sum + (quantity || 0), 0);
    }, [quantities]);

    // Calcular si se pueden añadir más entradas
    const canAddMoreTickets = useMemo(() => {
         // Asegurarse de que roomCapacity es un número válido
         const capacity = Number(showDetails.roomCapacity);
         return !isNaN(capacity) && currentTotalTickets < capacity;
    }, [currentTotalTickets, showDetails.roomCapacity]);


    // Función para aumentar/disminuir cantidad
    const handleQuantityChange = (key: string, delta: number) => {
        // Validar antes de intentar añadir
        if (delta > 0 && !canAddMoreTickets) {
            setMessage(`Se alcanzó la capacidad máxima de la sala (${showDetails.roomCapacity} asientos).`);
            setIsError(true);
            // Borrar el mensaje después de 3 segundos
            setTimeout(() => {
                 // Solo borrar si el mensaje actual es el de capacidad
                 setMessage(prev => prev === `Se alcanzó la capacidad máxima de la sala (${showDetails.roomCapacity} asientos).` ? '' : prev);
                 // No reseteamos isError aquí para que el estilo de error permanezca si hay otro error
            }, 3000);
            return; // Detener ejecución
        }

        setQuantities(prev => {
            const currentQuantity = prev[key] || 0;
            const newQuantity = Math.max(0, currentQuantity + delta); // No permitir negativos

            // Calcular el total *propuesto* si se aplicara el cambio
            const proposedTotal = Object.entries(prev)
                              .reduce((sum, [k, q]) => sum + (k === key ? newQuantity : (q || 0)), 0);

            // Verificar si el total propuesto excede la capacidad
            const capacity = Number(showDetails.roomCapacity);
            if (!isNaN(capacity) && proposedTotal > capacity) {
                 // Si se excediera, no actualiza y muestra mensaje
                setMessage(`Se alcanzó la capacidad máxima de la sala (${capacity} asientos).`);
                 setIsError(true);
                 setTimeout(() => {
                    setMessage(prev => prev === `Se alcanzó la capacidad máxima de la sala (${capacity} asientos).` ? '' : prev);
                 }, 3000);
                 return prev; // Devuelve el estado anterior sin aplicar el cambio
            }
            // Si no excede, aplica el cambio
            return { ...prev, [key]: newQuantity };
        });

        // Limpiar mensaje si la acción fue válida y era un mensaje de error PREVIO
         setMessage(prevMessage => {
             if (prevMessage && isError) {
                 setIsError(false); // Resetea el estado de error
                 return ''; // Limpia el mensaje
             }
             return prevMessage; // Mantiene cualquier otro mensaje
        });
    };

    // Calcular el precio total
    const totalPrice = useMemo(() => {
        let total = 0;
        const basePrice = Number(showDetails.basePrice) || 0; // Asegurar que sea número
        total += (quantities['general'] || 0) * basePrice;
        ticketTypes.forEach(type => {
            const quantity = quantities[`type_${type.id}`] || 0;
            const bonification = Number(type.bonification) || 0; // Asegurar que sea número
            const price = basePrice * (1 - bonification);
            total += quantity * price;
        });
        return total;
    }, [quantities, ticketTypes, showDetails.basePrice]);

    // Manejar click en "Ir a Pagar"
    const handleProceedToPayment = async () => {
        setIsLoading(true);
        setMessage('');
        setIsError(false);

        const ticketsToPurchase = Object.entries(quantities)
            .filter(([key, quantity]) => quantity > 0)
            .map(([key, quantity]) => {
                if (key === 'general') {
                    return { typeId: null, quantity };
                } else {
                    const typeId = parseInt(key.replace('type_', ''), 10);
                    return { typeId, quantity };
                }
            });

        if (ticketsToPurchase.length === 0) {
            setMessage('Debes seleccionar al menos una entrada.');
            setIsError(true);
            setIsLoading(false);
            return;
        }

         // Validar capacidad ANTES de llamar al backend
         const capacity = Number(showDetails.roomCapacity);
         if (isNaN(capacity) || currentTotalTickets > capacity) {
             setMessage(`La cantidad total de entradas (${currentTotalTickets}) excede la capacidad de la sala (${capacity}). Ajusta tu selección.`);
             setIsError(true);
             setIsLoading(false);
             return;
         }

        try {
            // Llamar al endpoint del backend para crear la preferencia de MP
            const response = await api.post<{ init_point: string }>('/api/sales/create-preference', {
                showId: showDetails.showId,
                timetableId: showDetails.timetableId,
                tickets: ticketsToPurchase
            });

            if (response.init_point) {
                window.location.href = response.init_point;
            } else {
                throw new Error('No se recibió la URL de pago desde el servidor.');
            }
            // No setIsLoading(false) porque hay redirección

        } catch (error: any) {
            console.error("Error al crear preferencia de pago:", error);
            setMessage(`Error al iniciar el proceso de pago: ${error.message}`);
            setIsError(true);
            setIsLoading(false);
        }
    };

    // Formatear fecha para mostrarla
    const formattedDate = useMemo(() => {
        const dateStr = showDetails.date;
        // Intentar parsear como YYYY-MM-DD
        const dateParts = typeof dateStr === 'string' ? dateStr.split('-') : [];
        if (dateParts.length === 3) {
            const year = parseInt(dateParts[0], 10);
            const month = parseInt(dateParts[1], 10) - 1; // Meses son 0-indexados
            const day = parseInt(dateParts[2], 10);
            if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
                // Crear fecha en UTC para evitar problemas de zona horaria local
                const dateObj = new Date(Date.UTC(year, month, day));
                 return dateObj.toLocaleDateString('es-AR', {
                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC'
                });
            }
        }
        // Fallback si el formato no es el esperado
        return dateStr || 'Fecha inválida';
    }, [showDetails.date]);


    return (
        <div className="ticket-selection-container">
            <div className="show-info">
                <h2>{showDetails.movieName}</h2>
                <p><strong>Sala:</strong> {showDetails.roomName}</p>
                <p><strong>Fecha:</strong> {formattedDate}</p>
                <p><strong>Hora:</strong> {showDetails.time}</p>
                <p><strong>Formato:</strong> {showDetails.format} ({showDetails.variant})</p>
                <p><strong>Precio Base por Entrada:</strong> ${Number(showDetails.basePrice).toFixed(2) || 'N/A'}</p>
            </div>

            <div className="ticket-section">

                {/* Entrada General */}
                <div className="ticket-row">
                    <span className="ticket-description">Entrada General (${Number(showDetails.basePrice).toFixed(2) || 'N/A'})</span>
                    <div className="quantity-control">
                        <button onClick={() => handleQuantityChange('general', -1)} disabled={(quantities['general'] || 0) <= 0}>-</button>
                        <span>{quantities['general'] || 0}</span>
                        <button onClick={() => handleQuantityChange('general', 1)} disabled={!canAddMoreTickets}>+</button>
                    </div>
                </div>

                {/* Tipos de Entrada Especiales */}
                {ticketTypes.map(type => {
                    const basePrice = Number(showDetails.basePrice) || 0;
                    const bonification = Number(type.bonification) || 0;
                    const price = basePrice * (1 - bonification);
                    const key = `type_${type.id}`;
                    return (
                        <div key={type.id} className="ticket-row">
                            <span className="ticket-description">
                                {type.description} (${price.toFixed(2)})

                            </span>
                            <div className="quantity-control">
                                <button onClick={() => handleQuantityChange(key, -1)} disabled={(quantities[key] || 0) <= 0}>-</button>
                                <span>{quantities[key] || 0}</span>
                                <button onClick={() => handleQuantityChange(key, 1)} disabled={!canAddMoreTickets}>+</button>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="summary">
                 {/* Mensaje de estado/error */}
                {message && <p className={`message ${isError ? '' : 'success'}`}>{message}</p>}
                <h3>Total a Pagar: ${totalPrice.toFixed(2)}</h3>
                <button
                    className="pay-button"
                    onClick={handleProceedToPayment}
                    // Deshabilitar si está cargando, si no hay $ total, o si no hay tickets seleccionados
                    disabled={isLoading || totalPrice <= 0 || currentTotalTickets === 0}
                >
                    {isLoading ? 'Procesando...' : 'Ir a Pagar con Mercado Pago'}
                </button>
            </div>
        </div>
    );
};

export default TicketSelection;