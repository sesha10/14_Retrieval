import styles from "./styles.module.css";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Card from 'react-bootstrap/Card';
const Main = () => {
	const [data, setData] = useState('');
    const [comment, setComment] = useState({
        tacomment: "",
        isactive: false
    })

	const params = {
		rollno: localStorage.getItem("rollno")
	};

	useEffect(() => {
		getAllQueries();
	}, []);

    const handleChange = ({ currentTarget: input }) => {
		setComment({ ...comment, [input.name]: input.value });
	};
	const getAllQueries = () => {
		const url = "http://localhost:8080/api/users/getconcerns";
		// console.log(localStorage.getItem("rollno"));
		axios.get(url, {params}).then(res => {
			console.log(res.data);
			setData(res.data);
		}).catch(error => console.log(error));
	}

    const handleSubmit = async (event, id) => {
		event.preventDefault();
		try {
			const url = "http://localhost:8080/api/users/addtacomment";
			console.log(data, id, comment);
			const { data: res } = await axios.patch(url, {id, comment});
			console.log(res.data);
			alert("Your response: " + comment.tacomment);
			window.location = "http://localhost:3000/tas/queries";
		} catch (error) {
			if (
				error.response &&
				error.response.status >= 400 &&
				error.response.status <= 500
			) {
				console.log(error.response.data.message);
			}
		}
	};

	const handleLogout = () => {
		localStorage.removeItem("token");
        localStorage.removeItem("rollno");
        localStorage.removeItem("type");
		window.location = "http://localhost:3000/";
	};
    
	return (
		<div className={styles.main_container}>
			<nav className={styles.navbar}>
				<h1>Student Concerns</h1>
                <button onClick={handleLogout}>
					Logout
				</button>
			</nav>

            <div>
				{data.length > 0 ?
					data.map(data => {
						return(
						// <div key={data._id}>
							<Card style={{width: "50rem", marginLeft: "25rem", marginTop: "1rem"}} key={data._id}>
								<Card.Body>
                                    <Card.Text><b>Student Roll No.: </b>{data.studentrollno}</Card.Text>
									<Card.Text><b>Course Name: </b>{data.coursename}</Card.Text>
                                    <Card.Text><b>Exam Name: </b>  {data.examname}</Card.Text>
									<Card.Text><b>Question No.: </b>{data.questionnum}</Card.Text>
									<Card.Text><b>Student's Comment: </b>{data.studentcomment}</Card.Text>
                                    {data.isactive ? 
                                        <div>
                                            <Card.Text><b>Your Response: </b><input type="text" name="tacomment" id="tacomment" value={comment.tacomment} onChange={handleChange}></input></Card.Text>
                                            <button onClick={event => handleSubmit(event, data._id)}>Post</button>
                                        </div>
                                        :
                                        <div>
                                            <Card.Text><b>Your Response: </b>{data.tacomment}</Card.Text>
                                        </div>
                                    }
								</Card.Body>
							</Card>
						// </div>
						)})
                     : <h3>No data yet</h3>}
			</div>
		</div>
	);
};

export default Main;