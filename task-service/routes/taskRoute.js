const express = require("express");
const router = express.Router();
const Task = require("../models/task");
const axios = require("axios");


const checkUser = async (userId) => {
  try {
    const response = await axios.get(`http://auth-service:5000/users/${userId}`);
    return response.status === 200;
  } catch (error) {
    return false;
  }
};


const checkProject = async (projectId) => {
  try {
    const response = await axios.get(`http://project-service:5001/projects/${projectId}`);
    return response.status === 200;
  } catch (error) {
    return false;
  }
};


router.post("/add", async (req, res) => {
  try {
  const { title, description, priority, deadline, assignedTo, projectId } = req.body;

  if (!(await checkUser(assignedTo))) {
    return res.status(400).json({ message: "Utilisateur non valide" });
  }
  if (!(await checkProject(projectId))) {
    return res.status(400).json({ message: "Projet non valide" });
  }

  const task = new Task({
    title,
    description,
    priority: priority || 'medium',
    deadline,
    projectId: projectId,
    assignedTo: userId,
    status: 'todo'
  });
  const savedTask = await task.save();
  await axios.post(`http://project-service:5001/projects/${projectId}/tasks`, {
    taskId: savedTask._id,
    action: 'created'
  });
  res.status(201).json(task);
} catch (error) {
  res.status(500).json({ error: error.message });
}
});

router.get('/tasks/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;

    if (!(await checkProject(projectId))) {
      return res.status(403).json({ error: "Accès au projet refusé" });
    }

    const tasks = await Task.find({ projectId: projectId });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.get('/:taskId', async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId)

    if (!task) {
      return res.status(404).json({ error: "Tâche non trouvée" });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.get("/all", async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});


router.put("/:id", async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(task);
});


app.put('/tasks/:id/assign', async (req, res) => {
  const { userId } = req.body;
  const updatedTask = await Task.findByIdAndUpdate(req.params.id, { assignedTo: userId }, { new: true }).populate('assignedTo', 'name email');
  res.json(updatedTask);
});

app.put('/tasks/:id/status', async (req, res) => {
  const { status } = req.body;
  if (!['à faire', 'en cours', 'terminée'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }
  const updatedTask = await Task.findByIdAndUpdate(req.params.id, { status }, { new: true }).populate('assignedTo', 'name email');
  res.json(updatedTask);
});

app.post('/tasks/:id/comments', async (req, res) => {
  const { user, text } = req.body;
  if (!user || !text) {
    return res.status(400).json({ message: 'User and text are required' });
  }
  const task = await Task.findById(req.params.id);
  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }
  task.comments.push({ user, text, date: new Date() });
  await task.save();
  res.json(task);
});
router.delete("/:id", async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

module.exports = router;
