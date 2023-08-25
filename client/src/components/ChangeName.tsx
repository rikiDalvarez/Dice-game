import React, { useState } from 'react'

//   router.put("/players/:id", auth, playerRootControllers.changeName);



interface Props {
    players: ;
    todos: Todo[];
    setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
}

const ChangeName: React.FC = ({players}) => {
	const [edit, setEdit] = useState(false)
    const [editChageName, setEditChangeName] = useState(props.name)
	const handleEdit = (e: React.FormEvent, id: number) => {
        e.preventDefault();
        setTodos(
            props.map((player) => (
                player.id === id ? { ...props, name: editTodo } : todo)
            ))
        setEdit(false);
    }
	return (
		<div>ChangeName</div>
	)
} 

export default ChangeName