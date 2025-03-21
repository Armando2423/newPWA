import React, { useState } from 'react';
import './Login.css';
import axios from 'axios';

const Login = () => {          
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Reiniciar errores antes de enviar la petición

        try {
            const response = await axios.post('http://192.168.100.16:3005/login', { email, password });

            if (response.data.token) {
                localStorage.setItem('token', response.data.token);  // Guardar el token en localStorage
                alert(`Inicio de sesión exitoso\n\nTu token es:\n${response.data.token}`);
                console.log('Token recibido:', response.data.token);
            }
        } catch (err) {
            console.error('Error en el login:', err.response ? err.response.data : err);
            setError(err.response?.data?.message || 'Error al iniciar sesión');
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>Iniciar Sesión</h2>

                {error && <p className="error-message">{error}</p>}

                <input 
                    type="email" 
                    placeholder="Correo" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                />
                <input 
                    type="password" 
                    placeholder="Contraseña" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                />
                <button type="submit">Ingresar</button>
            </form>
        </div>
    );
};

export default Login;
