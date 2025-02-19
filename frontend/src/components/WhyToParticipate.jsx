import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Why1 from "@/assets/Why1.png";
import Why2 from "@/assets/Why2.png";
import Why3 from "@/assets/Why3.jpg";
import Why4 from "@/assets/Why4.webp";

const reasons = [
  { img: Why1, text: "Sharpen your coding skills under pressure. Competing in real-time forces you to think quickly, optimize solutions, and adapt to different problem types on the fly." },
  { img: Why2, text: "Face off against top programmers and push yourself beyond your limits. Lockout is the perfect way to test your problem-solving speed and improve your ranking." },
  { img: Why3, text: "Earn bragging rights, exclusive rewards, and recognition in the competitive coding community. The more you win, the more your reputation grows." },
  { img: Why4, text: "Engage with like-minded coding enthusiasts, learn new strategies, and make connections with top coders and industry professionals." }
];

const WhyToParticipate = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <div ref={ref} className="py-[74px] px-3 bg-black text-white text-center">
      {/* Section Heading */}
      <motion.h2 
        className="text-5xl font-extrabold tracking-tight sm:text-6xl mb-12"
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        Why Participate?
      </motion.h2>

      {/* Grid Animation Wrapper (Single Animation for All Cards) */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-7 lg:px-21"
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {reasons.map((reason, index) => (
          <div
            key={index}
            className="bg-gray-900 rounded-2xl p-6 shadow-lg shadow-purple-500/50 transition duration-300 hover:bg-gray-800 hover:shadow-purple-400/50 flex flex-col items-center"
          >
            {/* Image */}
            <div className="w-full h-40 flex justify-center items-center">
              <img 
                src={reason.img} 
                alt={`Why${index + 1}`} 
                className="rounded-lg shadow-md w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>

            {/* Text Below Image */}
            <p className="mt-4 text-xl font-semibold text-gray-300 leading-relaxed">
              {reason.text}
            </p>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default WhyToParticipate;
