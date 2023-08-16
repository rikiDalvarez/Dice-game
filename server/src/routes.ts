import express from "express";
import {
  deleteAllGames,
  getPlayers,
  addGame,
  changeName,
  getGames,
  getRankingWithAverage,
  getWinner,
  getLoser,
  handleLogin,
} from "./application/controller";
import { postPlayer } from "./application/controller";
import auth from "./infrastructure/middleware/auth";

const router = express.Router();

// router.get("/protected", auth, getPlayers);

router.post("/login", handleLogin);

// POST /players: crea un jugador/a.
router.post("/players", postPlayer);

// PUT /players/{id}: modifica el nom del jugador/a.
router.put("/players/:id", auth, changeName);

// GET /players: retorna el llistat de tots els jugadors/es del sistema amb el seu percentatge d’èxits.
router.get("/players", auth, getPlayers);

// POST /games/{id}: un jugador/a específic realitza una tirada.
router.post("/games/:id", auth, addGame);

// DELETE /games/{id}: elimina les tirades del jugador/a.
router.delete("/games/:id", auth, deleteAllGames);

// GET /games/{id}: retorna el llistat de jugades per un jugador/a.
router.get("/games/:id", auth, getGames);

// GET /ranking: retorna un ranking de jugadors/es ordenat per percentatge d'èxits i el percentatge d’èxits mig del conjunt de tots els jugadors/es.
router.get("/ranking", auth, getRankingWithAverage);

// GET /ranking/loser: retorna el jugador/a amb pitjor percentatge d’èxit.
router.get("/ranking/loser", auth, getLoser);

// GET /ranking/winner: retorna el jugador/a amb millor percentatge d’èxit.
router.get("/ranking/winner", auth, getWinner);

export default router;
