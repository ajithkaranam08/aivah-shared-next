import { motion } from "motion/react";

const GlowingLinear = ({ isActive }: { isActive: boolean }) => {
    return (
        <motion.div
            initial={{ y: -100, scale: 0.5 }}
            animate={{ y: 0, scale: 1 }}
            transition={{ duration: 0.7 }}
            className={`animate-glow h-64 w-64 rounded-full bg-linear-to-tr from-pink-400 via-white to-cyan-400 bg-size-[250%_250%] shadow-[0_0_50px_20px_rgba(255,255,255,0.1)] outline outline-black/25 transition-colors ${isActive ? "animate-scale-ping" : ""}`}
        ></motion.div>
    );
};

export default GlowingLinear;
