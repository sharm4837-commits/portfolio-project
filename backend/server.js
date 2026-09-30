const express = require("express");
const cors = require("cors");
const fs = require("fs");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Storage: MongoDB when MONGO_URI is set, otherwise a local JSON file (for offline testing)
let saveMessage, listMessages;
if (process.env.MONGO_URI) {
  const mongoose = require("mongoose");
  mongoose.connect(process.env.MONGO_URI).then(() => console.log("MongoDB connected"));
  const Message = mongoose.model("Message", {
    name: String, email: String, message: String, createdAt: { type: Date, default: Date.now },
  });
  saveMessage = (m) => Message.create(m);
  listMessages = () => Message.find().sort({ createdAt: -1 });
} else {
  const FILE = "messages.json";
  const read = () => (fs.existsSync(FILE) ? JSON.parse(fs.readFileSync(FILE)) : []);
  saveMessage = async (m) => { const a = read(); a.push({ ...m, createdAt: new Date() }); fs.writeFileSync(FILE, JSON.stringify(a, null, 2)); };
  listMessages = async () => read();
}

app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) return res.status(400).json({ error: "All fields are required" });
  await saveMessage({ name, email, message });
  res.status(201).json({ success: true });
});
app.get("/api/contact", async (req, res) => res.json(await listMessages()));

app.listen(process.env.PORT || 5000, () => console.log("Server running on port " + (process.env.PORT || 5000)));
