const express = require('express');
const app = express();

import('./main.js').then(({ generateAnswer }) => {

  app.get('/', async (req, res) => {
    const question = "Tell me about foundations of sequential programs? Include the prerequisites, corequisites, and antirequisites, and the course ID."
    const answer = await generateAnswer(question);
    console.log("here: ", answer)
    res.send(answer);
  });

  const port = 3000;
  app.listen(port, () => {
    console.log(`server running on port ${port}`);
  });
  
}).catch((error) => {
  console.error('error:', error);
});
