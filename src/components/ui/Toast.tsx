import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, AlertCircle, Loader2, X, Info } from 'lucide-react';

export interface ToastMessage {
  id: string;
  text: string;
  type: 'success' | 'error' | 'loading' | 'info';
}

interface ToastProps {
  toast: ToastMessage | null;
  onClose: () => void;
}

export default function Toast({ toast, onClose }: ToastProps) {
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
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-lg backdrop-blur-sm ${
              toast.type === 'success'
                ? 'bg-slate-900/95 text-slate-100 border-slate-800'
                : toast.type === 'error'
                ? 'bg-red-50 text-red-800 border-red-200'
                : toast.type === 'loading'
                ? 'bg-slate-900/95 text-slate-100 border-slate-800'
                : 'bg-sky-50 text-slate-800 border-sky-200'
            }`}
          >
            {toast.type === 'success' && <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />}
            {toast.type === 'loading' && <Loader2 className="h-5 w-5 text-sky-300 animate-spin shrink-0" />}
            {toast.type === 'info' && <Info className="h-5 w-5 text-novora shrink-0" />}

            <span className="text-sm font-medium tracking-tight pr-2 max-w-xs">{toast.text}</span>

            {toast.type !== 'loading' && (
              <button
                id="toast-close-btn"
                type="button"
                onClick={onClose}
                className={`p-1 rounded-lg transition-colors duration-200 cursor-pointer ${
                  toast.type === 'success'
                    ? 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    : toast.type === 'error'
                    ? 'text-red-400 hover:bg-red-100 hover:text-red-700'
                    : 'text-slate-400 hover:bg-white hover:text-slate-700'
                }`}
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
