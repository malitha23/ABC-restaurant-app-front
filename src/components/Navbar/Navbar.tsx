import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from "../../assets/logo.png";
import { IoCartOutline, IoPersonOutline } from 'react-icons/io5';
import { Variants } from 'framer-motion';
import { motion } from 'framer-motion';
import ConfirmDialog from '../DialogBox/confirmDialog';
import OverlayPanel from '../OverlayPanel/OverlayPanel';
import { toast, ToastContainer } from 'react-toastify';

interface User {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    address: string;
    role: string;
}

 
interface NavMenuItem {
    id: number;
    title: string;
    path: string;
    delay: number;
}

const NavMenu: NavMenuItem[] = [
    {
        id: 1,
        title: 'Home',
        path: '/',
        delay: 0.1,
    },
    {
        id: 2,
        title: 'About',
        path: '/about',
        delay: 0.2,
    },
    {
        id: 3,
        title: 'Menu',
        path: '/menu',
        delay: 0.3,
    },
    {
        id: 4,
        title: 'Delivery',
        path: '/delivery',
        delay: 0.4,
    },
    {
        id: 5,
        title: 'Contact Us',
        path: '/contact',
        delay: 0.5,
    },
];

const SlideDown = (delay: number): Variants => ({
    initial: {
        y: '-100%',
        opacity: 0,
    },
    animate: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.6,
            delay: delay,
        },
    },
});

const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const [overlayVisible, setOverlayVisible] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null); // Store user data

    // Check if a user token exists on component mount
    useEffect(() => {
        const token = localStorage.getItem('userToken'); // Replace 'userToken' with your actual token key
        setIsLoggedIn(!!token); // Set isLoggedIn to true if a token is found
        const storedUser = localStorage.getItem('user'); // Retrieve the JSON string

        if (storedUser) {
            setUser(JSON.parse(storedUser)); // Parse the JSON string and set the user state
        } else {
            console.log('No user data found');
        }
    }, []);

    const handleLoginClick = () => {
        navigate('/login'); // Navigate to the login page
    };

    const handlecartClick = () => {
        navigate('/cart'); // Navigate to the cart page
    };

    const handleLogoutClick = () => {
        setDialogOpen(true); // Open the confirmation dialog
    };

    const handleCloseDialog = () => {
        setDialogOpen(false); // Close the confirmation dialog
    };

    const handleLogout = () => {
        localStorage.removeItem('userToken');
        setIsLoggedIn(false);
        setDialogOpen(false);
        setOverlayVisible(false);
        toast.success('Logout successful!');
        setTimeout(() => {
            window.location.href = '/';
        }, 1000);
    };

    const handleOpenOverlay = () => {
        setOverlayVisible(true); // Show the overlay panel
    };

    const handleCloseOverlay = () => {
        setOverlayVisible(false); // Hide the overlay panel
    };

    return (
        <nav>
            <div className="container flex justify-between items-center font-league">
                <motion.img
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    src={Logo} alt='Logo' className='w-40'
                />
                <div className='hidden md:block'>
                    <ul className='flex gap-6'>
                        {NavMenu.map((menu) => (
                            <motion.li
                                key={menu.id}
                                variants={SlideDown(menu.delay)}
                                initial="initial"
                                animate="animate"
                                className='nav-menu'
                                data-delay={menu.delay}
                            >
                                <Link
                                    to={menu.path}
                                    className='inline-block px-2 py-2 text-2xl'
                                >
                                    {menu.title}
                                </Link>
                            </motion.li>
                        ))}
                    </ul>
                </div>
                <motion.div
                    variants={SlideDown(1)}
                    animate="animate"
                    className="flex space-x-2"
                >
                    <button className='h-[40px] w-[40px] grid place-items-center rounded-full text-white bg-dark'
                        onClick={handlecartClick}
                    >
                        <IoCartOutline />
                    </button>

                    {isLoggedIn ? (
                        <>
                            <button
                                className='h-[40px] w-[40px] grid place-items-center rounded-full text-white bg-dark'
                                onClick={handleOpenOverlay} // Corrected handler
                            >
                                <IoPersonOutline />
                            </button>
                        </>
                    ) : (
                        <button
                            className='px-4 py-2 rounded-full text-white bg-dark'
                            onClick={handleLoginClick}
                        >
                            Login
                        </button>
                    )}
                </motion.div>
            </div>

            {/* Confirmation Dialog */}
            <ConfirmDialog
                open={dialogOpen}
                onClose={handleCloseDialog}
                onConfirm={handleLogout}
                title="Confirm Logout"
                message="Are you sure you want to logout?"
            />

            {/* Custom Overlay Panel */}
            <OverlayPanel open={overlayVisible} onClose={handleCloseOverlay}>
                {user && (
                   <div className="user-info">
                        <h2>{user.username}</h2>
                        <p><strong>Full Name:</strong> {user.first_name} {user.last_name}</p>
                        <p><strong>Phone Number:</strong> {user.phone_number}</p>
                        <p><strong>Address:</strong> {user.address}</p>
                        <p><strong>Role:</strong> {user.role}</p>
                        <br></br>
                        <button
                            className="px-4 py-2 rounded-full text-white bg-dark"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </div>
                )}
            </OverlayPanel>
            <ToastContainer />
        </nav>
    );
}

export default Navbar;
