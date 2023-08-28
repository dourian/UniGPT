import React, { useState, useContext } from "react";
import { BackendContext } from "./BackendProvider";
import{ BsSearch } from "react-icons/bs"
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import Home from "./Home";
import Ask from "./Ask";
import EnterKey from "./components/EnterKey";
import Demo from "./Demo";

function App() {
    const [isDark, setIsDark] = useState(false);
    const [inputValue, setInputValue] = useState("");

  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home isDark={isDark} setIsDark={setIsDark} inputValue={inputValue} setInputValue={setInputValue}></Home>}></Route>
        <Route exact path="/key" element={<EnterKey></EnterKey>}></Route>
        <Route exact path="/ask" element={<Ask isDark={isDark} setIsDark={setIsDark} inputValue={inputValue} setInputValue={setInputValue}></Ask>}></Route>
        <Route exact path="/demo" element={<Demo isDark={isDark} setIsDark={setIsDark} inputValue={inputValue} setInputValue={setInputValue}></Demo>}></Route>
      </Routes>
    </Router>
  );
}

export default App;
