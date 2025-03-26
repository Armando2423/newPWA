import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import keys from '../keys.json';

// Abrir la base de datos en IndexedDB
let dbRequest = indexedDB.open("database", 1);
dbRequest.onupgradeneeded = (event) => {
    let db = event.target.result;
    // Crear el object store para usuarios si no existe
    if (!db.objectStoreNames.contains("usuarios")) {
        db.createObjectStore("usuarios", { keyPath: "email" });
    }
    // Crear el object store para libros si no existe
    if (!db.objectStoreNames.contains("libros")) {
        db.createObjectStore("libros", { autoIncrement: true });
    }
};

// Registrar el Service Worker
navigator.serviceWorker.register('../sw.js', { type: 'module' })
    .then(registro => {
        console.log("Service Worker registrado");

        // Verificar permisos de notificaciones
        if (Notification.permission === 'denied' || Notification.permission === 'default') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    // Suscribirse a notificaciones push
                    registro.pushManager.subscribe({
                        userVisibleOnly: true,
                        applicationServerKey: keys.public_key
                    })
                    .then(subscription => {
                        console.log(subscription);
                        // Guardar la suscripción en el servidor
                        return fetch('http://localhost:3005/save-subscription', {
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
    })
    .catch(error => {
        console.error("Error al registrar el Service Worker:", error);
    });

// Renderizar la aplicación principal
createRoot(document.getElementById('root')).render(<App />);
