const Note = require("../models/Note");

exports.createNote = async (req, res, next) => {
  try {
    const { title, content, tags } = req.body;
    if (!title || !content)
      return res.status(400).json({ error: "Title and content are required" });

    const note = await Note.create({ title, content, tags });
    res.status(201).json(note);
  } catch (err) {
    next(err);
  }
};

exports.getNotes = async (req, res, next) => {
  try {
    const { q, tags } = req.query;
    let filter = {};
    if (q)
      filter.$or = [
        { title: new RegExp(q, "i") },
        { content: new RegExp(q, "i") },
      ];
    if (tags) filter.tags = { $all: tags.split(",") };

    const notes = await Note.find(filter);
    res.json(notes);
  } catch (err) {
    next(err);
  }
};

exports.getNoteById = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ error: "Note not found" });
    res.json(note);
  } catch (err) {
    next(err);
  }
};

exports.updateNote = async (req, res, next) => {
  try {
    const note = await Note.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!note) return res.status(404).json({ error: "Note not found" });
    res.json(note);
  } catch (err) {
    next(err);
  }
};

exports.deleteNote = async (req, res, next) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);
    if (!note) return res.status(404).json({ error: "Note not found" });
    res.json({ message: "Note deleted" });
  } catch (err) {
    next(err);
  }
};
