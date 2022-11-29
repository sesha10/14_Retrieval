import styles from "./styles.module.css";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { Input, Space, Spin, Card, Button, Modal, Tabs, Image, Pagination } from 'antd';
import { HistoryOutlined, StarFilled } from '@ant-design/icons';
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
  let items = [
	// getItem('Favourites', 'sub1', <StarFilled />, [
	//   getItem('Option 1', '1'),
	//   getItem('Option 2', '2'),
	//   getItem('Option 3', '3'),
	//   getItem('Option 4', '4'),
	// ]),
	// getItem('History', 'sub2', <StarFilled />, [
	//   getItem('Option 5', '5'),
	//   getItem('Option 6', '6'),
	// ]),
	// getItem('Logout', 'sub3', <StarFilled />, [
	//   getItem('Option 9', '9'),
	//   getItem('Option 10', '10'),
	//   getItem('Option 11', '11'),
	//   getItem('Option 12', '12')
	// ]),
  ];
  
  // submenu keys of first level
  const rootSubmenuKeys = ['sub1', 'sub2', 'sub4'];

  const pageSize = 10;
let submenuNum = 0;
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

	const [bookmark, setBookMarks] = useState({
		link: "",
		title: "",
		userID: localStorage.getItem("userID")
	});

	const [history, setHistory] = useState({
		link: "",
		title: "",
		userID: localStorage.getItem("userID")
	});

	const [userhistory, setUserHistory] = useState({
		link: "",
		title: "",
		userID: localStorage.getItem("userID")
	});

	let [userbookmark, setUserBookMarks] = useState([{
		link: "",
		title: "",
		userID: ""
	}]);

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
		maxIndex: 10
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


	const getPreviousQueries = () => {
		const url = "http://localhost:8080/api/users/getqueries";
		console.log(localStorage.getItem("userID"));
		axios.get(url, {params}).then(res => {
			console.log("Before Return", res.data.sendData);
			if(res.data.sendData.length == 0) {
				items = [
					getItem('Favourites', 'sub1', <StarFilled />, []),
					getItem('History', 'sub2', <HistoryOutlined />, [])
				];
				return;
			}

			console.log("After Return");
			console.log(res.data.bookmarks);
			setPrevData(res.data.sendData);
			setUserBookMarks(res.data.bookmarks);
			setUserHistory(res.data.history);
			console.log(userbookmark);
			console.log(prevData);

			items = [
				getItem('Favourites', 'sub1', <StarFilled />, res.data.bookmarks.map((data, index) => getItem(data.title, index))),
				getItem('History', 'sub2', <HistoryOutlined />, res.data.history.slice(0).reverse().map((data, index) => getItem(data.title, index)))
			];


		}).catch(error => console.log(error));
	}

	const getBookmarks = () => {
		const url = "http://localhost:8080/api/users/getbookmarks";
		console.log(localStorage.getItem("userID"));
		axios.get(url, {params}).then(res => {
			console.log(res.data.bookmarks);
			// setPrevData(res.data.sendData);
			setUserBookMarks(res.data.bookmarks);
			console.log(userbookmark);
			// console.log(prevData);

			items = [
				getItem('Favourites', 'sub1', <StarFilled />, res.data.bookmarks.map((data, index) => getItem(data.title, index))),
				getItem('History', 'sub2', <HistoryOutlined />, userhistory.slice(0).reverse().map((data, index) => getItem(data.title, index)))
			];


		}).catch(error => console.log(error));
	}

	const getHistory = () => {
		const url = "http://localhost:8080/api/users/gethistory";
		console.log(localStorage.getItem("userID"));
		axios.get(url, {params}).then(res => {
			console.log(res.data.userhistory);
			// setPrevData(res.data.sendData);
			setUserHistory(res.data.userhistory);
			console.log(userhistory);
			// console.log(prevData);

			// items = [
			// 	getItem('History', 'sub2', <StarFilled />, res.data.userhistory.map((data, index) => getItem(data.title, index)))
			// ];
			// items.(getItem('History', 'sub2', <StarFilled />, res.data.userhistory.map((data, index) => getItem(data.title, index))))
			items = [
				getItem('Favourites', 'sub1', <StarFilled />, userbookmark.map((data, index) => getItem(data.title, index))),
				getItem('History', 'sub2', <HistoryOutlined />, res.data.userhistory.slice(0).reverse().map((data, index) => getItem(data.title, index)))
			];
		}).catch(error => console.log(error));
	}

	useEffect(() => {
		getPreviousQueries();
	}, []);

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

	const saveLink = async (title, link) => {
		console.log(title, link);
		try {
			if(title !== '' && link !== '') {
				// showModal();
				const url = "http://localhost:8080/api/users/addBookmark";
				bookmark.link = link;
				bookmark.title = title
				console.log(bookmark);
				const { data: res } = await axios.post(url, bookmark);
				console.log(res);
				getBookmarks();
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
	}

	const addHistory = async (title, link) => {
		console.log(title, link);
		try {
			if(title !== '' && link !== '') {
				const url = "http://localhost:8080/api/users/addHistory";
				history.link = link;
				history.title = title
				console.log(history);
				const { data: res } = await axios.post(url, history);
				console.log(res);
				getHistory();
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
	}

	const removeLink = async (title, link) => {
		console.log(title, link);
		try {
			if(title !== '' && link !== '') {
				// showModal();
				const url = "http://localhost:8080/api/users/removeBookmark";
				bookmark.link = link;
				bookmark.title = title;
				console.log(bookmark);
				const { data: res } = await axios.post(url, bookmark);
				console.log(res);
				getBookmarks();
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
	}

	const handleChange = (page) => {
		console.log("Inside here");
		setPaginationState({
		  current: page,
		  minIndex: (page - 1) * pageSize,
		  maxIndex: page * pageSize
		});
	};

	const gotoNewLink = (info) => {
		console.log('click ', info);
		if(info.keyPath[1] == 'sub1') {
			window.open(userbookmark[info.key].link, '_blank').focus();
			addHistory(userbookmark[info.key].title,userbookmark[info.key].link);
		}
		else if(info.keyPath[1] == 'sub2') {
			window.open(userhistory[userhistory.length - info.key - 1].link, '_blank').focus();
			addHistory(userhistory[userhistory.length - info.key - 1].title,userhistory[userhistory.length - info.key - 1].link);
		}
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
					{/* <button id="mybutton" onClick={handleLogout}>
						Logout
					</button> */}
					<Button size="large" id="mybutton" onClick={handleLogout} style={{"marginRight": "1rem"}}>Logout</Button>
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
								onTitleClick={() => alert("HELLO WORLD")}
								onClick={gotoNewLink}
								/>
							</div>
							<div style={cardStyle} className="right-element">
								<div>
								{links.length > 0 ? 
									links.map((data, index) => index >= paginationState.minIndex &&
									index < paginationState.maxIndex && (
										<div>
											{userbookmark.find(obj => obj.link == data.link) != null ?
											<Card title={<a style={{"textDecoration": "none"}} href={data.link} onClick={() => addHistory(data.title, data.link)} target="_blank">{data.title}</a>} 
											extra={<a href="#" onClick={() => removeLink(data.title, data.link)}>Remove from Favourites</a>} hoverable={true}>
												{data.snippet}
											</Card>
											:
											<Card title={<a style={{"textDecoration": "none"}} href={data.link} onClick={() => addHistory(data.title, data.link)} target="_blank">{data.title}</a>} 
											extra={<a href="#" onClick={() => saveLink(data.title, data.link)}>Add to Favourites</a>} hoverable={true}>
												{data.snippet}
											</Card>
											}
											<br />
										</div>
										)
									)
									: 
									(prevData.length > 0 ? 
										prevData.map(data => {
										return(
											<div style={{"display":"inline-block", "marginLeft":"0.5rem", "marginTop":"0.5rem"}}>
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
												{/* <br /> */}
											</div>
										)
									}) :
									(<h3>No data yet</h3>)
								)
								}
								</div>
								<div>
									{links.length > 0 ? 
										<div>
											<Pagination total={links.length} pageSize={10} current={paginationState.current} 
											onChange={handleChange} style={{ "marginBottom":"1rem" }}/>
										</div>
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
							<div style={{"marginLeft": 50}} className="right-element">
								<div>
									{imglinks.length > 0 ? 
										imglinks.map(data => {
											return(
											<div style={{"display":"inline-block", "marginLeft":"0.5rem", "marginTop":"0.5rem"}}>
												<Image.PreviewGroup>
													<Image width={200} src={data.link} />
												</Image.PreviewGroup>
												{/* <br /> */}
												{/* <br /> */}
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