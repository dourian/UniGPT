import { createContext, useState, useMemo } from "react";
import axios from "axios";

export const BackendContext = createContext();

export const BackendProvider = ({ children }) => {
  const [disabledAsk, setDisabledAsk] = useState("");
  const [answer, setAnswer] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [validApiKey, setValidApiKey] = useState("")
  const [prompts, setPrompts] = useState(["What are Waterloo’s admission averages?", "What undergraduate programs are offered at Waterloo?", "Tell me about Waterloo's residence options", "What are the degree requirements for Computer Science?", "List all the ENGL classes offered at Waterloo.", "How many engineering programs are at Waterloo?"])

  const getPrompts = (prompts) => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "https://unigpt-c074044c0e9d.herokuapp.com/prompts",
      headers: {
        "Content-Type": "application/json",
      },
      params: {},
    };

    axios
      .request(config)
      .then((response) => {
        console.log("response: ", response.data)
        const ans = JSON.parse(JSON.stringify(response.data))
        console.log("answer: ", ans)
        return ans
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getAnswer = async (question) => {
    try {
      setIsLoading(true);
  
      console.log(isLoading);
  
      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: "https://unigpt-c074044c0e9d.herokuapp.com/ask",
        headers: {
          "Content-Type": "application/json",
        },
        params: {
          question: question,
          key: validApiKey,
        },
      };
  
      const response = await axios.request(config);
  
      const ans = JSON.stringify(response.data).substr(1).slice(0, -1);
      setIsLoading(false);
      setDisabledAsk("");
      console.log(ans);
      return ans;
    } catch (error) {
      console.log(error);
    }
  };

  const setApiKey = async (key) => {
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: 'http://localhost:8000/initkey',
      headers: { 
        'Content-Type': 'application/json'
      },
      params: {
        key: key,
      },
    };
    
    axios.request(config)
    .then((response) => {
      console.log(response.data.status)
      return response.data.status
    })
    .catch((error) => {
      console.log(error);
    });
  }
  

  const contextValue = useMemo(
    () => ({
      getAnswer,
      setAnswer,
      answer,
      isLoading,
      setIsLoading,
      disabledAsk,
      setDisabledAsk,
      getPrompts,
      prompts, 
      setPrompts,
      inputValue,
      setInputValue,
      validApiKey,
      setValidApiKey
    }),
    [answer, isLoading, disabledAsk, validApiKey, inputValue]
  );

  return (
    <BackendContext.Provider value={contextValue}>
      {children}
    </BackendContext.Provider>
  );
};
