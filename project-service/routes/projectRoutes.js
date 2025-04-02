const express = require('express');
const router = express.Router();
const Project = require('../models/projectModel');

// Créer un projet
router.post('/', async (req, res) => {
    try {
        const projet = new Project(req.body);
        await projet.save();
        res.status(201).json(projet);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Récupérer les projets & filtres
router.get('/', async (req, res) => {
    try {

        const { nom, date_debut, date_fin, statut } = req.query;
        let filter = {};

        if (nom) filter.nom = new RegExp(nom, 'i');
        if (date_debut) filter.date_debut = { $gte: new Date(date_debut) };
        if (date_fin) filter.date_fin = { $lte: new Date(date_fin) };
        if (statut) filter.statut = statut;

        const projets = await Project.find(filter);

        res.json(projets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Récupérer un projet par ID
router.get('/:id', async (req, res) => {
    try {
        const projet = await Project.findById(req.params.id);
        if (!projet) return res.status(404).json({ message: 'Projet non trouvé' });
        res.json(projet);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Modifier un projet
router.put('/:id', async (req, res) => {
    try {
        const projet = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!projet) return res.status(404).json({ message: 'Projet non trouvé' });
        res.json(projet);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Supprimer un projet
router.delete('/:id', async (req, res) => {
    try {
        const projet = await Project.findByIdAndDelete(req.params.id);
        if (!projet) return res.status(404).json({ message: 'Projet non trouvé' });
        res.json({ message: 'Projet supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
