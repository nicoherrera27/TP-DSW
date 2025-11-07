import React, { useState, useEffect, useMemo } from 'react';
import '../../styles/ticket-selection.css';

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
    availableCapacity: number;
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

interface PreparedTicket {
    typeId: number | null;
    quantity: number;
    description: string;
    unitPrice: number;
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
        if (Object.keys(quantities).length === 0) return 0;
        return Object.values(quantities).reduce((sum, quantity) => sum + (quantity || 0), 0);
    }, [quantities]);

    // Verificamos si se pueden agregar más tickets según la capacidad disponible
    const canAddMoreTickets = useMemo(() => {
         const capacity = Number(showDetails.availableCapacity);
         return !isNaN(capacity) && currentTotalTickets < capacity;
    }, [currentTotalTickets, showDetails.availableCapacity]); 

    const handleQuantityChange = (key: string, delta: number) => {
        const capacity = Number(showDetails.availableCapacity);
        
        if (delta > 0 && !canAddMoreTickets) {
            const messageText = `Maximum capacity reached (${capacity} seats available).`;
            setMessage(messageText);
            setIsError(true);
            setTimeout(() => {
                 setMessage(prev => prev === messageText ? '' : prev);
            }, 3000);
            return; 
        }

        setQuantities(prev => {
            const currentQuantity = prev[key] || 0;
            const newQuantity = Math.max(0, currentQuantity + delta);
            const proposedTotal = Object.entries(prev).reduce((sum, [k, q]) => sum + (k === key ? newQuantity : (q || 0)), 0);

            // Verificar si el total propuesto excede la capacidad
            if (!isNaN(capacity) && proposedTotal > capacity) {
                 const messageText = `Maximum capacity reached (${capacity} seats available).`;
                setMessage(messageText);
                 setIsError(true);
                 setTimeout(() => {
                    setMessage(prev => prev === messageText ? '' : prev);
                 }, 3000);
                 return prev; 
            }
            return { ...prev, [key]: newQuantity };
        });

         setMessage(prevMessage => {
             if (prevMessage && isError) {
                 setIsError(false);
                 return ''; 
             }
             return prevMessage;
        });
    };

    // Calcular el precio total
    const ticketsToPurchase = useMemo((): PreparedTicket[] => {
        if (Object.keys(quantities).length === 0) return [];
        
        return Object.entries(quantities)
            .filter(([key, quantity]) => quantity > 0)
            .map(([key, quantity]) => {
                if (key === 'general') {
                    return { 
                        typeId: null, 
                        quantity, 
                        description: 'General ticket',
                        unitPrice: Number(showDetails.basePrice)
                    };
                } else {
                    const typeId = parseInt(key.replace('type_', ''), 10);
                    const ticketType = ticketTypes.find(t => t.id === typeId);
                    const unitPrice = Number(showDetails.basePrice) * (1 - (ticketType?.bonification || 0));
                    return { 
                        typeId, 
                        quantity,
                        description: ticketType?.description || 'Ticket',
                        unitPrice: unitPrice 
                    };
                }
            });
    }, [quantities, ticketTypes, showDetails.basePrice]);
    const totalPrice = useMemo(() => {
        return ticketsToPurchase.reduce((sum, ticket) => {
            return sum + (ticket.unitPrice * ticket.quantity);
        }, 0);
    }, [ticketsToPurchase]);

    const formattedDate = useMemo(() => {
        const dateStr = showDetails.date;
        const dateParts = typeof dateStr === 'string' ? dateStr.split('-') : [];
        if (dateParts.length === 3) {
            const year = parseInt(dateParts[0], 10);
            const month = parseInt(dateParts[1], 10) - 1; 
            const day = parseInt(dateParts[2], 10);
            if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
                const dateObj = new Date(Date.UTC(year, month, day));
                 return dateObj.toLocaleDateString('en-US', {
                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC'
                });
            }
        }
        return dateStr || 'Invalid date';
    }, [showDetails.date]);


    // Manejar click en "Ir a Pagar"
    const handleProceedToPayment = async () => {
        setIsLoading(true);
        setMessage('');
        setIsError(false);

        if (ticketsToPurchase.length === 0) {
            setMessage('You must select at least one ticket to proceed to payment.');
            setIsError(true);
            setIsLoading(false);
            return;
        }
        const capacity = Number(showDetails.availableCapacity); 
        if (isNaN(capacity) || currentTotalTickets > capacity) {
             setMessage(`The total number of tickets (${currentTotalTickets}) exceeds the available capacity (${capacity}). Please adjust your selection.`);
             setIsError(true);
             setIsLoading(false);
             return;
        }

        try {
            const checkoutData = {
                showDetails: { 
                    ...showDetails, 
                    roomCapacity: showDetails.availableCapacity 
                },
                tickets: ticketsToPurchase,
                totalPrice: totalPrice,    
                showId: showDetails.showId,
                timetableId: showDetails.timetableId
            };
            
            sessionStorage.setItem('checkoutData', JSON.stringify(checkoutData));
            window.location.href = '/checkout';

        } catch (error: any) {
            console.error();
            setMessage(`Error preparing checkout`);
            setIsError(true);
            setIsLoading(false);
        }
    };
    // Si la capacidad disponible es 0, no mostramos el selector.
    if (showDetails.availableCapacity === 0) {
        return (
            <div className="ticket-selection-container">
                <div className="show-info">
                    <h2>{showDetails.movieName}</h2>
                    <p><strong>Room:</strong> {showDetails.roomName}</p>
                    <p><strong>Time:</strong> {showDetails.time}</p>
                </div>
                <div className="summary">
                    <p className="message sold-out-message">Function sold out. No seats available.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="ticket-selection-container">
            <div className="show-info">
                <h2>{showDetails.movieName}</h2>
                <p><strong>Room:</strong> {showDetails.roomName}</p>
                <p><strong>Date:</strong> {formattedDate}</p>
                <p><strong>Time:</strong> {showDetails.time}</p>
                <p><strong>Format:</strong> {showDetails.format} ({showDetails.variant})</p>
                <p><strong>Base Price per Ticket:</strong> ${Number(showDetails.basePrice).toFixed(2) || 'N/A'}</p>
                <p className="seats-info"><strong>Available Seats:</strong> {showDetails.availableCapacity}</p>
            </div>

            <div className="ticket-section">

                {/* Entrada General */}
                <div className="ticket-row">
                    <span className="ticket-description">General Ticket (${Number(showDetails.basePrice).toFixed(2) || 'N/A'})</span>
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
                {message && <p className={`message ${isError ? 'error' : 'success'}`}>{message}</p>}
                <h3>Total: ${totalPrice.toFixed(2)}</h3>
                <button
                    className="pay-button"
                    onClick={handleProceedToPayment}
                    disabled={isLoading || totalPrice <= 0 || currentTotalTickets === 0}
                >
                    {isLoading ? 'Processing...' : 'Proceed to Payment with Mercado Pago'}
                </button>
            </div>
        </div>
    );
};

export default TicketSelection;