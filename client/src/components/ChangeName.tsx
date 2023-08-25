import React, { useEffect, useRef, useState } from 'react'
import { IPlayer } from './Player';

//   router.put("/players/:id", auth, playerRootControllers.changeName);

interface Props {
    player: IPlayer;
    players: IPlayer[];
    setData: React.Dispatch<React.SetStateAction<IPlayer[] | null>>;
}

const ChangeName: React.FC<Props> = ({player, players, setData}) => {
	
	const [edit, setEdit] = useState(false)
    const [editChageName, setEditChangeName] = useState(player.name)
	const handleEdit = (e: React.FormEvent, id: string) => {
        e.preventDefault();
        setData(
            players.map((player) => (
                player.id === id ? { ...player, name: editChageName } : player)
            ))
        setEdit(false);
    }
	const inputRef = useRef<HTMLInputElement>(null)
    useEffect(() => {
        inputRef.current?.focus();
    }, [edit])
	return (
		<form className='' onSubmit={(e) => handleEdit(e, player.id)}>
            {edit ? (
                <input
                    ref={inputRef}
                    value={editChageName}
                    onChange={(e) => setEditChangeName(e.target.value)}
                    className='' />
            ) : player.name}

            <div>
                <span className="icon" onClick={() => {
                    if (!edit) {
                        setEdit(!edit)
                    }
                }}
                >
					
                </span>
            </div>
        </form>
	)
} 

export default ChangeName