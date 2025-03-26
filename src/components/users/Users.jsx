import React, { useState, useEffect } from "react";
import "./Users.css";

const Users = () => {
    const [users, setUsers] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    // 🚀 Obtener usuarios desde la API
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch("http://192.168.100.16:3008/users");
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.error("❌ Error al obtener usuarios:", error);
            }
        };

        fetchUsers();
    }, []);

    const handleOpenModal = (user) => {
        setSelectedUser(user);
        setModalOpen(true);
    };

    const handleSendNotification = () => {
        if (navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({
                action: 'sendNotification',
                title: 'Notificación para ' + selectedUser.name,
                body: `Gracias ${selectedUser.name} por usar mi PWA`,
            });
        }
        setModalOpen(false);
    };

    return (
        <div className="container">
            <h1>Usuarios</h1>
            <table className="users-table">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Apellido Paterno</th>
                        <th>Apellido Materno</th>
                        <th>Correo</th>
                        <th>Enviar Notificación</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.email}>
                            <td>{user.name}</td>
                            <td>{user.app}</td>
                            <td>{user.apm}</td>
                            <td>{user.email}</td>
                            <td>
                                <button onClick={() => handleOpenModal(user)}>Notificar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {modalOpen && selectedUser && (
                <div className="modal">
                    <div className="modal-content">
                        <p>¿Quieres enviar una notificación a: <span>{selectedUser.email}</span>?</p>
                        <div className="modal-buttons">
                            <button className="btnN" onClick={handleSendNotification}>Sí</button>
                            <button className="btnN" onClick={() => setModalOpen(false)}>No</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Users;
