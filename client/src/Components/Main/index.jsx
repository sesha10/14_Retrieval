import styles from "./styles.module.css";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
// import Card from 'react-bootstrap/Card';
import { Input, Space, Spin, Card, Button, Modal } from 'antd';
import { AppstoreOutlined, MailOutlined, SettingOutlined, StarOutlined, StarFilled } from '@ant-design/icons';
import { Menu } from 'antd';
const { Search } = Input


const cardStyle = {
	fontFamily: "sans-serif",
	padding: "0rem",
	width: "50rem",
	marginLeft: "10rem",
};

function getItem(label, key, icon, children, type) {
	return {
	  key,
	  icon,
	  children,
	  label,
	  type,
	};
  }
  const items = [
	getItem('Study', 'sub1', <StarFilled />, [
	  getItem('Option 1', '1'),
	  getItem('Option 2', '2'),
	  getItem('Option 3', '3'),
	  getItem('Option 4', '4'),
	]),
	getItem('Movies', 'sub2', <StarFilled />, [
	  getItem('Option 5', '5'),
	  getItem('Option 6', '6'),
	]),
	getItem('Music', 'sub3', <StarFilled />, [
	  getItem('Option 9', '9'),
	  getItem('Option 10', '10'),
	  getItem('Option 11', '11'),
	  getItem('Option 12', '12')
	]),
  ];
  
  // submenu keys of first level
  const rootSubmenuKeys = ['sub1', 'sub2', 'sub4'];



const Main = () => {

	const [openKeys, setOpenKeys] = useState(['sub1']);
	const onOpenChange = (keys) => {
		const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
		if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
		setOpenKeys(keys);
		} else {
		setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
		}
	};

	const [error, setError] = useState("");
	const [data, setData] = useState({
		query: "",
		userID: localStorage.getItem("userID")
	});
	const [links, setLinks] = useState({
		created: "",
		link: "",
		query: "",
		rank: "",
		snippet: "",
		title: "",
		userID: ""
	})
	const [isModalOpen, setIsModalOpen] = useState(false);
	const showModal = () => {
		setIsModalOpen(true);
	};
	
	const handleOk = () => {
	setIsModalOpen(false);
	};

	const handleCancel = () => {
	setIsModalOpen(false);
	};
	// const params = {
	// 	rollno: localStorage.getItem("rollno")
	// };

	// useEffect(() => {
	// 	getAllQueries();
	// }, []);

	// const getAllQueries = () => {
	// 	const url = "http://localhost:8080/api/users/getqueries";
	// 	console.log(localStorage.getItem("rollno"));
	// 	axios.get(url, {params}).then(res => {
	// 		console.log(res.data);
	// 		setData(res.data);
	// 	}).catch(error => console.log(error));
	// }

	const handleLogout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("userID");
		// localStorage.removeItem("type");
		window.location = "http://localhost:3000/";
	};

	const onSearch = async (e) => {
		console.log(e);
		showModal();
		try {
			if(e !== '') {
				const url = "http://localhost:8080/api/users/submitQuery";
				data.query = e;
				console.log(data);
				const { data: res } = await axios.post(url, data);
				console.log(res);
				setLinks(res);
				console.log(links);
				setIsModalOpen(false);
			}
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
		<div className={styles.main_container}>
			<div>
				<nav className={styles.navbar}>
					<h1>Findsly  <Spin size="large" /></h1>
					{/* <Link to="/student/addQuery">
						<button type="button">
							Add New Query
						</button>
					</Link> */}
					{/* <Search placeholder="Search..." enterButton="Search" size="large" loading={false} /> */}
					{/* <Search placeholder="input search text" onSearch={onSearch} enterButton /> */}
					<Search
					placeholder="Search..."
					allowClear
					enterButton="Search"
					size="large"
					onSearch={onSearch}
					style={{ width: 400 }}
					/>
					<button id="mybutton" onClick={handleLogout}>
						Logout
					</button>
				</nav>
			</div>
			<br />
			<h5 style={{"marginLeft": 18}}>Favourites</h5>
			<div className="parent" style={{width: "100%", display: "flex"}}>
				<div className="left-element">
					<Menu
					mode="inline"
					openKeys={openKeys}
					onOpenChange={onOpenChange}
					style={{
						width: 256,
					}}
					items={items}
					/>
				</div>
				<div style={cardStyle} className="right-element">
					{/* <Card title="With Button" extra={<Button>Test</Button>}>
					Something here...
					</Card>
					<br />
					<Card title="With Button" extra={<a>Test</a>}>
					Something here...
					</Card> */}


					<div>
					{links.length > 0 ? 
						links.map(data => {
							return(
							<div>
								<Card title={<a href={data.link}>{data.title}</a>}>
									{data.snippet}
								</Card>
								<br />
							</div>
							)
						}) : <h3>No data yet</h3> }
					</div>
				</div>
			</div>
			<Modal title="Awaiting Results..." open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
				<Spin size="large" />
			</Modal>
			{/* <div>
				{data.length > 0 ? 
					data.map(data => {
						return(
						// <div key={data._id}>
							<Card style={{width: "50rem", marginLeft: "25rem", marginTop: "1rem"}} key={data._id}>
								<Card.Body>
									<Card.Text><b>Exam Name: </b>  {data.examname}</Card.Text>
									<Card.Text><b>Course Name: </b>{data.coursename}</Card.Text>
									<Card.Text><b>Question No.: </b>{data.questionnum}</Card.Text>
									<Card.Text><b>TA Roll: </b>{data.tarollno}</Card.Text>
									<Card.Text><b>Your Comment: </b>{data.studentcomment}</Card.Text>
									<Card.Text><b>TA's Response: </b>{data.tacomment}</Card.Text>
								</Card.Body>
							</Card>
						// </div>
						)
					}) : <h3>No data yet</h3> }
			</div> */}
			
		</div>
	);
};

export default Main;