import React, { useEffect, useState, useContext } from "react";
import { BackendContext } from "./BackendProvider";
import { useNavigate } from "react-router-dom";
import DarkModeToggle from "./components/DarkModeToggle";
import CircularProgress from "@mui/material/CircularProgress";

export default function Home({ isDark, setIsDark }) {
  const navigate = useNavigate();
  const { validApiKey, setValidApiKey } = useContext(BackendContext);
  const [apiKeyInput, setApiKeyInput] = useState(validApiKey);
  const [isValid, setIsValid] = useState(false);
  const [isKeyLoading, setIsKeyLoading] = useState(false);
  const [firstTime, setFirstTime] = useState(true);

  useEffect(() => {
    if (isValid) {
      setValidApiKey(apiKeyInput);
      navigate("/ask");
    }
  }, [isValid]);

  const handleStart = (event) => {
    event.preventDefault();
    checkApiKey();
  };

  const handleStartDemo = (event) => {
    event.preventDefault();
    navigate("/demo");
  };

  const handleChange = (event) => {
    event.preventDefault();
    setApiKeyInput(event.target.value);
  };

  const checkApiKey = async () => {
    if (apiKeyInput == "") return;

    setIsKeyLoading(true);

    const myHeaders = new Headers();
    myHeaders.append("key", apiKeyInput);

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    await fetch(
      "https://unigpt-c074044c0e9d.herokuapp.com/initkey",
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => {
        setIsValid(result.includes("success"));
      });

    setIsKeyLoading(false);
    setFirstTime(false);
  };

  return (
    <div
      className={`${
        isDark ? "dark" : "light"
      } w-full h-[100vh] text-center overflow-y-hidden flex justify-center items-center`}
    >
      {/* <DarkModeToggle isDark={isDark} setIsDark={setIsDark} /> */}
      <div className="absolute top-0 left-0 w-full justify-normal gap-4 flex text-sm rounded-lg drop_shadow p-4">
        <button
          type="submit"
          onClick={(e) => handleStartDemo(e)}
        >
          {"Try Demo"}
        </button>
        <a href="https://github.com/dourian/UniGPT">Github</a>
        <a href="https://unigpt-c074044c0e9d.herokuapp.com">API</a>
      </div>
      <div className={`${isDark ? "dark" : "light"} w-full`}>
        <h1 className={`${isDark ? "dark" : "light"} font-bold text-6xl`}>
          UniGPT
        </h1>
        <h3>
          A GPT model trained on{" "}
          <span className="text-[#C0AD00]">Waterloo</span>
        </h3>
        <form className={`drop_shadow mt-5`}>
          <label>
            <input
              className={`border-[2px] rounded-lg mx-4 py-1 px-4 h-[50px] w-[45vw] ${
                !isValid && !firstTime && !isKeyLoading && "border-red-600"
              }`}
              type="text"
              value={apiKeyInput}
              onChange={handleChange}
              placeholder={"Enter your OpenAI API key"}
            ></input>
          </label>
          <button
            className={`${
              !isDark ? "dark" : "light"
            } text-sm rounded-lg px-4 py-2 mt-[100px] drop_shadow`}
            type="submit"
            onClick={(e) => handleStart(e)}
          >
            {isKeyLoading ? (
              <CircularProgress color="inherit" size={40} />
            ) : (
              "Start"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
