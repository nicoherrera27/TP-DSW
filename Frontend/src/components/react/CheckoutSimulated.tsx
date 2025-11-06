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
    const [selectedPayment, setSelectedPayment] = useState('available_money');
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const storedData = sessionStorage.getItem('checkoutData');
        if (storedData) {
            setData(JSON.parse(storedData));
        } else {
            setMessage('No purchase data fetched. Please try again.');
            setIsError(true);
        }
    }, []);

    const handleConfirmPurchase = async () => {
        if (!data) return;

        setIsLoading(true);
        setIsError(false);
        setMessage('');

        try {
            // Llamamos a un endpoint del backend que guarda la venta
            const response = await api.post<{ message: string, saleId: number }>('/api/sales/create-sale-simulated', {
                showId: data.showId,
                timetableId: data.timetableId,
                tickets: data.tickets.map(t => ({ typeId: t.typeId, quantity: t.quantity, description: t.description })),
                totalPrice: data.totalPrice
            });

            setMessage(`¡Purchase confirmed! (Purchase ID: ${response.saleId}). Redirecting to Home Page...`);
            setIsError(false);
            sessionStorage.removeItem('checkoutData');

            // Redirigimos a la HomePage después de 3 segundos
            setTimeout(() => {
                window.location.href = '/';
            }, 3000);

        } catch (error: any) {
            setMessage(`Error confirming purchase`);
            setIsError(true);
            setIsLoading(false);
        }
    };

    if (!data && !isError) {
        return <p>Loading purchase summary...</p>;
    }

    if (isError && !data) {
        return <p className="checkout-message error">{message}</p>;
    }
    
    if (!data) return null; 

    return (
        <div className="checkout-grid">
            {/* Columna Izquierda: Opciones de Pago */}
            <div className="payment-options">
                <h2>Choose payment method</h2>
                
                <div 
                    className={`payment-option ${selectedPayment === 'available_money' ? 'selected' : ''}`}
                    onClick={() => setSelectedPayment('available_money')}
                >
                    <input type="radio" name="paymentMethod" value="available_money" checked={selectedPayment === 'available_money'} readOnly />
                    <label htmlFor="available_money">Available Money</label>
                </div>

                <div 
                    className={`payment-option ${selectedPayment === 'credit_card' ? 'selected' : ''}`}
                    onClick={() => setSelectedPayment('credit_card')}
                >
                    <input type="radio" name="paymentMethod" value="credit_card" checked={selectedPayment === 'credit_card'} readOnly />
                    <label htmlFor="credit_card">New Credit Card</label>
                </div>

                <div 
                    className={`payment-option ${selectedPayment === 'debit_card' ? 'selected' : ''}`}
                    onClick={() => setSelectedPayment('debit_card')}
                >
                    <input type="radio" name="paymentMethod" value="debit_card" checked={selectedPayment === 'debit_card'} readOnly />
                    <label htmlFor="debit_card">New Debit Card</label>
                </div>
            </div>

            {/* Columna Derecha: Resumen de Compra */}
            <div className="summary-box">
                <h2>Purchase summary</h2>
                
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
                    {isLoading ? 'Confirming...' : 'Confirm Purchase'}
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