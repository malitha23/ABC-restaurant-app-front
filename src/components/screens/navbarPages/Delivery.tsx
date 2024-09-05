import React from 'react';
import Navbar from '../../Navbar/Navbar';
import colombo_map from '../../../assets/colombo_map.png';

const Delivery: React.FC = () => {
    return (
        <div className="delivery-container">
            {/* Header Section */}
            <Navbar />

            {/* Delivery Options Section */}
            <section className="delivery-options p-8 bg-gray-100">
                <h2 className="text-2xl font-semibold mb-4">Delivery Options</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div className="option p-4 border rounded-lg shadow-md">
                        <h3 className="text-xl font-bold">In-store Pickup</h3>
                        <p>Pick up your order directly from our restaurant.</p>
                    </div>
                    <div className="option p-4 border rounded-lg shadow-md">
                        <h3 className="text-xl font-bold">Home Delivery</h3>
                        <p>Get your favorite dishes delivered to your doorstep.</p>
                    </div>
                </div>
            </section>

            {/* Delivery Area Map Section */}
            <section className="delivery-map p-8">
                <h2 className="text-2xl font-semibold mb-4">Delivery Areas</h2>
                {/* Include a map or an image of delivery areas */}
                <img src={colombo_map} alt="Delivery Areas Map" className="w-full h-64 object-cover rounded-md" />
            </section>
        </div>
    );
};

export default Delivery;
