import { useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, AlertCircle, Loader2, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  text: string;
  type: 'success' | 'error' | 'loading' | 'info';
}

interface ToastProps {
  toast: ToastMessage | null;
  onClose: () => void;
}

export function Toast({ toast, onClose }: ToastProps) {
  useEffect(() => {
    if (toast && toast.type !== 'loading') {
      const timer = setTimeout(() => {
        onClose();
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toast, onClose]);

  return (
    <AnimatePresence>
      {toast && (
        <div id="toast-container" className="fixed bottom-6 right-6 z-50 pointer-events-none">
          <motion.div
            id={`toast-${toast.id}`}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg ${
              toast.type === 'success'
                ? 'bg-slate-900 text-slate-100 border-slate-800'
                : toast.type === 'error'
                ? 'bg-red-50 text-red-800 border-red-200'
                : toast.type === 'loading'
                ? 'bg-slate-900 text-slate-100 border-slate-800'
                : 'bg-indigo-50 text-indigo-900 border-indigo-200'
            }`}
          >
            {toast.type === 'success' && <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />}
            {toast.type === 'loading' && <Loader2 className="h-5 w-5 text-indigo-400 animate-spin shrink-0" />}
            {toast.type === 'info' && <CheckCircle className="h-5 w-5 text-indigo-500 shrink-0" />}

            <span className="text-sm font-medium tracking-tight pr-2">{toast.text}</span>

            {toast.type !== 'loading' && (
              <button
                id="toast-close-btn"
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-slate-800 hover:text-white transition-colors duration-200 text-slate-400"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
