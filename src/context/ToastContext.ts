import { createContext, useContext } from 'react';
import type { ToastOptions } from 'react-toastify';

export type ToastType = 'success' | 'error' | 'info' | 'warning' | 'default';

export type ShowToastParams = {
    message: string;
    type?: ToastType;
    options?: ToastOptions;
};

type ToastContextValue = {
    showToast: (params: ShowToastParams) => void;
};

export const ToastContext = createContext<ToastContextValue>({
    showToast: () => { },
});

export const useToast = () => useContext(ToastContext);


