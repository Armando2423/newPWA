const mongoose = require('mongoose');

const tempIDSchema = new mongoose.Schema({
    email: {type: String, require: true},
    tempID: {type: String, require: true},
    createdAt: {type: Date, default: Date.now, expires: 180}
});

module.exports = mongoose.model('TempID', tempIDSchema);