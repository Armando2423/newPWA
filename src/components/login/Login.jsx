import React, { useState } from 'react';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [emailFocused, setEmailFocused] = useState(false);
    const [pwdFocused, setPwdFocused] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
    
        try {
            const response = await axios.post('http://192.168.100.16:3005/login', { email, password });
    
            console.log('Datos recibidos:', response.data); // 🔍 Verifica qué datos devuelve el backend
    
            console.log("Valor de response.data.rol:", response.data.rol);
            console.log("Comparación con 'admin':", response.data.rol?.toLowerCase() === "admin");
            
            if (response.data.rol?.toLowerCase() === "admin") {
                console.log("Redirigiendo a /users");
                navigate('/users');
            } else {
                console.log("Redirigiendo a /main");
                navigate('/main');
            }
            
        } catch (err) {
            console.error('Error en el login:', err.response ? err.response.data : err);
            setError(err.response?.data?.message || 'Error al iniciar sesión');
        }
    };
    

    return (
        <div className="wrapper">
            <form onSubmit={handleSubmit}>
                <h1>Iniciar sesión</h1>
                {error && <p className="error-message">{error}</p>}
                <div className="input-box">
                    <input
                        type='email'
                        placeholder='Correo'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setEmailFocused(true)}
                        onBlur={() => setEmailFocused(false)}
                        required
                    />
                    <FaEnvelope className='icon' />
                </div>
                <div className="input-box">
                    <input
                        type='password'
                        placeholder='Contraseña'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onFocus={() => setPwdFocused(true)}
                        onBlur={() => setPwdFocused(false)}
                        required
                    />
                    <FaLock className='icon' />
                </div>

                <button type='submit'>Inicia sesión</button>

                <div className="register-link">
                    <p>¿No tienes cuenta? <span onClick={() => navigate('/signup')} className='a'>Regístrate</span></p>
                </div>
            </form>
        </div>
    );
};

export default Login;
