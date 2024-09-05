import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { SlideUp } from '../Hero/Hero';
import { useCartContext } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

interface PopularRecipeItem {
    id: number;
    name: string;
    image: string;
    price: string;
    delay: number;
    category_id: number;
    quantity: number;
    category: {
        name: string;
    };
}

const PopularRecipeData: PopularRecipeItem[] = [
    {
        id: 1,
        name: "Chicken Ramen",
        image: '/items/recipe1.png',
        price: "500.99",
        delay: 0.4,
        category_id: 0,
        quantity:1,
        category: {
            name:''
        }
    },
    {
        id: 2,
        name: "Sushi",
        image: '/items/recipe2.png',
        price: "400.00",
        delay: 0.8,
        category_id: 0,
        quantity:1,
        category: {
            name:''
        }
    },
    {
        id: 3,
        name: "Tteokbokki",
        image: '/items/recipe3.png',
        price: "380.99",
        delay: 1.2,
        category_id: 0,
        quantity:1,
        category: {
            name:''
        }
    },
];

interface Item {
    id: number;
    name: string;
    price: string;
    image: string;
    category_id: number;
    quantity: number; 
    category: {
        name: string;
    };
}

const PopularRecipe = () => {
    const navigate = useNavigate();
    const { cartItems, addToCart } = useCartContext();
    const [showCartSummary, setShowCartSummary] = useState<boolean>(false);
    const [menubuyItems, setbuyMenuItems] = useState<Item[]>([]);
    
    const handleBuyNow = (item: Item) => {
        setbuyMenuItems([{ ...item, quantity: 1 }]); // Ensure quantity starts at 1
        setShowCartSummary(true); // Show the cart summary when "Buy Now" is clicked
    };

    const handleAddToCart = (item: Item) => {
        addToCart({
            id: item.id,
            name: item.name,
            price: item.price,
            image: item.image,
            quantity: 1
        });
    };


    const handleQuantityChange = (itemId: number, delta: number) => {
        setbuyMenuItems((prevItems) =>
            prevItems.map((item) =>
                item.id === itemId && item.quantity + delta > 0
                    ? { ...item, quantity: item.quantity + delta }
                    : item
            )
        );
    };

    const calculateTotal = () => {
        return menubuyItems.reduce((total, item) => total + parseFloat(item.price) * item.quantity, 0).toFixed(2);
    };

    const handleProceedToCheckout = () => {
        const storedUser = localStorage.getItem('user'); // Retrieve the JSON string
    
        if (storedUser) {
            const user = JSON.parse(storedUser); // Parse the JSON string
            console.log('Proceeding to Checkout with User:', user);
    
            // Redirect to checkout page with user and cart data
            navigate('/checkout', { state: { user: user, cartItems: menubuyItems } });

        } else {
            console.log('No user data found. Redirecting to login...');
            // Redirect to login page
            navigate('/login');
        }
    };
    

    return (
        <div>
        <section>
            <div className="container py-24">
                <motion.h3
                    variants={SlideUp(0.5)}
                    initial="hidden"
                    whileInView="show"
                    className='text-4xl text-center font-league font-semibold uppercase py-8'>
                    Our Popular Recipe
                </motion.h3>

                {/* card section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 place-items-center">
                    {PopularRecipeData.map((item) => (
                        <div key={item.id} className="group space-y-3 text-center bg-white/50 shadow-xl p-3 rounded-xl w-44 mx-auto">
                            <img     src={`http://localhost:3000/api${item.image}`} alt={item.name}
                                className='w-44 mx-auto img-shadow group-hover:scale-x-110 group-hover:translate-y-[-50px] 
                                group-hover:rotate-[50deg] transition-all duration-400' />

                            <div>
                                {/* "Buy Now" Button */}
                                <button className='btn-primary group-hover:mb-3 opacity-0 group-hover:opacity-100' onClick={() => handleBuyNow(item)} >
                                    Buy Now
                                </button>

                                {/* "Add Cart" Button */}
                                <button
                                    className={`bg-white border btn-primary border-2 group-hover:mb-3 opacity-0 group-hover:opacity-100 text-btn-primary ${cartItems.some(cartItem => cartItem.id === item.id) ? 'opacity-50 cursor-not-allowed' : ''}`} style={{ color: 'green' }}
                                    onClick={() => !cartItems.some(cartItem => cartItem.id === item.id) && handleAddToCart(item)}
                                >
                                    {cartItems.some(cartItem => cartItem.id === item.id) ? 'Added' : 'Add Cart'}
                                </button>

                                {/* Recipe Details */}
                                <p className='text-xl font-semibold'>{item.name}</p>
                                <p className='text-xl font-bold text-yellow-500'>Rs {item.price}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
          {/* Cart Summary Modal */}
          {showCartSummary && (
            <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg max-w-md w-full">
                    <h2 className="text-xl font-bold mb-4">Cart Summary</h2>
                    {menubuyItems.map((item) => (
                        <div key={item.id}>
                            <div className="flex justify-between items-center mb-2">
                                <p>{item.name}:</p>
                                <p>Rs {parseFloat(item.price) * item.quantity} x {item.quantity} = Rs {(parseFloat(item.price) * item.quantity).toFixed(2)}</p>
                            </div>
                            <div className="flex justify-between items-center mb-2">
                                <div className="flex items-center ml-auto" style={{ margin: 'auto' }}>
                                    <button
                                        className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                                        onClick={() => handleQuantityChange(item.id, -1)}
                                    >
                                        -
                                    </button>
                                    <button
                                        className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                                        onClick={() => handleQuantityChange(item.id, 1)}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    <hr className="my-4" />
                    <div className="flex justify-between font-bold">
                        <p>Total:</p>
                        <p>Rs {calculateTotal()}</p>
                    </div>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded mt-4 w-full" onClick={handleProceedToCheckout}>
                        Proceed to Checkout
                    </button>
                    <button className="mt-2 w-full text-red-500" onClick={() => setShowCartSummary(false)}>
                        Close
                    </button>
                </div>
            </div>
        )}

        </div>
    );
};

export default PopularRecipe;
