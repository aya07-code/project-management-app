const express = require( "express");
const User = require("../models/User");
const { auth, isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

// Recuperer tous les users
router.get("/", auth, isAdmin, async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});
//recuperer  user par id 
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "Utilisateur non trouve" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});
// Modifier  user
router.put("/:id", auth, async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

// Supprimer  user
router.delete("/:id", auth, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Utilisateur supprime" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

//  Rechercher user par email ou username
router.get("/search", auth, isAdmin, async (req, res) => {
  try {
    const { email, username } = req.query;
    if (!email && !username) {
      return res.status(400).json({ message: "Veuillez fournir un email ou un username pour la recherche." });
    }
    const user = await User.findOne({ 
      $or: [{ email: email }, { username: username }]
    }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouve" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

//  Bloquer user par admin
router.put("/:id/block", auth, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouve" });
    }
    user.isblocked = true;
    await user.save();

    res.json({ message: `Utilisateur ${user.username} bloque avec succes.` });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

//  Debloquer user
router.put("/:id/unblock", auth, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    user.isblocked = false;
    await user.save();

    res.json({ message: `Utilisateur ${user.username} debloque avec succes.` });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

module.exports = router;