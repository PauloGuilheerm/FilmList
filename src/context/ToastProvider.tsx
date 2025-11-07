import { useCallback, useMemo, type ReactNode } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { ToastContext, type ShowToastParams } from './ToastContext';

export function ToastProvider({ children }: { children: ReactNode }) {
  const showToast = useCallback(({ message, type = 'default', options }: ShowToastParams) => {
    switch (type) {
      case 'success':
        toast.success(message, options);
        break;
      case 'error':
        toast.error(message, options);
        break;
      case 'info':
        toast.info(message, options);
        break;
      case 'warning':
        toast.warn(message, options);
        break;
      default:
        toast(message, options);
    }
  }, []);

  const contextValue = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </ToastContext.Provider>
  );
}


