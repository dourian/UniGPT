import { createContext, useState } from 'react';
import axios from 'axios';

export const BackendContext = createContext();

export const BackendProvider = ({ children }) => {

    const [answer, setAnswer] = useState("")

    const getAnswer = (question) => {
        axios.get('http://localhost:3000/hello')
          .then(response => {
            setAnswer(response.data);
            console.log("here: ", response.data )
          })
          .catch(error => {
            console.error('Error fetching data:', error);
          });
      }
    

  return (
    <BackendContext.Provider
      value={{
        getAnswer,
        setAnswer,
        answer
      }}
    >
      {children}
    </BackendContext.Provider>
  )
}

