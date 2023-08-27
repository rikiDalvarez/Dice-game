import React, {useEffect, useState } from "react";
import ChangeName from "./ChangeName";
import PlayGame from "./PlayGame";

type UserDataManipulation = {
  dashboardStateChanger: (state: string) => void
}

const UserDataManipulation: React.FC <UserDataManipulation> = (props) => {
  const [changeName, setChangeName] = useState(false);
  const [isGameInProgress, setGameInProgress] = useState(false);

  useEffect(()=>{
    if (isGameInProgress){
      props.dashboardStateChanger('played')
    }
    if (changeName){
      props.dashboardStateChanger('nameChanged')
    }

  }, [changeName, isGameInProgress, props])
 
  return (
    <div className="userDataManipulation border-2 border-sky-500 m-4 p-4 flex flex-col rounded-lg">
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
       onClick={()=>{setGameInProgress(true)}}
      >
        Play Game
      </button>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => {
          setChangeName(true);
        }}
      >
        Change Name
      </button>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Delete Games
      </button>
      {changeName ? (
        <ChangeName stateChanger={setChangeName} />
      ) : (
        ""
      )}
      <PlayGame newGame={isGameInProgress} playGameChanger={setGameInProgress}/>
      {/* <ChangeName /> */}
      {/* <DeleteGames /> */}
    </div>
  );
};

export default UserDataManipulation;
