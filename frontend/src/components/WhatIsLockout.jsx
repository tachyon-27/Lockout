import image from "@/assets/WhatLockout.JPG";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

function WhatIsLockout() {
    const { ref: sectionRef, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

    return (
        <div 
            ref={sectionRef} 
            className="py-16 relative overflow-hidden bg-gradient-to-r from-gray-900 via-gray-950 to-black text-white"
        >
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-16 left-1/2 w-96 h-96 bg-purple-500 opacity-20 blur-3xl transform -translate-x-1/2"></div>
                <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-blue-500 opacity-20 blur-3xl"></div>
            </div>

            <div className="mx-auto px-6 lg:px-12 relative">
                <motion.div 
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: -50 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-white glow">
                        What is Lockout?
                    </h2>
                </motion.div>

                <div className="flex flex-col lg:flex-row items-center gap-8">
                    <motion.div 
                        className="w-full lg:w-1/2 flex justify-center"
                        initial={{ opacity: 0, x: -50 }}
                        animate={inView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <img 
                            src={image} 
                            alt="What is Lockout" 
                            className="rounded-2xl shadow-lg w-full h-auto object-cover transition-transform duration-500 hover:scale-105"
                        />
                    </motion.div>
                    
                    {/* Description Section with card animation */}
                    <motion.div 
                        className="w-full lg:w-1/2"
                        initial={{ opacity: 0, x: 50 }}
                        animate={inView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        <CardSpotlight 
                            className="p-6 bg-gray-800 rounded-2xl shadow-xl transition duration-300 hover:bg-gray-700 transform hover:-translate-y-2 hover:shadow-2xl"
                        >
                            <p className="text-lg font-semibold text-gray-300 relative glow">
                                Lockout is an intense 1v1 coding battle where two participants compete to solve challenges before their opponent. Speed, strategy, and skill determine the champion in this high-stakes elimination showdown.
                            </p>
                            <div className="mt-4 border-t border-gray-600 pt-4 relative">
                                <h3 className="text-xl font-bold text-gray-200 hover:text-white glow">How it Works?</h3>
                                <ul className="mt-2 space-y-2 text-gray-400 hover:text-gray-200">
                                    <li>⚡ Each round features two participants.</li>
                                    <li>🧩 Both are presented with five coding questions.</li>
                                    <li>🏆 Each question carries a set number of points.</li>
                                    <li>⏳ The first to solve a question earns its points and locks it for the opponent.</li>
                                    <li>🥇 The participant with the highest score at the end wins.</li>
                                </ul>
                            </div>
                        </CardSpotlight>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}


export default WhatIsLockout;