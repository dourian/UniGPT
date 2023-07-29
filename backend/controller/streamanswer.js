

export function streamAnswerGPT(res, token) {
    res.write("hi", 'utf8', () => {
        console.log("Writing string Data...");
    });
    setTimeout(function () {
        streamAnswerGPT(res, token);
    }, 1000)
}

