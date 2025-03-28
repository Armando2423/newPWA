/* const APP_SHELL_CACHE = 'appShell-v2';
const DYNAMIC_CACHE = 'dinamico-v2';
const API_URL = 'http://192.168.100.16:3008/register'; // Ajusta la URL según tu backend

// Archivos que se almacenarán en caché para modo offline
const APP_SHELL_FILES = [
    '/',
    '/index.html',
    '/src/fallBack.html',
    '/src/index.css',
    '/src/assets/react.svg',
    '/src/App.css',
    '/src/components/login/Login.jsx',
    '/src/components/signup/Signup.jsx',
    '/src/components/splashScreen/SplashScreen.jsx',
    '/src/components/users/Users.jsx',
    '/src/components/main/Main.jsx'
];

// Instalación del Service Worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(APP_SHELL_CACHE)
            .then(cache => cache.addAll(APP_SHELL_FILES))
    );
    self.skipWaiting();
});

// Activación y limpieza de cachés antiguas
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.map(key => {
                    if (key !== APP_SHELL_CACHE && key !== DYNAMIC_CACHE) {
                        return caches.delete(key);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Apertura de IndexedDB
function openDatabase() {
    return new Promise((resolve, reject) => {
        let request = indexedDB.open("offlineDB", 2);
        request.onupgradeneeded = function (event) {
            let db = event.target.result;
            if (!db.objectStoreNames.contains("usuarios")) {
                let store = db.createObjectStore("usuarios", { keyPath: "email" });
                store.createIndex("email", "email", { unique: true });
            }
        };
        request.onsuccess = function (event) {
            resolve(event.target.result);
        };
        request.onerror = function (event) {
            reject("Error al abrir IndexedDB: " + event.target.error);
        };
    });
}

// Guardar datos en IndexedDB
async function insertIndexedDB(data) {
    let db = await openDatabase();
    let transaction = db.transaction("usuarios", "readwrite");
    let store = transaction.objectStore("usuarios");

    try {
        await store.add(data);
        console.log("Usuario guardado correctamente:", data);
    } catch (err) {
        if (err.name === "ConstraintError") {
            console.warn("El usuario ya existe en IndexedDB, actualizando...");
            await store.put(data);
        } else {
            console.error("Error al guardar usuario:", err);
        }
    }
}


// Manejo de peticiones de red con caché
self.addEventListener('fetch', event => {
    const { request } = event;

    // Manejo especial para POST en /signup
    if (request.method === "POST" && request.url.includes("/signup")) {
        event.respondWith(
            request.clone().json()
                .then(data => {
                    insertIndexedDB(data); // Guardar en IndexedDB
                    self.registration.sync.register("sync-usuarios"); // Registrar sincronización
                    return fetch(request.clone())
                        .catch(() => {
                            return new Response(JSON.stringify({ 
                                message: "Guardado localmente, se sincronizará cuando haya internet" 
                            }), { headers: { "Content-Type": "application/json" } });
                        });
                })
                .catch(error => console.error("Error al procesar request JSON:", error))
        );
    } else {
        // Estrategia de caché con fallback
        event.respondWith(
            caches.match(request).then(response => {
                return response || fetch(request).then(fetchRes => {
                    return caches.open(DYNAMIC_CACHE).then(cache => {
                        cache.put(request, fetchRes.clone());
                        return fetchRes;
                    });
                }).catch(() => {
                    if (request.destination === 'document') {
                        return caches.match('/src/fallBack.html');
                    }
                });
            })
        );
    }
});



// Sincronización de usuarios cuando hay conexión
async function syncUsuarios() {
    console.log("Intentando sincronizar usuarios...");
    let db = await openDatabase();
    let transaction = db.transaction("usuarios", "readonly");
    let store = transaction.objectStore("usuarios");
    let usuarios = await store.getAll();

    console.log("Usuarios pendientes de sincronizar:", usuarios);
    for (let usuario of usuarios) {
        try {
            let response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(usuario),
            });

            if (response.ok) {
                console.log('Usuario sincronizado:', usuario);
                let deleteTransaction = db.transaction("usuarios", "readwrite");
                let deleteStore = deleteTransaction.objectStore("usuarios");
                deleteStore.delete(usuario.email);
            }
        } catch (error) {
            console.error('Error al sincronizar usuario', usuario, error);
        }
    }
}

// Evento de sincronización en segundo plano
self.addEventListener('sync', event => {
    if (event.tag === 'sync-usuarios') {
        event.waitUntil(syncUsuarios());
    }
});

const syncUsuarios = async () => {
    const db = await openDatabase();
    const transaction = db.transaction('usuarios', 'readwrite');
    const store = transaction.objectStore('usuarios');

    let cursor = await store.openCursor();
    while (cursor) {
        let user = cursor.value;

        try {
            let response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(user)
            });

            if (response.ok) {
                store.delete(user.email); // Borrar registro de IndexedDB si se sube correctamente
                console.log(`Usuario ${user.email} sincronizado con éxito`);
            }
        } catch (error) {
            console.error(`Error sincronizando usuario ${user.email}:`, error);
        }

        cursor = await cursor.continue();
    }
};


// Notificaciones Push
self.addEventListener('message', (event) => {
    if (event.data.action === 'sendNotification') {
        const { title, body } = event.data;
        const options = {
            body: body,
            icon: "/src/imgs/fire.png",
            image: "/src/imgs/fire.png",
            vibrate: [200, 100, 200]
        };
        self.registration.showNotification(title, options);
    }
});

// Manejo de clic en notificaciones
self.addEventListener('notificationclick', event => {
    event.notification.close();
    event.waitUntil(clients.openWindow('/'));
});
 */



function insertIndexedDB(data) {
    let request = indexedDB.open("database", 2);

    request.onupgradeneeded = event => {
        let db = event.target.result;
        if (!db.objectStoreNames.contains("offlineDB")) {
            db.createObjectStore("offlineDB", { autoIncrement: true });
        }
    };

    request.onsuccess = event => {
        let db = event.target.result;
        let transaction = db.transaction("offlineDB", "readwrite");
        let store = transaction.objectStore("offlineDB");

        store.add(data);
        console.log("usuario rgistrado Indexed, no hay conxión", data);
    };
}

console.log("asfas");
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open('appShell').then(cache => {
            return cache.addAll([
                '/',
                '/index.html',
                '/src/fallBack.html',
                "/src/index.css",
                "/src/App.css",
                '/src/assets/react.svg',
                "/src/App.jsx",
                "/src/main.jsx",
                '/src/components/login/Login.jsx',
                '/src/components/signup/Signup.jsx',
                '/src/components/splashScreen/SplashScreen.jsx',
                '/src/components/users/Users.jsx',
                '/src/components/main/Main.jsx'
            ]);
        })
    );
    self.skipWaiting();
});

self.addEventListener('fetch', event => {
    if (event.request.method === "POST" && event.request.url.includes("/register")) {
        event.respondWith(
            event.request.clone().text().then(body => {  // Clonar primero
                try {
                    let data = JSON.parse(body);
                    insertIndexedDB(data);
                    self.registration.sync.register("syncUsers");
                } catch (e) {
                    console.error("Error al analizar JSON:", e);
                }

                return fetch(event.request).catch(() => {
                    return new Response(JSON.stringify({ 
                        message: "No hay conexión. Los datos se guardaron localmente y se enviarán cuando haya conexión." 
                    }), {
                        headers: { "Content-Type": "application/json" }
                    });
                });
            })
        );
    }
});


self.addEventListener('sync', event => {
    if (event.tag === "syncUsers") {
        console.log("Intentando registrar usuarios en mongoDB");

        event.waitUntil(
            new Promise((resolve, reject) => {
                let request = indexedDB.open("database", 2);
                request.onsuccess = event => {
                    let db = event.target.result;
                    let transaction = db.transaction("offlineDB", "readwrite");
                    let store = transaction.objectStore("offlineDB");

                    let getAllRequest = store.getAll();
                    getAllRequest.onsuccess = () => {
                        let users = getAllRequest.result;
                        if (users.length === 0) {
                            console.log("No hay usuarios pendientes de registro.");
                            return resolve();
                        }

                        let syncPromises = users.map(user =>
                            fetch("http://192.168.100.16:3008/register", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify(user)
                            })
                        );

                        Promise.all(syncPromises)
                            .then(() => {
                                let clearTransaction = db.transaction("offlineDB", "readwrite");
                                let clearStore = clearTransaction.objectStore("offlineDB");
                                clearStore.clear();
                                console.log("Usuarios de indexed registrados en mongo y eliminados de Indexed.");
                                resolve();
                            })
                            .catch(reject);
                    };
                };
            })
        );
    }
});


self.addEventListener('message', (event) => {
    if (event.data.action === 'sendNotification') {
        const { title, body } = event.data;
        const options = {
            body: body,
            icon: "/src/imgs/fire.png",
            image: "/src/imgs/fire.png",
            vibrate: [200, 100, 200]
        };
        
        self.registration.showNotification(title, options);
    }
});


// Manejo de clic en notificaciones
self.addEventListener('notificationclick', event => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow('/')
    );
});
/* 

Signup.jsx:74 Error al guardar en IndexedDB: ReferenceError: openDatabase is not defined
    at handleSubmit (Signup.jsx:49:30)
handleSubmit	@	Signup.jsx:74
*/
