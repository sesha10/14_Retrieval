import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styles from "./loginstyles.module.css";

const Login = () => {
	const [data, setData] = useState({ userID: "", password: ""});
	const [error, setError] = useState("");

	const type = ["student", "TA"];
	const [selectedtype, setSelected] = useState(type[0]);

	const handleChange = ({ currentTarget: input }) => {
		setData({ ...data, [input.name]: input.value });
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const url = "http://localhost:8080/api/auth";
            console.log(data);
			data.role = selectedtype;
			// alert("Before Login " + data.role);
			const { data: res } = await axios.post(url, data);
            console.log("Here", data);
			console.log("Yo", res);
			localStorage.setItem("token", res.data);
			localStorage.setItem("userID", data.userID);
			// localStorage.setItem("type", data.role);
			// if(localStorage.getItem("type") === "student")
			window.location = "http://localhost:3000/dashboard";
		} catch (error) {
            console.log("Here", error);
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
		<div className={styles.login_container}>
			<div className={styles.login_form_container}>
				<div className={styles.left}>
					<form className={styles.form_container} onSubmit={handleSubmit}>
						<h1>Login to Your Account</h1>
                        {/* <input
							type="text"
                            placeholder="RollNumber"
                            onChange={handleChange}
                            value={data.rollno}
						/> */}
						<input
							type="text"
							placeholder="userID"
							name="userID"
							onChange={handleChange}
							value={data.userID}
							required
							className={styles.input}
						/>
						<input
							type="Password"
							placeholder="Password"
							name="password"
							onChange={handleChange}
							value={data.password}
							required
							className={styles.input}
						/>
                        {/* <input
							type="Role"
							placeholder="Role(Student/TA)"
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
						<button type="submit" className={styles.green_btn}>
							Sign In
						</button>
					</form>
				</div>
				<div className={styles.right}>
					<h1>New Here ?</h1>
					<Link to="/signup">
						<button type="button" className={styles.white_btn}>
							Sign Up
						</button>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default Login;