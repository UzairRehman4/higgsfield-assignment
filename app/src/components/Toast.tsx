import { AnimatePresence, motion } from "framer-motion";
import { useToastStore } from "../store/useToastStore";

export function Toast() {
  const message = useToastStore((s) => s.message);
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[60] flex justify-center">
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="rounded-full border border-border bg-surface-raised px-4 py-2 text-sm font-medium text-ink shadow-xl shadow-black/40"
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
