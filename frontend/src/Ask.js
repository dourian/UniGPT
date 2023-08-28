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

export default function Ask() {
  const {
    getAnswer,
    isLoading,
    disabledAsk,
    setDisabledAsk,
    validApiKey,
    inputValue,
    setInputValue,
  } = useContext(BackendContext);
  const [conversationArr, setConversationArr] = useState([]);
  const [renderedConversation, setRenderedConversation] = useState([]);
  const [showPrompts, setShowPrompts] = useState(true);

  const notify = () => toast("You cannot enter a blank question!");

  const bottomEl = useRef(null);

  const scrollToBottom = () => {
    bottomEl?.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (validApiKey == "") {
      navigate("/");
    }
  }, [validApiKey]);

  useEffect(() => {
    let temp = [];
    conversationArr.forEach((item) => {
      if (item.type === "user") {
        temp.push(
          <div className="bg-[#FFFFFF] border border-gray-300 h-fit">
            <p className="text-right w-full pl-24 pr-10 text-lg pt-5 pb-5">
              {item.text}
            </p>
          </div>
        );
      } else if (item.type === "bot") {
        temp.push(
          <div className="bg-[#F7F7F8] border border-gray-300 h-fit">
            <p className="text-left w-full pl-10 pr-24 text-lg pt-5 pb-5">
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

  const queryQuestion = async (event) => {
    event.preventDefault();
    setShowPrompts(false);
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
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [renderedConversation]);

  return (
    <div className="w-full h-[100vh]">
      <div className="w-full h-[100vh] absolute flex flex-col justify-between z-0">
        <div className="drop_shadow w-full flex items-center">
          <button className="m-2" onClick={() => navigate("/")}>
            <IoIosArrowDropleftCircle className="fill-black text-[30px]" />
          </button>
          <h6 className="text-2xl font-bold text-black text-center flex-grow">
            UniGPT
          </h6>
        </div>
        {showPrompts ? (
          <Prompts />
        ) : (
          <div className="overflow-scroll flex item-start flex-col h-full">
            {renderedConversation}
            <div ref={bottomEl}></div>
          </div>
        )}
        <div className="flex flex-row w-full mb-[10px] items-center justify-center gap-4">
          <button className="flex items-center align-center m-3">
            <BsThreeDots className="flex mx-auto fill-black text-[20px]" />
          </button>
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
