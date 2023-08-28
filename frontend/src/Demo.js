import React, { useState, useContext, useEffect, useRef } from "react";

import { BackendContext } from "./BackendProvider";
import { IoIosArrowDropleftCircle } from "react-icons/io";
import { RiArrowUpCircleFill } from "react-icons/ri";
import { BsThreeDots } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { Conversation } from "./components/Conversation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CircularProgress from "@mui/material/CircularProgress";
import { Modal, Button, Tooltip, Popover } from 'antd';
import { IoSend } from "react-icons/io5";

export default function Demo({ isDark, setIsDark }) {
  const {
    getAnswer,
    isLoading,
    disabledAsk,
    setDisabledAsk,
    validApiKey,
    getPrompts, 
    inputValue,
    setInputValue,
    prompts,
    setPrompts
  } = useContext(BackendContext);
  const [conversationArr, setConversationArr] = useState([]);
  const [renderedConversation, setRenderedConversation] = useState([]);
  const [isNew, setIsNew] = useState(true);
  const [showPrompts, setShowPrompts] = useState(true);
  const [demoSteps, setDemoSteps] = useState([true, false, false, false]);
  

  const notify = () => toast("You cannot enter a blank question!");

  const bottomEl = useRef(null);

  const scrollToBottom = () => {
    bottomEl?.current?.scrollIntoView({ behavior: "smooth" });
  };

  // useEffect(() => {
  //   if (validApiKey == "") {
  //       navigate("/")
  //   }
  // },[validApiKey])
  const handleStartDemo = () => {
    setDemoSteps([false, true, false, false])
  };

  useEffect(() => {
    let temp = [];
    conversationArr.forEach((item) => {
      if (item.type === "user") {
        temp.push(
          <div className="bg-[#FFFFFF] border border-gray-300 h-fit">
            <p className="text-right w-full pl-24 pr-10 text-lg pt-5 pb-5">{item.text}</p>
          </div>
        );
      } else if (item.type === "bot") {
        temp.push(
          <div className="bg-[#F7F7F8] border border-gray-300 h-fit">
            <p className="text-left w-full pl-10 pr-24 text-lg pt-5 pb-5">{item.text}</p>
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

  function Prompts () {
    const {
        getPrompts,
        prompts,
        setPrompts,
        inputValue,
        setInputValue
    } = useContext(BackendContext);

    const [hoveredPrompt, setHoveredPrompt] = useState()

    const generatePrompt = async (item) => {
        setDemoSteps([false, false, true, false])
        setInputValue(item)
    }
    
    return (
        <div className="w-[500px] grid grid-cols-2 gap-x-[6px] gap-y-[6px] self-center text-black">
            {prompts && prompts.map((item, index) => (
               (index === 2 ?
                <Popover
                    content={"Hover over this prompt and click the send button!"}
                    visible={demoSteps[1]}
                >
                        <div key={index} className= {demoSteps[1] ? "flex border-black flex-row transition-border-color ease-in-out transition-[900ms] rounded-lg py-2 px-2 text-[14px] border-[1.5px] leading-snug h-[80px] animate-pulse" : "flex flex-row transition-border-color ease-in-out  transition-[900ms] rounded-lg py-2 px-2 text-[14px] border-[1.5px] leading-snug h-[80px]"} onMouseEnter={() => setHoveredPrompt(item)} onMouseLeave={() => setHoveredPrompt()}>                      
                            <div className = "w-[200px] mx-[10px] my-auto">{item}</div>
                            <Tooltip title = "Click to send" className="">
                                <button onClick={() => generatePrompt(item)} className = {hoveredPrompt === item? "w-[30px] h-[30px] my-auto text-[18px] opacity-1 transition-[1000ms] ease-in-out" : "w-[30px] h-[30px] my-auto text-[18px] opacity-0 transition-[1000ms] ease-in-out"} >
                                    <IoSend/>
                                </button>
                            </Tooltip>
                        </div>
                </Popover>
                :
                <div key={index} className= {`flex flex-row rounded-lg py-2 px-2 text-[14px] border-[1.5px] leading-snug h-[80px] ${demoSteps[1] ? `opacity-[30%]` : ``}`}>                      
                    <div className = "w-[200px] mx-[10px] my-auto">{item}</div>
                </div>
            )
            ))}
        </div>
    );
}

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
      console.log(conversationArr);
      setIsNew(false);
    }
    setTimeout(() => {
        setDemoSteps([false, false, false, true])
    }, 1000);
  };

  useEffect(() => {
    scrollToBottom();
  }, [renderedConversation]);

  return (
    <div className="w-full h-[100vh]">
      <div className="w-full h-[100vh] absolute flex flex-col justify-between z-0">
        <div className="drop_shadow w-full flex items-center">
            <Popover
                placement="right"
                content={<div className="w-[400px]">"Good job, you've completed the demo. Thanks for trying out UniGPT! Click here to go back to the start page."</div>}
                visible={demoSteps[3]}
            >
            <button className="m-2" onClick={() => navigate("/")}>
                <IoIosArrowDropleftCircle className={`fill-black text-[30px] ${demoSteps[3] ? `animate-pulse` : ``}`} />
            </button>
          </Popover>
          <h6 className="text-2xl font-bold text-black text-center flex-grow">
            UniGPT
          </h6>
        </div>
        <Modal
            visible={demoSteps[0]}
            closable={false}
            footer={[
                <Button className = "bg-black text-white border-white animate-pulse border-none hover:text-white focus:text-white " style={{ color: "white"}} onClick={handleStartDemo}>
                  Start Demo
                </Button>
            ]}
        >
            <p>Welcome to UniGPT – Your virtual assistant designed to answer all your questions about the University of Waterloo! Want to try it out? Engage with the demo and let UniGPT guide you through the process!</p>
        </Modal>
        {showPrompts? <Prompts /> :
        <div className="overflow-scroll flex item-start flex-col h-full">
          {renderedConversation}
          <div ref={bottomEl}></div>
        </div>}
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
                <Popover
                    content={"Great! Now click this button to send it to the chatbot"}
                    visible={demoSteps[2]}>
                    <RiArrowUpCircleFill className={`text-[35px] mx-auto ${demoSteps[2] ? `animate-pulse`:``}`}/>
                </Popover>
              )}
            </button>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
