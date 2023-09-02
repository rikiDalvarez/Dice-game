interface Props {
	name: string | null | undefined
}

const Navbar = (props: Props) => {
	return (
		<div className="font-mono">Welcome {props.name == "null" ? "Anonim" : props.name}</div>
	)
}

export default Navbar