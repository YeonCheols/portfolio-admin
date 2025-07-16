import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { type ModalProps } from '@/types/modal';

function Modal({ children, footer, isOpen = false, headerTitle = '', onClose }: ModalProps) {
  const ref = useRef<Element | null>(null);

  useEffect(() => {
    ref.current = document.getElementById('modal');
  }, []);

  if (!ref.current) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Dimmed background */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
          {/* Modal content */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="relative w-full max-w-2xl max-h-full m-auto">
              <div className="relative rounded-lg shadow-sm bg-gray-50 dark:bg-gray-800 w-full">
                <header className="flex items-center justify-between p-4 md:p-5 rounded-t">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{headerTitle}</h3>
                  <button
                    type="button"
                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                    data-modal-hide="static-modal"
                    onClick={onClose}
                  >
                    <svg
                      className="w-3 h-3"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 14 14"
                    >
                      <path stroke="currentColor" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                    </svg>
                    <span className="sr-only">Close modal</span>
                  </button>
                </header>
                <main className="p-4 md:p-5 space-y-4">{children}</main>
                {footer ? (
                  footer
                ) : (
                  <footer className="flex items-center justify-center p-4 md:p-5 rounded-b">
                    <button
                      type="button"
                      onClick={onClose}
                      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                      모달 닫기
                    </button>
                  </footer>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    ref.current,
  );
}

export { Modal };
