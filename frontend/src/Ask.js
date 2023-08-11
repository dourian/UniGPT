import React, { useState, useContext, useEffect } from "react";

import { BackendContext } from "./BackendProvider";
import Box from "@mui/material/Box";
import { IoIosArrowDropleftCircle } from "react-icons/io";
import { RiArrowUpCircleFill } from "react-icons/ri";
import { BsThreeDots } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import Prompts from "./Prompts";
import { Conversation } from "./components/Conversation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CircularProgress from "@mui/material/CircularProgress";

export default function Ask({ isDark, setIsDark }) {
  const [inputValue, setInputValue] = useState("");
  const { getAnswer, isLoading, disabledAsk, setDisabledAsk, getPrompts, prompts, setPrompts } =
    useContext(BackendContext);
  const [conversationArr, setConversationArr] = useState([]);
  const [renderedConversation, setRenderedConversation] = useState([]);

  const notify = () => toast("You cannot enter a blank question!");

  // useEffect(() => {
  //   if (!prompts.length) {
  //     getPrompts()
  //   }
  // }, [])

  useEffect(() => {
    let temp = [];
    conversationArr.forEach((item) => {
      if (item.type === "user") {
        temp.push(
          <div className=" bg-slate-500 min-h-[150px]">
            <p className="text-right w-full pl-24 pr-10 text-lg bg-red">
              {item.text}
            </p>
          </div>
        );
      } else if (item.type === "bot") {
        temp.push(
          <div className=" bg-slate-300 min-h-[150px]">
            <p className="text-left w-full pl-24 pr-10 text-lg bg-red">
              {item.text}
            </p>
          </div>
        );
      }
    });

    setRenderedConversation(temp);
    console.log(conversationArr);
  }, [conversationArr]);

  const navigate = useNavigate();

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  const queryQuestion = async (event) => {
    event.preventDefault();
    if (inputValue === "") {
      notify();
    } else {
      setInputValue("");
      setDisabledAsk("disabled");
      await setConversationArr((prev) => [
        ...prev,
        new Conversation("user", inputValue),
      ]);

      let ans = await getAnswer(inputValue);
      console.log("answer", ans);

      await setConversationArr((prev) => [
        ...prev,
        new Conversation("bot", ans),
      ]);
      console.log(conversationArr);
      
    }
  };

  return (
    <div className="w-full h-[100vh]">
      <div className="bg-[#101625] w-[80px] h-[100vh] transition-all duration-100 ease-in-out absolute z-10">
        <button className="m-4 border-b-[0.5px]" onClick={() => navigate("/")}>
          <IoIosArrowDropleftCircle className="fill-white text-[30px] m-2" />
        </button>
        <button className="flex items-center align-center w-full">
          <BsThreeDots className="flex mx-auto mt-[85vh] fill-white text-[20px]" />
        </button>
      </div>
      <div className="w-full h-[100vh] absolute flex flex-col justify-between z-0">
        <h1 className="mt-[80px] text-6xl font-bold text-black text-center w-full">
          UniGPT
        </h1>
        <div className=" h-5/6 overflow-scroll">
        {renderedConversation}
        </div>
        <Prompts />
        <div className="flex flex-row w-full mb-[10px] items-center justify-center gap-4">
          <form onSubmit={queryQuestion} className="w-[500px] drop_shadow">
            <label>
              <input
                className="border-[2px] rounded-lg mx-4 py-1 px-4 h-[50px] w-full"
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder={
                  isLoading ? "Loading..." : "What is University of Waterloo?"
                }
                disabled={disabledAsk}
              ></input>
            </label>
          </form>
          <form onSubmit={queryQuestion}>
            <button
              className="bg-[#101625] w-[50px] m-2 h-[50px] text-white text-center items-center text-sm rounded-lg drop_shadow flex flex-col justify-center relative"
              type="submit"
            >
              {isLoading ? (
                <CircularProgress color="inherit" size={40} />
              ) : (
                <RiArrowUpCircleFill className="text-[35px] mx-auto" />
              )}
            </button>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
