import React from 'react';
import { useCartContext } from '../../context/CartContext';
import Navbar from '../../Navbar/Navbar';
import './Cart.css'; // Import the CSS file

const Cart: React.FC = () => {
  const { cartItems, addToCart, removeFromCart } = useCartContext();

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + parseFloat(item.price) * item.quantity, 0);
  };

  const handleQuantityChange = (itemId: number, change: number) => {
    const item = cartItems.find((item) => item.id === itemId);
    if (item) {
      const updatedItem = { ...item, quantity: item.quantity + change };
      if (updatedItem.quantity <= 0) {
        removeFromCart(itemId);
      } else {
        addToCart(updatedItem);
      }
    }
  };

  return (
    <div className="cart-container">
      <Navbar />
      <section className="cart-content p-4">
        <div className="cart-items">
          <h2 className="text-2xl font-semibold mb-4">Your Cart</h2>
          {cartItems.length === 0 ? (
            <p>Your cart is empty</p>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item border p-4 rounded-lg shadow-md">
                  <img
                    src={`http://localhost:3000/api${item.image}`}
                    alt={`${item.name} Image`}
                    className="w-full h-32 object-cover rounded-md"
                  />
                  <h4 className="text-lg font-semibold mt-2">{item.name}</h4>
                  <p className="text-gray-600">Rs {item.price}</p>
                  <p className="text-gray-600">Quantity: {item.quantity}</p>
                  <div className="flex items-center mt-2">
                    <button
                      className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                      onClick={() => handleQuantityChange(item.id, -1)}
                    >
                      -
                    </button>
                    <button
                      className="bg-blue-500 text-white px-2 py-1 rounded"
                      onClick={() => handleQuantityChange(item.id, 1)}
                    >
                      +
                    </button>
                    <button
                      className="bg-red-500 text-white px-4 py-2 mt-2 rounded ml-2"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {cartItems.length > 0 && (
          <div className="summary-checkout mt-4">
            <div className="summary mb-4">
              <h3 className="text-xl font-semibold mb-2">Cart Summary</h3>
              <ul className="list-disc pl-5">
                {cartItems.map((item) => (
                  <li key={item.id} className="mb-2">
                    <span className="font-semibold">{item.name}</span>:<br></br> <span id="totalquantity">Rs {item.price} x {item.quantity} = Rs {(item.quantity * parseFloat(item.price)).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              <br></br>
              <p className="text-lg font-semibold mt-2" id="totalquantity"  >Total: Rs {calculateTotal().toFixed(2)}</p>
            </div>
            <div className="checkout">
              <button className="bg-green-500 text-white px-4 py-2 rounded mt-2">
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default Cart;
