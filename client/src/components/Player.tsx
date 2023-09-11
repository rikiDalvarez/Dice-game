import React from "react";

export interface IPlayer {
  id: string;
  email: string;
  name: string;
  successRate: number;
  registrationDate: string;
}

interface Props {
  props: IPlayer;
}

const Player: React.FC<Props> = ({ props }) => {
  let backgroundColorClass = "bg-red-200";

  if (props.successRate > 19) {
    backgroundColorClass = "bg-green-200";
  } else if (props.successRate > 10) {
    backgroundColorClass = "bg-amber-300";
  }

  const playerName = props.name ? props.name : "Anonim";
  const date = new Date(props.registrationDate);
  const dateString = date.toLocaleDateString();
  const timeString = date.toLocaleTimeString();
  return (
    <div className="card font-mono " key={props.email}>
      <div
        className={`m-2 p-2 border-2 ${backgroundColorClass}`}
        key={props.email}
      >
        <h3>{playerName}</h3>
        <p>Rating: {props.successRate}</p>
        <p>
          Registration Date: {dateString}, {timeString}
        </p>
      </div>
    </div>
  );
};

export default Player;
