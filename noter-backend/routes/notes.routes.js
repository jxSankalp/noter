const express = require("express");
const router = express.Router();
const noteController = require("../controllers/notes.controller");
const { protect } = require("../middleware/auth.middleware");

router.post("/", protect, noteController.createNote);
router.get("/", protect, noteController.getNotes);
router.get("/:id", protect, noteController.getNoteById);
router.put("/:id", protect, noteController.updateNote);
router.delete("/:id", protect, noteController.deleteNote);

module.exports = router;
