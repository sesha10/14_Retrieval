import styles from "./styles.module.css";
import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Dropdown from 'react-bootstrap/Dropdown';

const SubmitQuery = () => {

	const [data, setData] = useState({
		examname: "",
		coursename: "",
		questionnum: "",
		tarollno: "",
		studentrollno: localStorage.getItem("rollno"),
		tacomment: "",
		studentcomment: "",
		isactive: true,
	});
	const tarollnos = ["2021102037", "2021102025", "2021102035", "2021102067", "2021102088"];
	const [selectedrollno, setSelected] = useState(tarollnos[0]);

	const [error, setError] = useState("");
	const navigate = useNavigate();

	const handleChange = ({ currentTarget: input }) => {
		// setData(...data, [e.target.name]: e.target.value});
		setData({ ...data, [input.name]: input.value });
		// setData({tarollno: selectedrollno});
	};

	// const handleChange = (e) => {
	// 	setData({...data, [e.target.name]: e.target.value});
	// 	// setData({ ...data, [input.name]: input.value });
	// 	// setData({tarollno: selectedrollno});
	// };

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const url = "http://localhost:8080/api/users/addquery";
			data.tarollno = selectedrollno;
			console.log(data);
			const { data: res } = await axios.post(url, data);
			console.log(res.message);
			alert(res.message);
			window.location = "http://localhost:3000/student";
			// window.location.reload();
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


	const handleLogout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("type");
		localStorage.removeItem("rollno");
		window.location.reload();
	};
    
	return (
		<div className={styles.main_container}>
			<nav className={styles.navbar}>
				<h1>Query Form</h1>
                <Link to="/student">
                    <button type="button">
                        Dashboard
                    </button>
                </Link>
                <button onClick={handleLogout}>
					Logout
				</button>
			</nav>
			<div className="container">
				<form onSubmit={handleSubmit}>
					<label>Exam Name:</label>
					<input type="text" id="examname" name="examname" placeholder="Which exam is it?" value={data.examname} onChange={handleChange}
					required />

					<label>Course Name:</label>
					<input type="text" id="coursename" name="coursename" placeholder="Which course is it?" value={data.coursename} onChange={handleChange}
					required/>

					<label>Question No.:</label>
					<input type="text" id="quesno" name="questionnum" placeholder="Enter Question Number" value={data.questionnum} onChange={handleChange}
					required/>

					<label>TA's RollNo:</label>
					<select onChange={e => setSelected(e.target.value)}>
						{tarollnos.map((value) => (
						<option value={value} key={value}>
							{value}
						</option>
						))}
					</select>
					{/* <input type="text" id="tarollno" name="tarollno" placeholder="Select TA RollNo" value={data.tarollno} onChange={handleChange} */}
					{/* required/> */}
					{/* <label>Country</label>
					<select id="country" name="country">
					<option value="australia">Australia</option>
					<option value="canada">Canada</option>
					<option value="usa">USA</option>
					</select> */}

					<label>Comments</label>
					<textarea id="comment" name="studentcomment" placeholder="Any message from your side?" value={data.studentcomment} onChange={handleChange}
					required></textarea>
					{error && <div className={styles.error_msg}>{error}</div>}
					<input type="submit" value="Submit" />
				</form>
			</div>		
		</div>
	);
};

export default SubmitQuery;