import React from 'react';
import { motion } from 'framer-motion';

const badgeVariants = {
  hidden: { scale: 0.7, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 400, damping: 15 } },
};

const AnimatedBadge = ({ icon, label }) => (
  <motion.div
    className="inline-flex flex-col items-center gap-1 bg-violet-100 dark:bg-violet-800 px-3 py-2 rounded-xl shadow"
    initial="hidden"
    animate="visible"
    variants={badgeVariants}
  >
    <span className="text-2xl">{icon}</span>
    <span className="text-xs font-semibold text-violet-700 dark:text-violet-200">{label}</span>
  </motion.div>
);

export default AnimatedBadge;
