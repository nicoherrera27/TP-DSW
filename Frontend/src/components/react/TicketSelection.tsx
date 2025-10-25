import React, { useState, useEffect, useMemo } from 'react';
import { api } from '@/services/apiClient';
import '../../styles/ticket-selection.css'; // O la ruta correcta a tu archivo CSS

// Tipos para las props (igual que antes)
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
}

interface TicketType {
    id: number;
    description: string;
    bonification: number; // Ej: 0.25 para 25% descuento
}

interface TicketSelectionProps {
    showDetails: ShowDetails;
    ticketTypes: TicketType[];
}

const TicketSelection: React.FC<TicketSelectionProps> = ({ showDetails, ticketTypes }) => {
    // Estado y lógica (igual que antes)
    const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false); // Para distinguir mensajes

    useEffect(() => {
        const initialQuantities: { [key: string]: number } = { general: 0 };
        ticketTypes.forEach(type => {
            initialQuantities[`type_${type.id}`] = 0;
        });
        setQuantities(initialQuantities);
    }, [ticketTypes]);

    const handleQuantityChange = (key: string, delta: number) => {
        setQuantities(prev => {
            const currentQuantity = prev[key] || 0;
            const newQuantity = Math.max(0, currentQuantity + delta);
            return { ...prev, [key]: newQuantity };
        });
    };

    const totalPrice = useMemo(() => {
        let total = 0;
        total += (quantities['general'] || 0) * showDetails.basePrice;
        ticketTypes.forEach(type => {
            const quantity = quantities[`type_${type.id}`] || 0;
            const price = showDetails.basePrice * (1 - (type.bonification || 0));
            total += quantity * price;
        });
        return total;
    }, [quantities, ticketTypes, showDetails.basePrice]);

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

        try {
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

        } catch (error: any) {
            console.error("Error al crear preferencia de pago:", error);
            setMessage(`Error al iniciar el proceso de pago: ${error.message}`);
            setIsError(true);
            setIsLoading(false);
        }
    };

    const formattedDate = new Date(showDetails.date + 'T00:00:00-03:00').toLocaleDateString('es-AR', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'America/Argentina/Buenos_Aires'
    });


    return (
        // Aplicar la clase principal al contenedor
        <div className="ticket-selection-container">
            {/* Información de la Función */}
            <div className="show-info">
                <h2>{showDetails.movieName}</h2>
                <p><strong>Sala:</strong> {showDetails.roomName}</p>
                <p><strong>Fecha:</strong> {formattedDate}</p>
                <p><strong>Hora:</strong> {showDetails.time}</p>
                <p><strong>Formato:</strong> {showDetails.format} ({showDetails.variant})</p>
                <p><strong>Precio Base por Entrada:</strong> ${showDetails.basePrice.toFixed(2)}</p>
            </div>

            {/* Selección de Cantidad de Entradas */}
            <div className="ticket-section">
                <h3>Selecciona tus entradas:</h3>

                {/* Entrada General */}
                <div className="ticket-row">
                    <span className="ticket-description">Entrada General (${showDetails.basePrice.toFixed(2)})</span>
                    <div className="quantity-control">
                        <button onClick={() => handleQuantityChange('general', -1)} disabled={(quantities['general'] || 0) <= 0}>-</button>
                        <span>{quantities['general'] || 0}</span>
                        <button onClick={() => handleQuantityChange('general', 1)}>+</button>
                    </div>
                </div>

                {/* Tipos de Entrada Especiales */}
                {ticketTypes.map(type => {
                    const price = showDetails.basePrice * (1 - (type.bonification || 0));
                    const key = `type_${type.id}`;
                    return (
                        <div key={type.id} className="ticket-row">
                            <span className="ticket-description">
                                {type.description} (${price.toFixed(2)})
                                {type.bonification > 0 && <small className="discount-text"> ({(type.bonification * 100).toFixed(0)}% desc.)</small>}
                            </span>
                            <div className="quantity-control">
                                <button onClick={() => handleQuantityChange(key, -1)} disabled={(quantities[key] || 0) <= 0}>-</button>
                                <span>{quantities[key] || 0}</span>
                                <button onClick={() => handleQuantityChange(key, 1)}>+</button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Resumen y Botón de Pago */}
            <div className="summary">
                <h3>Total a Pagar: ${totalPrice.toFixed(2)}</h3>
                <button
                    className="pay-button" // Usar la clase base
                    onClick={handleProceedToPayment}
                    disabled={isLoading || totalPrice <= 0} // La lógica disabled se mantiene
                >
                    {isLoading ? 'Procesando...' : 'Ir a Pagar con Mercado Pago'}
                </button>
                {/* Mensaje de estado/error */}
                {message && <p className={`message ${isError ? '' : 'success'}`}>{message}</p>}
            </div>
        </div>
    );
};

export default TicketSelection;