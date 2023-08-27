import React, { useState } from "react";
import ChangeName from "./ChangeName";
import PlayGame from "./PlayGame";
import DeleteGames from "./DeleteGames";

type UserDataManipulationProps = {
  handleRefreshGames: () => void;
};

const UserDataManipulation: React.FC<UserDataManipulationProps> = (props) => {
  const [isChangeNameInProgress, setChangeNameInProgress] = useState(false);
  const [isGameInProgress, setGameInProgress] = useState(false);
  const [gamesDeleted, setGamesDeleted] = useState(false);


  return (
    <div className="userDataManipulation border-2 border-sky-500 m-4 p-4 flex flex-col rounded-lg">
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => {
          setGameInProgress(true);
          //setGamesDeleted(false); state is false we dont need set again to false
        }}
      >
        Play Game
      </button>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => {
          setChangeNameInProgress(true);
          //setGamesDeleted(false); state is false we dont need set again to false
        }}
      >
        Change Name
      </button>
      {isChangeNameInProgress ? (
        <ChangeName setChangeNameInProgress={setChangeNameInProgress} refreshDashboard={props.handleRefreshGames}/>
      ) : (
        ""
      )}
      <PlayGame
        newGame={isGameInProgress}
        refreshDashboard={props.handleRefreshGames}
        setGameInProgress={setGameInProgress}
      />
      <DeleteGames
        onGamesDeleted={() => {
          setGamesDeleted(true);
          props.handleRefreshGames();
        }}
      />
      {gamesDeleted && (
        <div className="bg-green-300 text-green-900 p-2 mt-2">
          All games were successfully deleted.
        </div>
      )}
    </div>
  );
};

export default UserDataManipulation;
