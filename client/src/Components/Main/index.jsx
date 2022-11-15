import styles from "./styles.module.css";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { Input, Space, Spin, Card, Button, Modal, Tabs, Image, Pagination } from 'antd';
import { AppstoreOutlined, MailOutlined, SettingOutlined, StarOutlined, StarFilled } from '@ant-design/icons';
import { Menu } from 'antd';
const { Search } = Input;
const { Meta } = Card;
const TabPane = Tabs.TabPane;

const cardStyle = {
	fontFamily: "sans-serif",
	padding: "0rem",
	width: "50rem",
	marginLeft: "12rem",
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
	getItem('Favourites', 'sub1', <StarFilled />, [
	  getItem('Option 1', '1'),
	  getItem('Option 2', '2'),
	  getItem('Option 3', '3'),
	  getItem('Option 4', '4'),
	]),
	getItem('History', 'sub2', <StarFilled />, [
	  getItem('Option 5', '5'),
	  getItem('Option 6', '6'),
	]),
	getItem('Logout', 'sub3', <StarFilled />, [
	  getItem('Option 9', '9'),
	  getItem('Option 10', '10'),
	  getItem('Option 11', '11'),
	  getItem('Option 12', '12')
	]),
  ];
  
  // submenu keys of first level
  const rootSubmenuKeys = ['sub1', 'sub2', 'sub4'];

  const pageSize = 10;

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

	const [prevData, setPrevData] = useState({
		created: "",
		imglinks: "",
		link: "",
		query: "",
		rank: "",
		snippet: "",
		title: "",
		userID: ""
	});

	const [tabstate, setState] = useState({
		activeTab: "1"
	});

	const [paginationState, setPaginationState] = useState({
		totalPage: 0,
		current: 1,
		minIndex: 0,
		maxIndex: 0
	});

	const [links, setLinks] = useState({
		created: "",
		link: "",
		query: "",
		rank: "",
		snippet: "",
		title: "",
		userID: ""
	});

	const [imglinks, setImgLinks] = useState({
		created: "",
		displayLink: "",
		distance: "",
		link: "",
		query: "",
		rank: "",
		snippet: "",
		title: "",
		userID: ""
	});

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
	const params = {
		userID: localStorage.getItem("userID")
	};

	useEffect(() => {
		getPreviousQueries();
	}, []);

	const getPreviousQueries = () => {
		const url = "http://localhost:8080/api/users/getqueries";
		console.log(localStorage.getItem("userID"));
		axios.get(url, {params}).then(res => {
			console.log(res.data);
			setPrevData(res.data);
		}).catch(error => console.log(error));
	}

	const changeTab = activeKey => {
		console.log(activeKey);
		this.setState({
		  activeTab: activeKey
		});
	};

	const handleLogout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("userID");
		window.location = "http://localhost:3000/";
	};

	const saveLink = (temp1) => {
		console.log(temp1);
	}

	const handleChange = (page) => {
		setPaginationState({
		  current: page,
		  minIndex: (page - 1) * pageSize,
		  maxIndex: page * pageSize
		});
	};

	const onSearch = async (e) => {
		console.log(e);
		try {
			if(e !== '') {
				showModal();
				const url = "http://localhost:8080/api/users/submitQuery";
				data.query = e;
				console.log(data);
				const { data: res } = await axios.post(url, data);
				console.log(res);
				setLinks(res.textdata);
				setImgLinks(res.imgdata);
				console.log(imglinks);
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
			<div>
				<Tabs defaultActiveKey="1" centered>
					<TabPane tab="Text" key="1">
						<h5 style={{"marginLeft": 18}}>Settings</h5>
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
								<div>
								{links.length > 0 ? 
									links.map((data, index) => index >= paginationState.minIndex &&
									index < paginationState.maxIndex && (
										<div>
											<Card title={<a style={{"textDecoration": "none"}} href={data.link} target="_blank">{data.title}</a>} 
											extra={<a href="#" onClick={() => saveLink(data.title)}>Add to Favourites</a>} hoverable={true}>
												{data.snippet}
											</Card>
											<br />
										</div>
										)
									)
									: 
									(prevData.length > 0 ? 
										prevData.map(data => {
										return(
											<div>
												<Card
													hoverable
													style={{ width: 240 }}
													cover={
													<div style={{ overflow: "hidden", height: "100px" }}>
														<img
														alt="example"
														style={{ height: "100%", width: "100%", marginLeft: "0rem" }}
														src={data.imglinks}
														/>
													</div>
													}
													onClick={() => window.open(data.link, '_blank')}
												>
													<Meta title={data.title} description={data.snippet} />
												</Card>
												<br />
											</div>
										)
									}) :
									(<h3>No data yet</h3>)
								)
								}
								</div>
								<div>
									{links.length > 0 ? 
										<Pagination total={links.length} pageSize={10} current={paginationState.current} 
										onChange={handleChange} style={{ "marginBottom":"1rem" }}/>
										:
										<h4></h4>
									}
								</div>
							</div>
						</div>
						<Modal title="Awaiting Results..." open={isModalOpen} onOk={handleOk} onCancel={handleCancel} closable={false} footer={false} maskClosable = {false}>
							<Spin size="large" />
						</Modal>
        			</TabPane>
					<TabPane tab="Images" key="2">
					<h5 style={{"marginLeft": 18}}>Settings</h5>
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
							<div style={{"marginLeft": 550}} className="right-element">
								<div>
									{imglinks.length > 0 ? 
										imglinks.map(data => {
											return(
											<div>
												<Image.PreviewGroup>
													<Image width={200} src={data.link} />
												</Image.PreviewGroup>
												<br />
												<br />
											</div>
											)
										}) : <h3>No data yet</h3> }
								</div>
							</div>
						</div>
					</TabPane>
				</Tabs>
			</div>
		</div>
	);
};

export default Main;