import { useRef, useState, useEffect } from 'react'
import { faCheck, faTimes, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import { fetchRegistration } from '../services';

const EMAIL_REGEX = /^([\w-.]+@([\w-]+\.)+[\w-]{2,4})?$/;


const Register: React.FC = () => {
	const navigate = useNavigate();
	const userRef = useRef<HTMLInputElement>(null);
	const errRef = useRef<HTMLInputElement>(null);

	const [name, setName] = useState<string | null>("")

	const [email, setEmail] = useState('');
	const [validEmail, setvalidEmail] = useState(false);
	const [userFocus, setUserFocus] = useState(false);

	const [pwd, setPwd] = useState('');
	const [validPwd, setValidPwd] = useState(false);
	const [pwdFocus, setPwdFocus] = useState(false);

	const [matchPwd, setMatchPwd] = useState('');
	const [validMatch, setValidMatch] = useState(false);
	const [matchFocus, setMatchFocus] = useState(false);

	const [errMsg, setErrMsg] = useState('');

	useEffect(() => {
		userRef.current?.focus();
	}, [])

	useEffect(() => {
		if (email.length > 0) {
			const result = EMAIL_REGEX.test(email);
			console.log(result)
			setvalidEmail(result)
		}

	}, [email]);

	useEffect(() => {

		if (pwd.length > 0) {
			const match = (pwd === matchPwd)
			setValidMatch(match);
			if (pwd.length > 3) {
				setValidPwd(true);
			} else { setValidPwd(false) }
		}
	}, [pwd, matchPwd, validPwd]);


	useEffect(() => {
		setErrMsg("");
	}, [email, pwd, matchPwd]);


	const handleClickSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		try {
			const response = await fetchRegistration({ name: (name ? name : null), email: email, password: pwd });
			if (response.ok) {
				alert("Registration completed succesfully")
				navigate("/login")

			} else {
				alert("Email and/or name already in use");
				console.error("registration failed")
			}
		} catch (error) {
			console.error("an error occurred:", error)
		}
	}

	const navigateToLogin = () => {
		navigate("/login")
	}

	return (
		<section className="min-h-screen flex items-center justify-center bg-color-movement">

			<p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} arial-alive="assertive">
				{errMsg}</p>
			<div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg ">
				<h1 className="text-2xl mb-8 shadow-md p-4"> Register </h1>
				<form className="form">
					<label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2" >
						Name
					</label>
					<input
						placeholder="Anonim"
						onChange={(e) => setName(e.target.value)}
						className="w-full p-2 border rounded-md focus:outline-none focus:border-blue-500"
						type="text"
						id="name"
						value={name}
					/>
					<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
						Email
						<span className={validEmail ? "valid" : "hide"}>
							<FontAwesomeIcon icon={faCheck} />
						</span>
						<span className={validEmail || !email ? "hide" : "invalid"}>
							<FontAwesomeIcon icon={faTimes} />
						</span>
					</label>
					<input
						className="w-full p-2 border rounded-md focus:outline-none focus:border-blue-500"
						type="text"
						id="email"
						ref={userRef}
						autoComplete="off"
						onChange={(e) => setEmail(e.target.value)}
						required
						aria-invalid={validEmail ? "true" : "false"}
						aria-describedby="uidnote"
						onFocus={() => { setUserFocus(true) }}
						onBlur={() => { setUserFocus(false) }} />
					<p id="uidnote" className={userFocus && email && !validEmail ? "instructions" : "offscreen"}>
						<FontAwesomeIcon icon={faInfoCircle} />
						must be a valid email
					</p>
					<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
						Password:
						<span className={validPwd ? "valid" : "hide"}>
							<FontAwesomeIcon icon={faCheck} />
						</span>

					</label>
					<input
						className="w-full p-2 border rounded-md focus:outline-none focus:border-blue-500"
						type="password"
						id="password"
						onChange={(e) => setPwd(e.target.value)}
						value={pwd}
						required
						aria-invalid={validPwd ? "false" : "true"}
						aria-describedby="pwdnote"
						onFocus={() => setPwdFocus(true)}
						onBlur={() => setPwdFocus(false)}
					/>
					<p id="pwdnote" className={pwdFocus && !validPwd ? "instructions" : "offscreen"}>
						<FontAwesomeIcon icon={faInfoCircle} />
						please provide a password with more than 3 characters.<br />
					</p>

					{/* match password input */}
					<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirm_pwd">
						Confirm Password:
						<span className={validMatch ? "valid" : "hide"}>
							<FontAwesomeIcon icon={faCheck} />
						</span>
					</label>
					<input
						className="w-full p-2 border rounded-md focus:outline-none focus:border-blue-500"
						type="password"
						id="confirm_pwd"
						onChange={(e) => setMatchPwd(e.target.value)}
						value={matchPwd}
						required
						aria-invalid={validMatch ? "true" : "false"}
						aria-describedby="confirmnote"
						onFocus={() => setMatchFocus(true)}
						onBlur={() => setMatchFocus(false)}
					/>
					<p id="confirmnote" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
						<FontAwesomeIcon icon={faInfoCircle} />
						Must match the first password input field.
					</p>
					<button
						className="w-full mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
						onClick={
							handleClickSubmit
						}>
						Sign Up</button>
					<button
						className="w-full mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
						type="submit"
						onClick={navigateToLogin}>
						Login
					</button>
				</form>
			</div>
		</section >
	)
}

export default Register