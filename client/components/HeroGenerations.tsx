"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function HeroGenerations() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <section className="relative w-full h-screen bg-gradient-to-br from-amber-50 via-stone-50 to-orange-50 overflow-hidden">
      {/* Large Background Text */}
      <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none">
        <div className="text-center">
          <h1 className="text-[12rem] md:text-[20rem] lg:text-[28rem] font-bold text-gray-900/5 leading-none tracking-tighter">
            Style
          </h1>
          <h1 className="text-[12rem] md:text-[20rem] lg:text-[28rem] font-bold text-gray-900/5 leading-none tracking-tighter -mt-8 md:-mt-16 lg:-mt-24">
            Sakhi
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10 h-full flex items-center">
        {/* 3D Overlapping Characters */}
        <div className="relative flex items-center justify-center h-[400px] md:h-[500px] w-full perspective-1000">
          {/* Gen-Z Girl - Left */}
          <motion.div
            initial={{ opacity: 0, x: -200 }}
            animate={{ opacity: 1, x: -15 }}
            whileHover={{ scale: 1.05, zIndex: 50 }}
            transition={{ 
              type: "spring",
              stiffness: 200,
              damping: 25,
              duration: 0.6
            }}
            className="absolute left-[5%] md:left-[20%] z-40 cursor-pointer hover:brightness-110"
            style={{ willChange: 'transform, opacity' }}
          >
            <div className="relative w-[180px] h-[270px] md:w-[320px] md:h-[480px]">
              <Image
                src="/hero/gen-z.png"
                alt="Gen-Z Fashion"
                fill
                unoptimized
                className="object-contain"
              />
              
              {/* Tag Animation */}
              <motion.div
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 2 }}
                className="absolute top-5 left-3 md:top-8 md:left-6 z-10"
              >
                <Image
                  src="/hero/tags/gen-z.png"
                  alt="Gen-Z Tag"
                  width={60}
                  height={32}
                  unoptimized
                  className="md:w-[100px] md:h-[55px]"
                />
              </motion.div>

              {/* Gen-Z Props */}
              {/* <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 2 }}
                className="absolute -top-8 -left-8"
              >
                <Image
                  src="/hero/props/headphone.png"
                  alt="Headphones"
                  width={100}
                  height={100}
                  unoptimized
                  className="animate-float"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 2.2 }}
                className="absolute -bottom-6 -right-6"
              >
                <Image
                  src="/hero/props/phone.png"
                  alt="Phone"
                  width={90}
                  height={90}
                  unoptimized
                  className="animate-float-delayed"
                />
              </motion.div> */}

            </div>
          </motion.div>

          {/* Millennial Woman - Center (Front) */}
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0, x:5 }}
            whileHover={{ scale: 1.05, zIndex: 60 }}
            transition={{ 
              type: "spring",
              stiffness: 200,
              damping: 25,
              duration: 0.6
            }}
            className="absolute z-40 cursor-pointer hover:brightness-110"
            style={{ willChange: 'transform, opacity' }}
          >
            <div className="relative w-[200px] h-[280px] md:w-[380px] md:h-[500px]">
              <Image
                src="/hero/millenial.png"
                alt="Millennial Fashion"
                fill
                unoptimized
                className="object-contain"
              />
              
              {/* Tag Animation */}
              <motion.div
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 10, y: 15 }}
                transition={{ duration: 1, delay: 2.2 }}
                className="absolute -top-3 right-6 md:-top-6 md:right-12 z-10"
              >
                <Image
                  src="/hero/tags/millenial.png"
                  alt="Millennial Tag"
                  width={65}
                  height={35}
                  unoptimized
                  className="md:w-[110px] md:h-[60px]"
                />
              </motion.div>

              {/* Millennial Props */}
              {/* <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 2.4 }}
                className="absolute -top-10 -right-10"
              >
                <Image
                  src="/hero/props/watch.png"
                  alt="Watch"
                  width={110}
                  height={110}
                  unoptimized
                  className="animate-float"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 2.6 }}
                className="absolute -bottom-8 -left-8"
              >
                <Image
                  src="/hero/props/perfume.png"
                  alt="Perfume"
                  width={100}
                  height={100}
                  unoptimized
                  className="animate-float-delayed"
                />
              </motion.div> */}
            </div>
          </motion.div>

          {/* 90s Woman - Right */}
          <motion.div
            initial={{ opacity: 0, x: 200 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.05, zIndex: 50 }}
            transition={{ 
              type: "spring",
              stiffness: 200,
              damping: 25,
              duration: 0.6
            }}
            className="absolute right-[5%] md:right-[20%] z-30 cursor-pointer hover:brightness-110"
            style={{ willChange: 'transform, opacity' }}
          >
            <div className="relative w-[180px] h-[270px] md:w-[320px] md:h-[480px]">
              <Image
                src="/hero/90s.png"
                alt="90s Fashion"
                fill
                unoptimized
                className="object-contain"
              />
              
              {/* Tag Animation */}
              <motion.div
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: -20 }}
                transition={{ duration: 1, delay: 2.4 }}
                className="absolute top-5 -right-3 md:top-8 md:-right-6 z-10"
              >
                <Image
                  src="/hero/tags/90s.png"
                  alt="90s Tag"
                  width={60}
                  height={32}
                  unoptimized
                  className="md:w-[100px] md:h-[55px]"
                />
              </motion.div>

              {/* 90s Props */}
              {/* <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 2.8 }}
                className="absolute -top-8 -right-8"
              >
                <Image
                  src="/hero/props/glasses.png"
                  alt="Sunglasses"
                  width={110}
                  height={110}
                  unoptimized
                  className="animate-float"
                />
              </motion.div> */}
            </div>
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateZ(0) rotate(0deg); }
          50% { transform: translateY(-20px) translateZ(0) rotate(5deg); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) translateZ(0) rotate(0deg); }
          50% { transform: translateY(-15px) translateZ(0) rotate(-5deg); }
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
          will-change: transform;
        }

        .animate-float-delayed {
          animation: float-delayed 4.5s ease-in-out infinite;
          will-change: transform;
        }

        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </section>
  );
}
