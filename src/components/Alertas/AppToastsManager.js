import React, { createContext, useContext, useState } from 'react';
import AppToasts from './AppToasts';

const ToastContext = createContext();

const getCurrentTime = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addError = (toast) => {
        toast.color = 'danger';
        if (!toast.title)
            toast.title = 'Sistema';
        if (!toast.smallText)
            toast.smallText = getCurrentTime();

        setToasts((prevToasts) => [...prevToasts, toast]);
    };
    const addSuccess = (toast) => {
        toast.color = 'success';
        if (!toast.title)
            toast.title = 'Operação bem-sucedida';
        if (!toast.smallText)
            toast.smallText = getCurrentTime();

        setToasts((prevToasts) => [...prevToasts, toast]);
    };
    const addSuccessMessage = (message) => {
        var toast = {
            title: 'Operação bem-sucedida',
            message: message,
            color: 'success',
            smallText: getCurrentTime()
        };

        setToasts((prevToasts) => [...prevToasts, toast]);
    };
    const addErrorMessage = (message) => {
        var toast = {
            title: 'Erro ao processar a requisição',
            message: message,
            color: 'danger',
            smallText: getCurrentTime()
        };

        setToasts((prevToasts) => [...prevToasts, toast]);
    };
    const addToast = (toast) => {
        if (!toast.smallText)
            toast.smallText = getCurrentTime();

        setToasts((prevToasts) => [...prevToasts, toast]);
        // setTimeout(() => {
        //     setToasts((prevToasts) => prevToasts.slice(1)); // Remove o toast após o delay
        // }, 3000);
    };
    const removeToast = (indexToRemove) => {
        setToasts((prevToasts) =>
            prevToasts.filter((_, index) => index !== indexToRemove)
        );
    };

    return (
        <ToastContext.Provider value={{ addToast, addError, addSuccess, addSuccessMessage, addErrorMessage, removeToast }}>
            {children}
            <AppToasts toasts={toasts} removeToast={removeToast} />
        </ToastContext.Provider>
    );
};

// Hook para acessar o contexto do Toast
export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast deve ser usado dentro de um ToastProvider");
    }
    return context;
};
