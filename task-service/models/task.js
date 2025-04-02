const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  priority: { type: String, enum: ["faible", "moyenne", "élevée"], default: "moyenne" },
  deadline: { type: Date, required: true },
  status: { type: String, enum: ["à faire", "en cours", "terminée"], default: "en cours" },
  assignedTo: { type: String, required: true }, 
  comments: [{ user: String, text: String, date: { type: Date, default: Date.now } }],
  projectId: { type: String, required: true }, 
}, { timestamps: true });

module.exports = mongoose.model("Task", TaskSchema);
