import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaLock, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Signup.css';

const SignUp = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        app: '',
        apm: '',
        email: '',
        password: ''
    });

    const [error, setError] = useState('');  // Estado para errores

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');  // Limpiar error previo

        if (!formData.name || !formData.app || !formData.apm || !formData.email || !formData.password) {
            setError('Todos los campos son obligatorios');
            return;
        }

        try {
            const response = await axios.post('http://192.168.100.16:3005/register', {
                name: formData.name,
                app: formData.app,
                apm: formData.apm,
                email: formData.email,
                pwd: formData.password
            });
            console.log('Respuesta del servidor:', response.data);
            alert('Registro exitoso');
            navigate('/');
        } catch (error) {
            console.log('Error en el registro:', error.response ? error.response.data : error);
            setError(error.response?.data?.message || 'Error en el registro. Intenta nuevamente.');
        }
    };

    return (
        <div className="wrapper">
            <div className="back-arrow" onClick={() => navigate(-1)}>
                <div className="circle">
                    <FaArrowLeft className="icon_back" />
                </div>
            </div>

            <h1>Registro</h1>
            <div className="line" />

            {error && <p className="error-message">{error}</p>}  {/* Mostrar errores */}

            <form onSubmit={handleSubmit}>
                <div className="input-box">
                    <input
                        type="text"
                        name="name"
                        placeholder="Nombre"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                    <FaUser className="icon" />
                </div>

                <div className="input-box">
                    <input
                        type="text"
                        name="app"
                        placeholder="Apellido Paterno"
                        value={formData.app}
                        onChange={handleChange}
                        required
                    />
                    <FaUser className="icon" />
                </div>

                <div className="input-box">
                    <input
                        type="text"
                        name="apm"
                        placeholder="Apellido Materno"
                        value={formData.apm}
                        onChange={handleChange}
                        required
                    />
                    <FaUser className="icon" />
                </div>

                <div className="input-box">
                    <input
                        type="email"
                        name="email"
                        placeholder="Correo"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <FaEnvelope className="icon" />
                </div>

                <div className="input-box">
                    <input
                        type="password"
                        name="password"
                        placeholder="Contraseña"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <FaLock className="icon" />
                </div>

                <button type="submit">Registrarse</button>
            </form>
        </div>
    );
};

export default SignUp;
