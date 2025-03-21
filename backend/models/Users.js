const mongoose = require('mongoose');

const UserSchem = new mongoose.Schema({
    name : String,
    app: String,
    apm: String,
    email:  {type: String, unique: true},
    pwd: { type: String, required: true }
});

module.exports = mongoose.model('users', UserSchem);