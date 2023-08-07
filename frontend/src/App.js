import React, { useState, useContext } from "react";
import { BackendContext } from "./BackendProvider";
import{ BsSearch } from "react-icons/bs"
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import Home from "./Home";
import Ask from "./Ask"

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home></Home>}></Route>
        <Route exact path="/ask" element={<Ask></Ask>}></Route>
      </Routes>
    </Router>
  );
}

export default App;
