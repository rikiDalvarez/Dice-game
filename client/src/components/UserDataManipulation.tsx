import React, {useState } from "react";
import ChangeName from "./ChangeName";

const UserDataManipulation: React.FC = () => {
  const [changeName, setChangeName] = useState(false);

  return (
    <div className="userDataManipulation border-2 border-sky-500 m-4 p-4 flex flex-col rounded-lg">
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
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
      {/* <PlayGame /> */}
      {/* <ChangeName /> */}
      {/* <DeleteGames /> */}
    </div>
  );
};

export default UserDataManipulation;
