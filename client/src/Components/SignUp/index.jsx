import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import styles from "./styles.module.css";

const Signup = () => {
	const [data, setData] = useState({
		userID: "",
		password: ""
	});
	const [error, setError] = useState("");
	const navigate = useNavigate();

	const type = ["student", "TA"];
	const [selectedtype, setSelected] = useState(type[0]);

	const handleChange = ({ currentTarget: input }) => {
		setData({ ...data, [input.name]: input.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const url = "http://localhost:8080/api/users/signup";
			// data.role = selectedtype;
			console.log(data);
			const { data: res } = await axios.post(url, data);
			console.log(res.message);
			navigate("/login");
		} catch (error) {
			if (
				error.response &&
				error.response.status >= 400 &&
				error.response.status <= 500
			) {
				setError(error.response.data.message);
			}
		}
	};

	return (
		<div className={styles.signup_container}>
			<div className={styles.signup_form_container}>
				<div className={styles.left}>
					<h1>Welcome Back</h1>
					<Link to="/login">
						<button type="button" className={styles.white_btn}>
							Sign in
						</button>
					</Link>
				</div>
				<div className={styles.right}>
					<form className={styles.form_container} onSubmit={handleSubmit}>
						<h1>Create Account</h1>
						<input
							type="text"
							placeholder="User ID"
							name="userID"
							onChange={handleChange}
							value={data.userID}
							required
							className={styles.input}
						/>
						<input
							type="password"
							placeholder="Password"
							name="password"
							onChange={handleChange}
							value={data.password}
							required
							className={styles.input}
						/>
						{/* <input
							type="text"
							placeholder="Role"
							name="role"
							onChange={handleChange}
							value={data.role}
							required
							className={styles.input}
						/> */}
						{/* <select className={styles.input} onChange={e => setSelected(e.target.value)}>
						{type.map((value) => (
						<option value={value} key={value}>
							{value}
						</option>
						))}
						</select> */}
						{error && <div className={styles.error_msg}>{error}</div>}
						<button type="submit" className={styles.green_btn} onClick={handleSubmit}>
							Sign Up
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Signup;