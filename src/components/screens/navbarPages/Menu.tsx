import React, { useEffect, useState } from 'react';
import Navbar from '../../Navbar/Navbar';
import axios from 'axios';
import { useCartContext } from '../../context/CartContext';

interface Item {
    id: number;
    name: string;
    price: string;
    image: string;
    category_id: number;
    category: {
        name: string;
    };
}

const Menu: React.FC = () => {
    const [menuItems, setMenuItems] = useState<Item[]>([]);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const { cartItems, addToCart, removeFromCart } = useCartContext(); // Use cartItems here

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

    const groupedItems = groupItemsByCategory(menuItems);

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

    return (
        <div className="menu-container">
            <Navbar />
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
                                    <div className="flex mt-2">
                                        <button
                                            className={`bg-blue-500 text-white px-4 py-2 rounded ${cartItems.some(cartItem => cartItem.id === item.id) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            onClick={() => !cartItems.some(cartItem => cartItem.id === item.id) && handleAddToCart(item)}
                                        >
                                            {cartItems.some(cartItem => cartItem.id === item.id) ? 'Added' : 'Add to Cart'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </section>
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
