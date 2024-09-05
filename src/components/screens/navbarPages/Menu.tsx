import React, { useEffect, useState } from 'react';
import Navbar from '../../Navbar/Navbar';
import axios from 'axios';
import { useCartContext } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';

interface Item {
    id: number;
    name: string;
    price: string;
    image: string;
    category_id: number;
    quantity: number; // Update quantity type to number
    category: {
        name: string;
    };
}


const Menu: React.FC = () => {
    const navigate = useNavigate();
    const [menuItems, setMenuItems] = useState<Item[]>([]);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [showCartSummary, setShowCartSummary] = useState<boolean>(false);
    const { cartItems, addToCart } = useCartContext();
    const [menubuyItems, setbuyMenuItems] = useState<Item[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>(''); // State for search query

    useEffect(() => {
        const fetchMenuItems = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/itemRoutes/items');
                setMenuItems(response.data);
            } catch (error) {
                console.error('Error fetching menu items:', error);
            }
        };

        fetchMenuItems();
    }, []);

    const groupItemsByCategory = (items: Item[]) => {
        return items.reduce((acc: { [key: string]: Item[] }, item: Item) => {
            const categoryName = item.category.name;
            if (!acc[categoryName]) {
                acc[categoryName] = [];
            }
            acc[categoryName].push(item);
            return acc;
        }, {});
    };

    let groupedItems = groupItemsByCategory(menuItems);

    const handleImageClick = (imageUrl: string) => {
        setSelectedImage(imageUrl);
    };

    const handleCloseImage = () => {
        setSelectedImage(null);
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

    const handleBuyNow = (item: Item) => {
        setbuyMenuItems([{ ...item, quantity: 1 }]); // Ensure quantity starts at 1
        setShowCartSummary(true); // Show the cart summary when "Buy Now" is clicked
    };

    const calculateTotal = () => {
        return menubuyItems.reduce((total, item) => total + parseFloat(item.price) * item.quantity, 0).toFixed(2);
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

    // Function to remove an item from the cart
    const removeFromCart = (itemId: number) => {
        setbuyMenuItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
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
    
    // Filter the menuItems based on the search query
    const filteredItems = menuItems.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

     groupedItems = groupItemsByCategory(filteredItems);

    return (
        <div className="menu-container">
            <Navbar />
            <br></br>
              <div className="mb-9 w-4/5 mx-auto">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)} // Update search query
                        placeholder="Search by item or category"
                        className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                </div>
            <section className="menu-categories p-8">
                <h2 className="text-2xl font-semibold mb-4">Our Menu</h2>
                {Object.keys(groupedItems).map((category) => (
                    <div key={category} className="category-section mb-8">
                        <h3 className="text-xl font-bold mb-4">{category}</h3>
                        <div className="grid grid-cols-3 gap-4">
                            {groupedItems[category].map((item) => (
                                <div key={item.id} className="food-item border p-4 rounded-lg shadow-md">
                                    <img
                                        src={`http://localhost:3000/api${item.image}`}
                                        alt={`${item.name} Image`}
                                        className="w-full h-32 object-cover rounded-md cursor-pointer"
                                        onClick={() => handleImageClick(`http://localhost:3000/api${item.image}`)}
                                    />
                                    <h4 className="text-lg font-semibold mt-2">{item.name}</h4>
                                    <p className="text-gray-600">Rs {item.price}</p>
                                    <div className="flex mt-2 space-x-2">
                                        <button
                                            className={`bg-blue-500 text-white px-4 py-2 rounded ${cartItems.some(cartItem => cartItem.id === item.id) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            onClick={() => !cartItems.some(cartItem => cartItem.id === item.id) && handleAddToCart(item)}
                                        >
                                            {cartItems.some(cartItem => cartItem.id === item.id) ? 'Added' : 'Add to Cart'}
                                        </button>
                                        <button
                                            className="bg-green-500 text-white px-4 py-2 rounded"
                                            onClick={() => handleBuyNow(item)} 
                                        >
                                            Buy Now
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
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

            {selectedImage && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                    <div className="relative">
                        <button
                            onClick={handleCloseImage}
                            className="absolute top-2 right-2 bg-white text-black rounded-full p-2"
                        >
                            &times;
                        </button>
                        <img
                            src={selectedImage}
                            alt="Full Size"
                            className="max-w-screen-md max-h-screen object-contain"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Menu;
