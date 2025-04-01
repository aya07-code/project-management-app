const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    description: { type: String, required: true },
    date_debut: { type: Date, required: true },
    date_fin: { type: Date, required: true },
    statut: { type: String, enum: ['En cours', 'Terminé', 'Annulé'], required: true },
    categorie: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);
