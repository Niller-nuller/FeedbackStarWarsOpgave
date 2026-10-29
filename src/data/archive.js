const mongoose = require('mongoose');

const entrySchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true, minlength: 3 },
    role: {
        type: String,
        required: true,
        lowercase: true,
        enum: ['jedi', 'sith', 'smuggler', 'rebel']
    },
    planet: { type: String, required: true }
});

module.exports = mongoose.model('Entry', entrySchema);