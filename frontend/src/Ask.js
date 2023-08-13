import React, { useState, useContext, useEffect, useRef } from "react";

import { BackendContext } from "./BackendProvider";
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
  const {
    getAnswer,
    isLoading,
    disabledAsk,
    setDisabledAsk,
    getPrompts,
    prompts,
    setPrompts,
  } = useContext(BackendContext);
  const [conversationArr, setConversationArr] = useState([]);
  const [renderedConversation, setRenderedConversation] = useState([]);
  const [isNew, setIsNew] = useState(true);

  const notify = () => toast("You cannot enter a blank question!");

  const bottomEl = useRef(null);

  const scrollToBottom = () => {
    bottomEl?.current?.scrollIntoView({ behavior: "smooth" });
  };

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
          <div className="bg-[#FFFFFF] min-h-[150px] border border-gray-300">
            <p className="text-right w-full pl-24 pr-10 text-lg">{item.text}</p>
          </div>
        );
      } else if (item.type === "bot") {
        temp.push(
          <div className=" bg-[#F7F7F8] min-h-[150px] border border-gray-300">
            <p className="text-left w-full pl-24 pr-10 text-lg">{item.text}</p>
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
      setIsNew(false);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [renderedConversation]);

  return (
    <div className="w-full h-[100vh]">
      <div className="bg-[#101625] w-[80px] h-[100vh] transition-all duration-100 ease-in-out absolute z-10 place-items-between ">
        <button className="m-4 border-b-[0.5px]" onClick={() => navigate("/")}>
          <IoIosArrowDropleftCircle className="fill-white text-[30px] m-2" />
        </button>
        <button className="flex items-center align-center w-full mt-[85vh]">
          <BsThreeDots className="flex mx-auto fill-white text-[20px]" />
        </button>
      </div>
      <div className="w-full h-[100vh] absolute flex flex-col justify-between z-0">
        <div className="drop_shadow w-full">
          <h1 className="mt-[15px] mb-[15px] text-6xl font-bold text-black text-center w-full">
            UniGPT
          </h1>
        </div>
        <div className="overflow-scroll flex item-start flex-col h-full">
          {renderedConversation}
          <div ref={bottomEl}></div>
        </div>
        {isNew && <Prompts />}
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
