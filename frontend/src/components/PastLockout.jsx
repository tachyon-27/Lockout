import React from "react";
import { motion } from "framer-motion";

const MasonryImageLayout = ({ images, description }) => {
  if (!images || images.length === 0) return null;

  const layoutStyles = [
    "col-span-2 row-span-1", "col-span-1 row-span-1", "col-span-1 row-span-1",
    "col-span-2 row-span-1", "col-span-1 row-span-1"
  ];

  return (
    <div>
      <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
        {description}
      </p>
      <div className="grid grid-cols-3 gap-4 auto-rows-[150px]">
        {images.slice(0, 5).map((src, index) => (
          <motion.img
            key={index}
            src={src}
            alt={`Image ${index + 1}`}
            className={`rounded-lg object-cover w-full h-full shadow-lg ${layoutStyles[index]}`}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>
    </div>
  );
};

export default MasonryImageLayout;