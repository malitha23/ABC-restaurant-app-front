// src/pages/ReservationPage.js
import React, { useState } from 'react';
import axios from 'axios';

const ReservationPage = () => {
    const [userId, setUserId] = useState('');
    const [reservationDate, setReservationDate] = useState('');
    const [numOfPeople, setNumOfPeople] = useState(1);
    const [serviceType, setServiceType] = useState('dine-in');

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('/api/reservations', {
                user_id: userId,
                reservation_date: reservationDate,
                num_of_people: numOfPeople,
                service_type: serviceType,
            });
            alert(`Reservation made successfully: ${response.data.message}`);
        } catch (error) {
            console.error('Error making reservation:', error);
            alert('Failed to make reservation');
        }
    };

    return (
        <div>
            <h1>Make a Reservation</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    User ID:
                    <input type="text" value={userId} onChange={(e) => setUserId(e.target.value)} />
                </label>
                <br />
                <label>
                    Reservation Date:
                    <input type="datetime-local" value={reservationDate} onChange={(e) => setReservationDate(e.target.value)} />
                </label>
                <br />
                <label>
                    Number of People:
                    <input type="number" min="1" value={numOfPeople} onChange={(e) => setNumOfPeople(e.target.value)} />
                </label>
                <br />
                <label>
                    Service Type:
                    <select value={serviceType} onChange={(e) => setServiceType(e.target.value)}>
                        <option value="dine-in">Dine-In</option>
                        <option value="delivery">Delivery</option>
                    </select>
                </label>
                <br />
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

export default ReservationPage;
