import express from 'express';
import { getPlayers, playgame } from './controller';
import { postPlayer } from './controller';

const router = express.Router();

// POST /players: crea un jugador/a.
router.post("/players", postPlayer );

// PUT /players/{id}: modifica el nom del jugador/a.
router.put("/players/{id}:", );

// GET /players: retorna el llistat de tots els jugadors/es del sistema amb el seu percentatge d’èxits.
router.get("/players", getPlayers);

// POST /games/{id}: un jugador/a específic realitza una tirada.
router.post("/games/:id", playgame );

// DELETE /games/{id}: elimina les tirades del jugador/a.
router.delete("/games/{id}", );

// GET /games/{id}: retorna el llistat de jugades per un jugador/a.
router.get("/games/{id}", );

// GET /ranking: retorna un ranking de jugadors/es ordenat per percentatge d'èxits i el percentatge d’èxits mig del conjunt de tots els jugadors/es.
router.get("/ranking", );

// GET /ranking/loser: retorna el jugador/a amb pitjor percentatge d’èxit.
router.get("/ranking/loser", );

// GET /ranking/winner: retorna el jugador/a amb millor percentatge d’èxit.
router.get("/ranking/winner", );

export default router;
