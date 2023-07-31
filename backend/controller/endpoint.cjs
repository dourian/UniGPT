const express = require('express');
const app = express();
// const streamAnswerGPT = require("./streamanswer.js")

// import('../main.js').then(({ generateAnswer }) => {

//   app.get('/', async (req, res) => {
//     const question = "Tell me about foundations of sequential programs? Include the prerequisites, corequisites, and antirequisites, and the course ID."
//     // await generateAnswer(question, res);
//     res.write("hi")
//     res.setHeader('Content-Type', 'text/html; charset=utf-8');
//     res.setHeader('Transfer-Encoding', 'chunked');
//     // import("./streamanswer.js").then(({streamAnswerGPT}) => {
//     //   streamAnswerGPT(res);
//     // }
//     // )
    
//     res.end();
//   });
app.get('/', async (req, res) => {
  const question = "Tell me about foundations of sequential programs? Include the prerequisites, corequisites, and antirequisites, and the course ID."
  // await generateAnswer(question, res);
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Transfer-Encoding', 'chunked');
  for (let i = 0; i < 10; i++) {
    res.write("hi")
  }
  
  // import("./streamanswer.js").then(({streamAnswerGPT}) => {
  //   streamAnswerGPT(res);
  // }
  // )
  
  res.end();
})

  const port = 3000;
  app.listen(port, () => {
    console.log(`server running on port ${port}`);
    // setTimeout(function () {
    //   res.end("Timed out")
    // }, 30000)
  });
  
// }).catch((error) => {
//   console.error('error:', error);
// });
