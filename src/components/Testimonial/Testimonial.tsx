import BannerPng from "../../assets/banner.png";
import Sushi from "../../assets/sushi-pallet.png";
import { motion } from 'framer-motion';
import {SlideUp} from '../Hero/Hero';

const Testimonial = () => {
  return (
    <section>
        <div className="container py-24">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-14 place-items-center">
                {/* text content section */}
                <div className="space-y-5 lg:max-w-[400px]">
                <motion.h1 
                    variants={SlideUp(1)}
                    initial="hidden"
                    whileInView="show"
                    className="text-6xl uppercase font-semibold font-league">
                        The sushi platter: our most popular dish!
                    </motion.h1>
                    <motion.p
                    variants={SlideUp(1.3)}
                    initial="hidden"
                    whileInView="show">
                        Sushi is a Japanese dish of vinegared rice, fresh fish, and toppings, known for its balanced flavors and elegant presentation.
                    </motion.p> 
                    <motion.button 
                    variants={SlideUp(1.6)}
                    initial="hidden"
                    whileInView="show"
                    className="btn-primary">
                        Order Now
                    </motion.button>
                </div>
                {/* image section */}
                <div className="relative">
                    <motion.img 
                    initial={{ opacity: 0, x: -100, y: 100}}
                    whileInView={{ opacity: 1, x: 0, y: 0}}
                    whileHover={{ scale: 1.2, rotate: 15, x: 50, y: -50}}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    src={Sushi} alt="" className="relative z-10 w-full  lg:max-w-[280px] img-shadow"/>
                    <motion.div
                    initial={{ opacity: 0 }} 
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.5, scale: { duration: 0.5 } }}
                    className="absolute top-[50%] right-[50%] transform translate-x-[50%] translate-y-[-50%] h-[320px] w-[320px]
                    bg-lightYellow rounded-full"></motion.div>
                </div>
            </div>
        </div>
    </section>
  )
}

export default Testimonial