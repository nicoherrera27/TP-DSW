import React, { useState, useEffect } from 'react';
import { api } from '@/services/apiClient';

// Interfaces para los datos que esperamos de sessionStorage
interface ShowDetails {
    movieName: string;
    roomName: string;
    date: string;
    time: string;
}
interface TicketData {
    typeId: number | null;
    quantity: number;
    description: string;
    unitPrice: number;
}
interface CheckoutData {
    showDetails: ShowDetails;
    tickets: TicketData[];
    totalPrice: number;
    showId: number;
    timetableId: number;
}

const CheckoutSimulated = () => {
    const [data, setData] = useState<CheckoutData | null>(null);
    const [selectedPayment, setSelectedPayment] = useState('dinero_disponible');
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Al cargar, lee los datos de la compra desde sessionStorage
        const storedData = sessionStorage.getItem('checkoutData');
        if (storedData) {
            setData(JSON.parse(storedData));
        } else {
            // Si no hay datos, es un error (quizás recargó la página)
            setMessage('No se encontraron datos de la compra. Vuelva a intentarlo.');
            setIsError(true);
        }
    }, []);

    const handleConfirmPurchase = async () => {
        if (!data) return;

        setIsLoading(true);
        setIsError(false);
        setMessage('');

        try {
            // Llamamos al nuevo endpoint del backend que sí guarda la venta
            const response = await api.post<{ message: string, saleId: number }>('/api/sales/create-sale-simulated', {
                showId: data.showId,
                timetableId: data.timetableId,
                tickets: data.tickets.map(t => ({ typeId: t.typeId, quantity: t.quantity, description: t.description })),
                totalPrice: data.totalPrice
            });
            
            // ¡Éxito!
            setMessage(`¡Compra confirmada! (ID de Venta: ${response.saleId}). Redirigiendo...`);
            setIsError(false);
            sessionStorage.removeItem('checkoutData'); // Limpiamos la sesión

            // Redirigimos al inicio después de 3 segundos
            setTimeout(() => {
                window.location.href = '/';
            }, 3000);

        } catch (error: any) {
            console.error("Error al confirmar la compra:", error);
            // Mostramos el error del backend (ej. "Capacidad excedida")
            setMessage(`Error: ${error.message || 'No se pudo procesar la compra.'}`);
            setIsError(true);
            setIsLoading(false);
        }
    };

    if (!data && !isError) {
        return <p>Cargando resumen de compra...</p>;
    }

    if (isError && !data) {
        return <p className="checkout-message error">{message}</p>;
    }
    
    if (!data) return null; 

    return (
        <div className="checkout-grid">
            {/* Columna Izquierda: Opciones de Pago */}
            <div className="payment-options">
                <h2>Elegí cómo pagar</h2>
                
                <div 
                    className={`payment-option ${selectedPayment === 'dinero_disponible' ? 'selected' : ''}`}
                    onClick={() => setSelectedPayment('dinero_disponible')}
                >
                    <input type="radio" name="paymentMethod" value="dinero_disponible" checked={selectedPayment === 'dinero_disponible'} readOnly />
                    <label htmlFor="dinero_disponible">Dinero disponible</label>
                </div>

                <div 
                    className={`payment-option ${selectedPayment === 'credito' ? 'selected' : ''}`}
                    onClick={() => setSelectedPayment('credito')}
                >
                    <input type="radio" name="paymentMethod" value="credito" checked={selectedPayment === 'credito'} readOnly />
                    <label htmlFor="credito">Nueva tarjeta de crédito</label>
                </div>

                <div 
                    className={`payment-option ${selectedPayment === 'debito' ? 'selected' : ''}`}
                    onClick={() => setSelectedPayment('debito')}
                >
                    <input type="radio" name="paymentMethod" value="debito" checked={selectedPayment === 'debito'} readOnly />
                    <label htmlFor="debito">Nueva tarjeta de débito</label>
                </div>
            </div>

            {/* Columna Derecha: Resumen de Compra */}
            <div className="summary-box">
                <h2>Resumen de compra</h2>
                
                {data.tickets.map((ticket, index) => (
                    <div key={index} className="summary-item">
                        <span>{ticket.quantity} x {ticket.description}</span>
                        <span>${(ticket.unitPrice * ticket.quantity).toFixed(2)}</span>
                    </div>
                ))}
                
                <div className="summary-total">
                    <span>Total</span>
                    <span>${data.totalPrice.toFixed(2)}</span>
                </div>

                <button 
                    className="confirm-button"
                    onClick={handleConfirmPurchase}
                    disabled={isLoading}
                >
                    {isLoading ? 'Confirmando...' : 'Confirmar Compra'}
                </button>

                {message && (
                    <p className={`checkout-message ${isError ? 'error' : 'success'}`}>
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
};

export default CheckoutSimulated;