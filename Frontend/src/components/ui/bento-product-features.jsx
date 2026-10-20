import { motion } from "motion/react";
import { cn } from "@/lib/utils";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 10 } },
};

export const BentoGridShowcase = ({ integration, trackers, statistic, focus, productivity, shortcuts, className }) => (
  <motion.section
    variants={containerVariants}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-60px" }}
    className={cn("grid w-full grid-cols-1 gap-6 auto-rows-[minmax(220px,auto)] md:grid-cols-3", className)}
  >
    <motion.div variants={itemVariants} className="h-full min-w-0 md:col-span-1 md:row-span-3">{integration}</motion.div>
    <motion.div variants={itemVariants} className="h-full min-w-0 md:col-span-1">{trackers}</motion.div>
    <motion.div variants={itemVariants} className="h-full min-w-0 md:col-span-1">{statistic}</motion.div>
    <motion.div variants={itemVariants} className="h-full min-w-0 md:col-span-1">{focus}</motion.div>
    <motion.div variants={itemVariants} className="h-full min-w-0 md:col-span-1">{productivity}</motion.div>
    <motion.div variants={itemVariants} className="h-full min-w-0 md:col-span-2">{shortcuts}</motion.div>
  </motion.section>
);
