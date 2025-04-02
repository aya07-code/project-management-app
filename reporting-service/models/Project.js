const mongoose = require('../db');

const ProjectSchema = new mongoose.Schema({
    name: String,
    description: String,
    startDate: Date,
    endDate: Date,
    status: { type: String, enum: ['En cours', 'Terminé', 'En attente'], default: 'En cours' },
});

module.exports = mongoose.model('Project', ProjectSchema);

