import Recipe1 from '../../assets/recipe1.png';
import Recipe2 from '../../assets/recipe2.png';
import Recipe3 from '../../assets/recipe3.png';
import {motion} from 'framer-motion';
import {SlideUp} from '../Hero/Hero';

interface HotDessertItem {
    id: number;
    name: string;
    img: string;
    price: string;
    delay: number;
}

const HotDessertData: HotDessertItem[] = [
    {
        id: 1,
        name: "Chicken Ramen",
        img: Recipe1,
        price: "Rs 500.99",
        delay: 0.4
    },
    {
        id: 2,
        name: "Sushi",
        img: Recipe2,
        price: "Rs 400.00",
        delay: 0.8
    },
    {
        id: 3,
        name: "Tteokbokki",
        img: Recipe3,
        price: "Rs 380.99",
        delay: 1.2
    },
];

const HotDessert = () => {
  return (
    <section>
        <div className="container py-12">
            {/* Heading Section */}
            <motion.h3 
            variants={SlideUp(0)}
            initial="hidden"
            whileInView="show"
            className="text-2xl font-semibold text-darkGreen uppercase py-8">
                Hot Menu
            </motion.h3>

            {/* grid Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {HotDessertData.map((item) => (
                    <motion.div 
                    variants={SlideUp(item.delay)}
                    initial="hidden"
                    whileInView="show"
                    className="group bg-white/50 shadow-md p-3 flex items-center gap-3">
                        <img src={item.img} alt="" 
                        className="w-28 rounded-full img-shadow group-hover:scale-125 transition-all duration-700 group-hover:rotate-[50deg]" />
                        <div className="">
                            <h3 className="text-xl font-semibold">{item.name}</h3>
                            <p className='text-xl text-yellow-500'>{item.price}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
  )
}

export default HotDessert