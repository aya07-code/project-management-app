const express = require('express');
const Project = require('../models/Project');
const Task = require('../models/Task');
const router = express.Router();

// Rapport d'avancement d'un projet
router.get('/progress/:projectId', async (req, res) => {
    const { projectId } = req.params;

    try {
        const project = await Project.findById(projectId);
        if (!project) return res.status(404).send('Projet introuvable.');

        const tasks = await Task.find({ projectId });
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(task => task.status === 'Terminé').length;

        const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

        res.json({
            project: project.name,
            progress: `${progress.toFixed(2)}%`,
            totalTasks,
            completedTasks,
        });
    } catch (err) {
        res.status(500).send('Erreur lors de la récupération des données.');
    }
});

// Rapport de charge de travail d'un utilisateur
router.get('/workload/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const tasks = await Task.find({ assignedTo: userId });
        const groupedByStatus = tasks.reduce((acc, task) => {
            acc[task.status] = acc[task.status] ? acc[task.status] + 1 : 1;
            return acc;
        }, {});

        res.json({
            userId,
            totalTasks: tasks.length,
            statusBreakdown: groupedByStatus,
        });
    } catch (err) {
        res.status(500).send('Erreur lors de la génération du rapport.');
    }
});

module.exports = router;
