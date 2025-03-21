import React, { useState } from 'react';
import './Signup.css';
import axios from 'axios';

const SignUp = () => {
    const [formData, setFormData] = useState({
        name: '',
        app: '',
        apm: '',
        email: '',
        password: ''  // Cambio de 'pwd' a 'password'
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Datos enviados:", formData);

        if (!formData.name || !formData.app || !formData.apm || !formData.email || !formData.password) {
            alert('Todos los campos son obligatorios');
            return;
        }

        try {
            const response = await axios.post('http://localhost:3005/register', formData);  // Cambio de '/signup' a '/register'
            console.log('Respuesta del servidor:', response.data);
            alert('Registro exitoso');
        } catch (error) {
            console.error('Error en el registro:', error.response ? error.response.data : error);
            alert(error.response?.data?.message || 'Error en el registro. Intenta nuevamente.');
        }
    };

    return (
        <div className="signup-container">
            <form className="signup-form" onSubmit={handleSubmit}>
                <h2>Registro</h2>

                <input type="text" name="name" id='name' placeholder="Nombre" value={formData.name} onChange={handleChange} required />
                <input type="text" name="app" id='app' placeholder="Apellido Paterno" value={formData.app} onChange={handleChange} required />
                <input type="text" name="apm" id='apm' placeholder="Apellido Materno" value={formData.apm} onChange={handleChange} required />
                <input type="email" name="email" id='email' placeholder="Correo" value={formData.email} onChange={handleChange} required />
                <input type="password" name="password" id='password' placeholder="Contraseña" value={formData.password} onChange={handleChange} required />  {/* Cambio de 'pwd' a 'password' */}

                <button type="submit">Registrarse</button>
            </form>
        </div>
    );
};

export default SignUp;
