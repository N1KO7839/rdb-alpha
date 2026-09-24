import express from "express";
import { authenticate } from "../middleware/authenticate.js";
import { authorizeModification } from "../middleware/authorize.js";
import {
  getWatchlist,
  addMovie,
  updateMovie,
  deleteMovie
} from "../utils/db.js";

const router = express.Router();

router.use(authenticate);

// GET /api/watchlist/:userId
router.get("/:userId", async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    const list = await getWatchlist(userId);
    return res.status(200).json(list || []);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// POST /api/watchlist/:userId/movies
router.post("/:userId/movies", authorizeModification, async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    const movieData = req.body;
    const result = await addMovie(userId, movieData);
    return res.status(201).json(result);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// PUT /api/watchlist/:userId/movies/:movieId
router.put("/:userId/movies/:movieId", authorizeModification, async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    const movieId = Number(req.params.movieId);
    const updateData = req.body;
    const result = await updateMovie(userId, movieId, updateData);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// DELETE /api/watchlist/:userId/movies/:movieId
router.delete("/:userId/movies/:movieId", authorizeModification, async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    const movieId = Number(req.params.movieId);
    const result = await deleteMovie(userId, movieId);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;