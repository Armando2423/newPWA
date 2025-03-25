const APP_SHELL_CACHE = 'appShell-v1';
const DYNAMIC_CACHE = 'dinamico-v1';
const API_URL = 'http://192.168.0.215:3005/register';

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

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(APP_SHELL_CACHE).then(cache => cache.addAll(APP_SHELL_FILES))
    );
    self.skipWaiting(); 
});

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



/* self.addEventListener('fetch', event => {
  if (event.request.method === "POST" && event.request.url.includes("/signup")) {
      event.respondWith(
          fetch(event.request).catch(() => {
              event.request.clone().json().then(data => {
                  insertIndexedDB(data);
                  self.registration.sync.register("sync-usuarios");
              });

              return new Response(JSON.stringify({ message: "Guardado localmente, se sincronizará cuando haya internet" }), {
                  headers: { "Content-Type": "application/json" }
              });
          })
      );
  }
}); */
function openDatabase() {
    return new Promise((resolve, reject) => {
        let request = indexedDB.open("database", 1);

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



self.addEventListener('fetch', event => {
    if (event.request.method === "POST" && event.request.url.includes("/signup")) {
        event.respondWith(
            event.request.clone().json().then(data => {
                insertIndexedDB(data);
                self.registration.sync.register("sync-usuarios");

                return fetch(event.request.clone()).catch(() => {
                    return new Response(JSON.stringify({ message: "Guardado localmente, se sincronizará cuando haya internet" }), {
                        headers: { "Content-Type": "application/json" }
                    });
                });
            }).catch(error => console.error("Error al procesar request JSON:", error))
        );
    }
});



// IndexedDB para almacenamiento de usuarios
/* function insertIndexedDB(data) {
  console.log("Intentando guardar en IndexedDB:", data);
  let request = indexedDB.open("database", 1);

  request.onsuccess = function (event) {
      let db = event.target.result;
      let transaction = db.transaction("usuarios", "readwrite");
      let store = transaction.objectStore("usuarios");

      let addRequest = store.add(data);
      addRequest.onsuccess = () => console.log("Usuario guardado correctamente:", data);
      addRequest.onerror = (err) => console.error("Error al guardar usuario:", err);
  };
}
 */

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



// Sincronización en segundo plano
self.addEventListener('sync', event => {
    if (event.tag === 'sync-usuarios') {
        event.waitUntil(syncUsuarios());
    }
});


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
    event.waitUntil(
        clients.openWindow('/')
    );
});
