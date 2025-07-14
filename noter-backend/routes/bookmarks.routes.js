const express = require("express");
const router = express.Router();
const controller = require("../controllers/bookmarks.controller");
const { protect } = require("../middleware/auth.middleware");

router.post("/", protect, controller.createBookmark);
router.get("/", protect, controller.getBookmarks);
router.get("/:id", protect, controller.getBookmarkById);
router.put("/:id", protect, controller.updateBookmark);
router.delete("/:id", protect, controller.deleteBookmark);

module.exports = router;
