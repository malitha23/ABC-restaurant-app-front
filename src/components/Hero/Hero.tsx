import RamenPng from "../../assets/ramen.png";
import ChopSticks from "../../assets/chopsticks.png";
import SoupSpoon from "../../assets/soup-spoon.png";
import Chili from "../../assets/chili.png";
import { IoCartOutline } from 'react-icons/io5';
import { motion } from 'framer-motion';
import { Variants } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export const SlideUp = (delay: number): Variants => {
    return {
        hidden: {
            y: "100%",
            opacity: 0,
        },
        show: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.6,
                delay: delay,
            },
        },
    };
};

export const Hero = () => {

    const navigate = useNavigate();

    const handleOrderNowClick = () => {
        navigate('/menu');
    };
  return (
    <main>
        <div className="container min-h-[600px] flex justify-center relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 place-items-center justify-between">   
                {/* text content here */}
                <div className='space-y-3 mt-14 text-center md:text-left md:mt-0'>
                    <motion.h1 
                        variants={SlideUp(0.5)}
                        initial="hidden"
                        whileInView="show"
                        className='relative text-5xl lg:text-7xl xl:text-8xl font-bold uppercase text-outline text-transparent'>Korean
                        <img src={Chili} alt='' className='absolute w-[80px] top-0 right-0 md:right-[120px]'/>
                    </motion.h1>
                    <motion.h1 
                        variants={SlideUp(1)}
                        initial="hidden"
                        whileInView="show"
                        className='text-5xl lg:text-7xl xl:text-8xl font-bold uppercase'>
                        Flavors
                    </motion.h1>
                    <motion.p 
                        variants={SlideUp(1.5)}
                        initial="hidden"
                        whileInView="show"
                        className='text-sm'>Discover authentic Korean flavors with every dish, where tradition and modern tastes blend seamlessly for a unique experience.</motion.p>
                    <motion.button 
                        variants={SlideUp(2)}
                        initial="hidden"
                        whileInView="show"
                        className='btn-primary inline-block !mt-10'
                        onClick={handleOrderNowClick}
                        >
                        <IoCartOutline className='inline mr-2' /> 
                        Order Now
                    </motion.button>
                </div>
                {/* images here */}
                <div className='relative'>
                    <motion.img 
                        initial={{ opacity: 0, rotate: 20, x: 200, y:100}} 
                        whileInView={{ opacity: 1, rotate: 0, x: 0, y: 0}}
                        transition={{ duration: 0.8 }}
                        src={RamenPng} alt='' className='w-[420px] img-shadow'/>
                    <motion.img
                        initial={{ opacity: 0, rotate: 120, x: 200, y:100}} 
                        whileInView={{ opacity: 1, rotate: 260, x: 0, y: 0}}
                        transition={{ duration: 0.8 }} 
                        src={SoupSpoon} alt="" className='w-[350px] absolute bottom-[-150px] -left-16 rotate-[260deg] img-shadow'/>
                    <motion.img
                        initial={{ opacity: 0, rotate: 20, x: 200, y:100}} 
                        whileInView={{ opacity: 1, rotate: 130, x: 0, y: 0}}
                        transition={{ duration: 0.8 }} 
                        src={ChopSticks} alt="" className='w-[400px] absolute top-[-100px] right-[-140px] md:right-[-135px] lg:top-[-140px] img-shadow' />
                </div>
            </div>
        </div>

        {/* Background Yellow */}
        <motion.div 
            initial= {{ opacity: 0, rotate: 60, x: 200, y: 100 }}
            whileInView={{ opacity: 1, rotate: 45, x: 0, y: 0 }}
            className="w-[2500px] h-[2500px] rounded-3xl bg-lightYellow absolute top-[-30%] left-[70%] z-0"></motion.div>

    </main>
  )
}
