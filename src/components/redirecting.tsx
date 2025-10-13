'use client';

import { AnimatePresence, motion } from 'framer-motion';

export function Redirecting({ show, target }: { show: boolean; target?: string }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm text-white text-lg font-semibold"
        >
          Redirecting{target ? ` to ${target}` : ''}, please wait...
        </motion.div>
      )}
    </AnimatePresence>
  );
}
