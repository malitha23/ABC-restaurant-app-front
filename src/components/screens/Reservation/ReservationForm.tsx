import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './ReservationForm.css';
import Reservation from "../../../assets/Reservation.jpg";
import Navbar from '../../Navbar/Navbar';
import OverlayPanel from '../../OverlayPanel/OverlayPanel';
import Swal from 'sweetalert2';

const ReservationForm = () => {
    const [reservationDate, setReservationDate] = useState('');
    const [numOfPeople, setNumOfPeople] = useState(1);
    const [serviceType, setServiceType] = useState('traditional');
    const [reservationMethod, setReservationMethod] = useState('phone');
    const [remark, setRemark] = useState('');
    const [isFormVisible, setIsFormVisible] = useState(false); // State to toggle form visibility


    const handleCloseOverlay = () => {
        setIsFormVisible(false); // Hide the overlay panel
    };

    const handleReservation = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('userToken');
            const response = await axios.post('http://localhost:3000/api/reservations/make', {
                reservation_date: reservationDate,
                num_of_people: numOfPeople,
                service_type: serviceType,
                reservation_method: reservationMethod,
                remark,
            },
            {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              });
            Swal.fire({
                title: 'Success!',
                text: response.data.message || 'Reservation created successfully',
                icon: 'success',
                confirmButtonText: 'OK'
            });
            setIsFormVisible(false);
        } catch (error) {
            Swal.fire({
                title: 'Error!',
                text: 'Failed to create reservation',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };

    // Toggle the form's visibility
    const toggleFormVisibility = () => {
        setIsFormVisible(!isFormVisible);
    };

    return (
        <>
            <Navbar />
            <div className="reservation-page">
                {/* Page Header and Description */}

                {/* Reservation Image with Button in the Middle */}
                <div className="reservation-image-container">
                    <img src={Reservation} alt="ABC Restaurant" className="reservation-image" />
                    <header className="reservation-header">
                        <p>
                            Enjoy a memorable dining experience by reserving your table in advance.
                            Choose from our convenient options for traditional and online reservations.
                            Whether it's a cozy dinner for two or a celebration with friends, we've got you covered.
                        </p>
                        <button onClick={toggleFormVisibility} className="open-form-button">
                            Reserve a Table
                        </button>
                    </header>

                </div>

                {/* Reservation Form (Initially hidden) */}
                <OverlayPanel open={isFormVisible} onClose={handleCloseOverlay}>
                    {isFormVisible && (
                        <form onSubmit={handleReservation} className="reservation-form">
                            <h2>Make a Reservation</h2>
                            <label>
                                Date and Time:
                                <input
                                    type="datetime-local"
                                    value={reservationDate}
                                    onChange={(e) => setReservationDate(e.target.value)}
                                    required
                                />
                            </label>
                            <label>
                                Number of People:
                                <input
                                    type="number"
                                    value={numOfPeople}
                                    min="1"
                                    onChange={(e) => setNumOfPeople(parseInt(e.target.value))}
                                    required
                                />
                            </label>
                            <label>
                                Service Type:
                                <select value={serviceType} onChange={(e) => setServiceType(e.target.value)} required>
                                    <option value="dinner">Dinner</option>
                                    <option value="lunch">Lunch</option>
                                    <option value="breakfast">Breakfast</option>
                                </select>
                            </label>


                            <label>
                                Remark:
                                <textarea
                                    value={remark}
                                    onChange={(e) => setRemark(e.target.value)}
                                    maxLength={250}
                                />
                            </label>
                            <button type="submit">Submit Reservation</button>
                        </form>
                    )}
                </OverlayPanel>
            </div>
        </>
    );
};

export default ReservationForm;
