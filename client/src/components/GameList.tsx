import React, { useState, useEffect } from "react";
import Game from "./Game";
import { GameInterface } from "./Game";
import { fetchGameList } from "../services";
interface GameListProps {
  id?: string | null;
  refreshGames: boolean;
}
const GameList: React.FC<GameListProps> = (refreshGames) => {
  const [games, setGames] = useState([]);

  const getGames = async (id: string | null) => {
    try {
      const token = localStorage.getItem("token");

      if (token) {
        const response = await fetchGameList(token, id);

        if (response.ok) {
          const responseData = await response.json();
          setGames(responseData.reverse());
        } else {
          console.error("fetching games");
        }
      } else {
        console.error("Token not found");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };
  const id = localStorage.getItem("id");
  useEffect(() => {
    getGames(id);
  }, [refreshGames, id]);

  return (
    <div className="gameList flex flex-col first-letter:items-center rounded-lg m-4 p-4  overflow-y-auto">
      {games
        ? games
          .reverse()
          .map((game: GameInterface) => <Game key={game.id} props={game} />)
        : "you havent played the game yet"}
    </div>
  );
};

export default GameList;
