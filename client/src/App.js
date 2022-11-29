
import Main from "./Components/Main";
import Signup from "./Components/SignUp";
import Login from "./Components/Login";
import Query from "./Components/Query";
import TAMain from "./Components/TAMain";
import { Route, Routes, Navigate } from "react-router-dom";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css"

function App() {
  const user = localStorage.getItem("token");
  const type = localStorage.getItem("type");
  console.log("Here", user);  
  return (
    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.js</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //   </header>
    // </div>
    // <div className="App">Hello World</div>
    <Routes>
			{/* {user && type === "student" && <Route path="/student" exact element={<Main />} />}
      {user && type === "student" && <Route path="/student/addQuery" exact element={<Query />} />}
      {user && type === "TA" && <Route path="/tas/queries" exact element={<TAMain />} />}
      {!user && <Route path="/student/addQuery" element={<Navigate replace to="/login" />} /> }
      {!user && <Route path="/student" element={<Navigate replace to="/login" />} /> }
      {!user && <Route path="/tas/queries" element={<Navigate replace to="/login" />} /> }
			<Route path="/signup" exact element={<Signup />} />
			<Route path="/login" exact element={<Login />} />
			<Route path="/" element={<Navigate replace to="/login" />} /> */}
      <Route path="/login" exact element={<Login />} />
      {user && <Route path="/dashboard" exact element={<Main />} />}
      {/* {user && <Route path="/student/addQuery" exact element={<Query />} />} */}
      {/* {user && <Route path="/tas/queries" exact element={<TAMain />} />} */}
      {!user && <Route path="/student/addQuery" element={<Navigate replace to="/login" />} /> }
      {!user && <Route path="/student" element={<Navigate replace to="/login" />} /> }
      {!user && <Route path="/tas/queries" element={<Navigate replace to="/login" />} /> }
			<Route path="/signup" exact element={<Signup />} />
			<Route path="/login" exact element={<Login />} />
			<Route path="/" element={<Navigate replace to="/login" />} />
		</Routes>
  );
}

export default App;
