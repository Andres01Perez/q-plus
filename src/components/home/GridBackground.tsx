import { motion } from "framer-motion";

const GridBackground = () => (
  <div className="absolute inset-0 overflow-hidden">
    {/* Subtle grid pattern */}
    <div
      className="absolute inset-0 opacity-[0.03]"
      style={{
        backgroundImage: `linear-gradient(hsl(var(--gold)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--gold)) 1px, transparent 1px)`,
        backgroundSize: "60px 60px",
      }}
    />
    {/* Radial glow */}
    <motion.div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
      style={{
        background: `radial-gradient(circle, hsl(var(--gold) / 0.06) 0%, transparent 70%)`,
      }}
      animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
    />
  </div>
);

export default GridBackground;
