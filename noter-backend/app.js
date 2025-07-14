const express = require("express");
const app = express();
const notesRoutes = require("./routes/notes.routes");
const bookmarksRoutes = require("./routes/bookmarks.routes");
const authRoutes = require("./routes/auth.routes")
const errorHandler = require("./middleware/errorHandler");
const cors = require("cors");

app.use(express.json());

app.use(cors());

app.use("/api/notes", notesRoutes);
app.use("/api/bookmarks", bookmarksRoutes);
app.use("/api/auth",authRoutes );

app.use(errorHandler);

module.exports = app;
