import React, { useState, useEffect } from "react";
import ChangeName from "./ChangeName";
import PlayGame from "./PlayGame";
import DeleteGames from "./DeleteGames";

type UserDataManipulationProps = {
  setRefreshDashboard: (param: boolean) => void;
  refreshDashboard: boolean
};

const UserDataManipulation: React.FC<UserDataManipulationProps> = (props) => {
  const [isChangeNameInProgress, setChangeNameInProgress] = useState(false);
  const [isGameInProgress, setGameInProgress] = useState(false);
  const [gamesDeleted, setGamesDeleted] = useState(false);


  useEffect(() => {
    if (isGameInProgress) {
      setGamesDeleted(false)
    }
  }, [isGameInProgress])

  return (
    // FIX changeName a overlay div
    <div className="userDataManipulation w-60  border-2 border-sky-500 m-4 p-4 flex flex-col rounded-lg">
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => {
          setGameInProgress(true);
        }}
      >
        Play Game
      </button>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => {
          setChangeNameInProgress(true);
        }}
      >
        Change Name
      </button>
      {isChangeNameInProgress ? (
        <ChangeName setChangeNameInProgress={setChangeNameInProgress} setRefreshDashboard={props.setRefreshDashboard} />
      ) : (
        ""
      )}
      <PlayGame
        newGame={isGameInProgress}
        setGameInProgress={setGameInProgress}
        setRefreshDashboard={props.setRefreshDashboard}
      />
      <DeleteGames
        onGamesDeleted={() => {
          setGamesDeleted(true);
          props.setRefreshDashboard(true);
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
