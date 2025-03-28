import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
/* import keys from '../keys.json'; */

// Abrir la base de datos en IndexedDB
/* let dbRequest = indexedDB.open("database", 1);
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
 */
// Registrar el Service Worker
let db = window.indexedDB.open('database');

db.onupgradeneeded = event => {
  let result = event.target.result;
  if (!result.objectStoreNames.contains('libros2')) {
    result.createObjectStore('libros2', { autoIncrement: true });
  }
};

// Renderizar la aplicación principal
createRoot(document.getElementById('root')).render(<App />);