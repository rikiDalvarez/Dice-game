import express from "express";
import {
  deleteAllGames,
  getPlayers,
  playGame,
  changeName,
  getGames,
  getRankingWithAverage,
  getWinner,
  getLoser
} from "./controller";
import { postPlayer } from "./controller";

const router = express.Router();

// POST /players: crea un jugador/a.
router.post("/players", postPlayer);

// PUT /players/{id}: modifica el nom del jugador/a.
router.put("/players/:id", changeName);

// GET /players: retorna el llistat de tots els jugadors/es del sistema amb el seu percentatge d’èxits.
router.get("/players", getPlayers);

// POST /games/{id}: un jugador/a específic realitza una tirada.
router.post("/games/:id", playGame);

// DELETE /games/{id}: elimina les tirades del jugador/a.
router.delete("/games/:id", deleteAllGames);

// GET /games/{id}: retorna el llistat de jugades per un jugador/a.
router.get("/games/:id", getGames);

// GET /ranking: retorna un ranking de jugadors/es ordenat per percentatge d'èxits i el percentatge d’èxits mig del conjunt de tots els jugadors/es.
router.get("/ranking", getRankingWithAverage);

// GET /ranking/loser: retorna el jugador/a amb pitjor percentatge d’èxit.
router.get("/ranking/loser", getLoser);

// GET /ranking/winner: retorna el jugador/a amb millor percentatge d’èxit.
router.get("/ranking/winner", getWinner);

export default router;
