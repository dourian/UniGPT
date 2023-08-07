import React, { useState, useContext, useEffect } from "react";
import { BackendContext } from "./BackendProvider";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DarkModeToggle from "./components/DarkModeToggle";
import { useNavigate } from "react-router-dom";

export default function Home({ isDark, setIsDark }) {
  const [inputValue, setInputValue] = useState("");
  const navigate = useNavigate();
  const { getAnswer, setAnswer, answer, isLoading } =
    useContext(BackendContext);
  const notify = () => toast("You cannot enter a blank question!");
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  // useEffect(() => {
  //   // console.log(isLoading)
  //   if (isLoading === 2) {
  //     handleClick();
  //   }
  // }, [isLoading]);

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(inputValue);
    if (inputValue === "") {
      notify();
    } else {
      getAnswer(inputValue);
      navigate("/ask")
    }
  };

  return (
    <div
      className={`${
        isDark ? "dark" : "light"
      } w-full h-[100vh] text-center overflow-y-hidden flex justify-center items-center`}
    >
      <DarkModeToggle isDark={isDark} setIsDark={setIsDark}/>
      <div className={`${isDark ? "dark" : "light"} w-full`}>
        <h1 className={`${isDark ? "dark" : "light"} font-bold text-6xl`}>
          UniGPT
        </h1>
        <h3>
          A GPT model trained on{" "}
          <span className="text-[#C0AD00]">Waterloo</span>
        </h3>
        <form onSubmit={handleSubmit} className="drop_shadow">
          <button
            className={`${
              !isDark ? "dark" : "light"
            } text-sm rounded-lg px-4 py-2 mt-[100px] drop_shadow`}
            type="submit"
            onClick={() => handleSubmit}
          >
            {"Start"}
          </button>
          <label>
            <input
              className="border-[2px] h-[40px] rounded-lg w-1/2 mx-4 py-1 px-4"
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder={"Tell me about the University of Waterloo"}
            />
          </label>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}
