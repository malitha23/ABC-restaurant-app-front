import React from 'react';
import Navbar from '../../Navbar/Navbar';


const Contact: React.FC = () => {
    return (
        <div className="contact-container">
             <Navbar />

            {/* Contact Us Section */}
            <section className="contact-us p-8 bg-gray-100">
                <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
                <form className="contact-form grid grid-cols-2 gap-4">
                    <input type="text" placeholder="Your Name" className="border p-2 rounded" />
                    <input type="email" placeholder="Your Email" className="border p-2 rounded" />
                    <textarea placeholder="Your Message" className="border p-2 rounded col-span-2" rows={5}></textarea>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded col-span-2">Send Message</button>
                </form>
            </section>

            {/* Contact Information Section */}
            <section className="contact-info p-8">
                <h3 className="text-xl font-bold mb-2">Our Address</h3>
                <p>123 Korean Food Street, Foodie City, FC 12345</p>
                <p>Email: foodie@gmail.com</p>
                <p>Phone: +94766544332</p>
            </section>
        </div>
    );
};

export default Contact;
