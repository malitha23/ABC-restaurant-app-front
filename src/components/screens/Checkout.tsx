import React, { useState } from 'react';
import './Checkout.css';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';

interface Item {
    id: number;
    name: string;
    price: string;
    quantity: number;
}

interface CheckoutProps {
    user: {
        first_name: string;
        last_name: string;
        username: string;
        address: string;
        phone_number: string;
        email: string;
    };
    cartItems?: Item[]; // Make cartItems optional
}

const Checkout: React.FC<CheckoutProps> = ({ user, cartItems = [] }) => {
    const [userInfo, setUserInfo] = useState({
        first_name: user.first_name,
        last_name: user.last_name,
        username: user.username,
        address: user.address,
        phone_number: user.phone_number,
        email: user.email,
    });

    const [selectedOption, setSelectedOption] = useState<string>('pickup'); // Default selection is 'pickup'
    const [selectedPayment, setSelectedPayment] = useState<string>('card'); // Default payment is 'card'

    const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedOption(event.target.value);
    };

    const handlePaymentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedPayment(event.target.value);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setUserInfo(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const totalAmount = cartItems
        .reduce((total, item) => total + parseFloat(item.price) * item.quantity, 0)
        .toFixed(2);

        const handleSubmitAddOrder = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/ordersRoutes/order', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        user: userInfo,
                        cartItems,
                        deliveryOption: selectedOption,
                        paymentOption: selectedPayment,
                    }),
                });
        
                if (response.ok) {
                    const result = await response.json();
                    toast.success(`Order placed successfully! Order ID: ${result.orderId}`);
                } else {
                    toast.error('Error placing the order.');
                }
            } catch (error) {
                console.error('Error:', error);
                toast.error('An error occurred while placing the order.');
            }
        };

    return (
        <div className="checkout-container">
            <ToastContainer />
            <h2 className="checkout-title">Checkout</h2>
            
            <div className="user-info">
                <h3 className="section-title">User Information</h3>
                <div className="user-details">
                    <label>
                        <strong>First Name:</strong>
                        <input
                            type="text"
                            name="first_name"
                            value={userInfo.first_name}
                            onChange={handleInputChange}
                        />
                    </label>
                    <label>
                        <strong>Last Name:</strong>
                        <input
                            type="text"
                            name="last_name"
                            value={userInfo.last_name}
                            onChange={handleInputChange}
                        />
                    </label>
                    <label>
                        <strong>Phone Number:</strong>
                        <input
                            type="text"
                            name="phone_number"
                            value={userInfo.phone_number}
                            onChange={handleInputChange}
                        />
                    </label>
                    <label>
                        <strong>Email:</strong>
                        <input
                            type="email"
                            name="email"
                            value={userInfo.email}
                            onChange={handleInputChange}
                        />
                    </label>
                    <br></br>
                    <label>
                        <strong>Address:</strong>
                        <input
                            type="text"
                            name="address"
                            value={userInfo.address}
                            onChange={handleInputChange}
                        />
                    </label>
                </div>
            </div>

            <div className="cart-summary">
                <h3 className="section-title">Order Summary</h3>
                {cartItems.map((item) => (
                    <div key={item.id} className="cart-item flex justify-between items-center border p-4 rounded-lg shadow-md">
                        <div className="item-info flex-1">
                            <p className="font-semibold">{item.name}:</p>
                        </div>
                        <div className="item-price text-right">
                            <p>{item.quantity} x Rs {item.price} = Rs {(parseFloat(item.price) * item.quantity).toFixed(2)}</p>
                        </div>
                    </div>
                ))}
                <div className="total-amount">
                    <p>Total Amount:</p>
                    <p>Rs {totalAmount}</p>
                </div>
            </div>

            {/* Delivery/Pickup Options */}
            <div className="options-container flex justify-between">
                <div className={`option p-4 border rounded-lg shadow-md ${selectedOption === 'pickup' ? 'selected' : ''}`}>
                    <label>
                        <input
                            type="radio"
                            name="deliveryOption"
                            value="pickup"
                            checked={selectedOption === 'pickup'}
                            onChange={handleOptionChange}
                        />
                        <h3 className="text-xl font-bold">In-store Pickup</h3>
                        <p>Pick up your order directly from our restaurant.</p>
                    </label>
                </div>
                <div className={`option p-4 border rounded-lg shadow-md ${selectedOption === 'delivery' ? 'selected' : ''}`}>
                    <label>
                        <input
                            type="radio"
                            name="deliveryOption"
                            value="delivery"
                            checked={selectedOption === 'delivery'}
                            onChange={handleOptionChange}
                        />
                        <h3 className="text-xl font-bold">Home Delivery</h3>
                        <p>Get your favorite dishes delivered to your doorstep.</p>
                    </label>
                </div>
            </div>

            {/* Payment Options */}
            <div className="payment-options-container flex justify-between mt-6">
                <div className={`option p-4 border rounded-lg shadow-md ${selectedPayment === 'card' ? 'selected' : ''}`}>
                    <label>
                        <input
                            type="radio"
                            name="paymentOption"
                            value="card"
                            checked={selectedPayment === 'card'}
                            onChange={handlePaymentChange}
                        />
                        <h3 className="text-xl font-bold">Card Payment</h3>
                        <p>Pay securely with your credit or debit card.</p>
                    </label>
                </div>
                <div className={`option p-4 border rounded-lg shadow-md ${selectedPayment === 'cash' ? 'selected' : ''}`}>
                    <label>
                        <input
                            type="radio"
                            name="paymentOption"
                            value="cash"
                            checked={selectedPayment === 'cash'}
                            onChange={handlePaymentChange}
                        />
                        <h3 className="text-xl font-bold">Cash Payment</h3>
                        <p>Pay with cash upon delivery or pickup.</p>
                    </label>
                </div>
            </div>

            <button
                className="btn-primary mt-6"
                onClick={()=>{
                   if(selectedPayment != 'card'){
                    handleSubmitAddOrder();
                   }
                }}
            >
                {selectedPayment === 'card' ? 'Pay Now' : 'Add Order'}
            </button>
        </div>
    );
};

export default Checkout;
