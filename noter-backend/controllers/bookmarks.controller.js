const Bookmark = require("../models/Bookmark");
const fetchPageTitle = require("../utils/fetchMetadata");

exports.createBookmark = async (req, res, next) => {
  try {
    let { url, title, description, tags } = req.body;
    if (!url || !/^https?:\/\/.+/.test(url))
      return res.status(400).json({ error: "Valid URL is required" });

    if (!title) title = await fetchPageTitle(url);
    const bookmark = await Bookmark.create({ url, title, description, tags });
    res.status(201).json(bookmark);
  } catch (err) {
    next(err);
  }
};

exports.getBookmarks = async (req, res, next) => {
  try {
    const { q, tags } = req.query;
    let filter = {};
    if (q)
      filter.$or = [
        { title: new RegExp(q, "i") },
        { description: new RegExp(q, "i") },
      ];
    if (tags) filter.tags = { $all: tags.split(",") };

    const bookmarks = await Bookmark.find(filter);
    res.json(bookmarks);
  } catch (err) {
    next(err);
  }
};

exports.getBookmarkById = async (req, res, next) => {
  try {
    const bookmark = await Bookmark.findById(req.params.id);
    if (!bookmark) return res.status(404).json({ error: "Bookmark not found" });
    res.json(bookmark);
  } catch (err) {
    next(err);
  }
};

exports.updateBookmark = async (req, res, next) => {
  try {
    const bookmark = await Bookmark.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!bookmark) return res.status(404).json({ error: "Bookmark not found" });
    res.json(bookmark);
  } catch (err) {
    next(err);
  }
};

exports.deleteBookmark = async (req, res, next) => {
  try {
    const bookmark = await Bookmark.findByIdAndDelete(req.params.id);
    if (!bookmark) return res.status(404).json({ error: "Bookmark not found" });
    res.json({ message: "Bookmark deleted" });
  } catch (err) {
    next(err);
  }
};
