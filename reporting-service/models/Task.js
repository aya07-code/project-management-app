const mongoose = require('../db');

const TaskSchema = new mongoose.Schema({
    projectId: mongoose.Schema.Types.ObjectId,
    assignedTo: mongoose.Schema.Types.ObjectId,
    title: String,
    description: String,
    priority: { type: String, enum: ['Haute', 'Moyenne', 'Basse'], default: 'Moyenne' },
    status: { type: String, enum: ['À faire', 'En cours', 'Terminé'], default: 'À faire' },
    deadline: Date,
});

module.exports = mongoose.model('Task', TaskSchema);
