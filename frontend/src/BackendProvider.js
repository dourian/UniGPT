import { createContext, useState, useMemo } from "react";
import axios from "axios";

export const BackendContext = createContext();

export const BackendProvider = ({ children }) => {
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(0)
  

  const getAnswer = (question) => {
    setIsLoading(1)
    console.log(isLoading)
  
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: 'https://unigpt-c074044c0e9d.herokuapp.com/ask',
      headers: { 
        'Content-Type': 'application/json'
      },
      params: {
        question: question
      }
    };
  
    axios.request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
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
      setIsLoading
    }),
    [answer]
  );

  return (
    <BackendContext.Provider value={contextValue}>
      {children}
    </BackendContext.Provider>
  );
};
