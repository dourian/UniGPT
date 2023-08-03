/**
 * Streams the answer to the endpoint
 * 
 * @param {*} res The response object of express route
 * @param {*} token LLM token to be written to data
 */

// TODO: fix streaming, send headers before sending response
function streamAnswerGPT(res, token) {
    res.write(token, 'utf8', () => {
    });
    setTimeout(function () {
        streamAnswerGPT(res, token);
    }, 1000)
}

export default streamAnswerGPT
