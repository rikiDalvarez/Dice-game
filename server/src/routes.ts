import { Router } from "express";
import { PlayerRootControllers, RankingRootControllers } from "./app";
import auth from "./infrastructure/middleware/auth";




export async function initRoutes(router: Router, playerRootControllers:PlayerRootControllers, rankingRootControllers:RankingRootControllers) {
  // const router = express.Router();

  // router.get("/protected", auth, getPlayers);

  router.post("/login", playerRootControllers.handleLogin);

  // POST /players: crea un jugador/a.
  router.post("/players", playerRootControllers.postPlayer);

  // PUT /players/{id}: modifica el nom del jugador/a.
  router.put("/players/:id", auth, playerRootControllers.changeName);

  // GET /players: retorna el llistat de tots els jugadors/es del sistema amb el seu percentatge d’èxits.
  router.get("/players", auth, playerRootControllers.getPlayers);

  // POST /games/{id}: un jugador/a específic realitza una tirada.
  router.post("/games/:id", auth, playerRootControllers.addGame);

  // DELETE /games/{id}: elimina les tirades del jugador/a.
  router.delete("/games/:id", auth, playerRootControllers.deleteAllGames);

  // GET /games/{id}: retorna el llistat de jugades per un jugador/a.
  router.get("/games/:id", auth, playerRootControllers.getGames);

  // GET /ranking: retorna un ranking de jugadors/es ordenat per percentatge d'èxits i el percentatge d’èxits mig del conjunt de tots els jugadors/es.
  router.get("/ranking", auth, rankingRootControllers.getRankingWithAverage);

  // GET /ranking/loser: retorna el jugador/a amb pitjor percentatge d’èxit.
  router.get("/ranking/loser", auth, rankingRootControllers.getLoser);

  // GET /ranking/winner: retorna el jugador/a amb millor percentatge d’èxit.
  router.get("/ranking/winner", auth, rankingRootControllers.getWinner);

  // return router
}
