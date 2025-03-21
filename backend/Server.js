const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');  // Importamos JWT para generar tokens
const User = require('./models/Users');

const app = express();
const PORT = 3005;
const SECRET_KEY = '69CjCcCu97SGOGfGneDJ0UhjO5B3MAm712psmhjeBpY'; // Clave para firmar los tokens

app.use(cors({ origin: '*' }));
app.use(express.json());
 
/* 
mongodb+srv://sergioreyes21m:8cNGI2wDiRHbWpag@cluster0.na0g6.mongodb.net/demoPWA
mongodb://localhost:27017/demoPWA0
*/

mongoose.connect('mongodb://localhost:27017/demoPWA1')
    .then(() => console.log("✅ Conectado a MongoDB"))
    .catch(err => console.error("❌ Error en la conexión a MongoDB:", err));

// 🚀 Registro de usuario (sin encriptar contraseña)
app.post('/register', async (req, res) => {
    try {
        const { name, app, apm, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'El correo ya está registrado' });
        }

        const newUser = new User({
            name,
            app,
            apm,
            email,
            pwd: password // Guardamos la contraseña tal cual
        });

        await newUser.save();
        res.status(201).json({ message: 'Registro exitoso' });
    } catch (error) {
        console.error('❌ Error al registrar usuario:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

// 🚀 Login de usuario (sin comparación de contraseña encriptada)
/* app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Buscar usuario por email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Usuario no encontrado' });
        }

        // Verificar si la contraseña coincide directamente
        if (password !== user.pwd) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        // Generar token JWT
        const token = jwt.sign({ userId: user._id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });

        res.json({ message: 'Inicio de sesión exitoso', token });
    } catch (error) {
        console.error('❌ Error en el login:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
}); */

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Buscar usuario por email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Usuario no encontrado' });
        }

        // Verificar si la contraseña coincide directamente
        if (password !== user.pwd) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        // Generar token JWT
        const token = jwt.sign({ userId: user._id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });

        // Enviar el token en la respuesta
        res.json({ message: 'Inicio de sesión exitoso', token });
    } catch (error) {
        console.error('❌ Error en el login:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});


app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en: http://localhost:${PORT}`);
});
