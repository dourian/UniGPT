import React from "react";
import { useNavigate } from "react-router-dom";
import DarkModeToggle from "./components/DarkModeToggle";

export default function Home({ isDark, setIsDark, inputValue, setInputValue }) {
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate("/ask")
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
          <button
            className={`${
              !isDark ? "dark" : "light"
            } text-sm rounded-lg px-4 py-2 mt-[100px] drop_shadow`}
            type="submit"
            onClick={(e) => handleSubmit(e)}
          >
            {"Start"}
          </button>
          <label>
          </label>
      </div>
    </div>
  );
}
