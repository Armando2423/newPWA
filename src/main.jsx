import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import keys from '../keys.json';

let dbRequest = indexedDB.open("database", 1);
dbRequest.onupgradeneeded = event => {
    let db = event.target.result;
    if (!db.objectStoreNames.contains("usuarios")) {
        db.createObjectStore("usuarios", { keyPath: "email" });
    }
    if (!db.objectStoreNames.contains("libros")) {
        db.createObjectStore("libros", { autoIncrement: true });
    }
};


navigator.serviceWorker.register('../sw.js', { type: 'module' })
    .then(registro => {
        console.log("Service Worker registrado");

        if (Notification.permission === 'denied' || Notification.permission === 'default') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                  registro.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: keys.publicKey
                })
                .then(subscription => {
                    console.log(subscription);
                    return fetch('http://192.168.100.16:3005/save-subscription', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(subscription)
                    });
                })
                .then(response => response.json())
                .then(data => console.log('Suscripción guardada:', data))
                .catch(error => console.error('Error al guardar la suscripción:', error));
                
                }
            });
        }
    });




createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
);
