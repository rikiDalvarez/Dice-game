interface Props {
	name: string | null | undefined
}

const Navbar = (props: Props) => {
	return (
		<div>Welcome {props.name}</div>
	)
}

export default Navbar