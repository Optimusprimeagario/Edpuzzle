// ==UserScript==
// @name         Edpuzzle Helper
// @version      1
// @description  Gets answers for multiple choices!
// @author       Prime
// @match        https://edpuzzle.com/assignments/*
// @grant        none
// ==/UserScript==

let tries = 0;
let isSuccess = false;


function getAssignment() {
  console.log(`[✔️] got the assignment id`)
  return new URL(document.URL).pathname.split("/")[2];
}


function sendRequest() {
  if (tries == 3) {
    console.log(`[Edpuzzle] something went wrong..`);
    return;
  }
  const edpuzzle = new XMLHttpRequest();
  edpuzzle.open('GET', `https://edpuzzle.com/api/v3/assignments/${getAssignment()}`, true);

  edpuzzle.onerror = data => {
    isSuccess = false;
    tries++;
    console.log(`[❌] retrying..`);
    sendRequest();
  }

  edpuzzle.onload = data => {
    parseData(edpuzzle.response);
  }

  edpuzzle.send();
}

function parseData(unParsed) {
  let data = JSON.parse(unParsed);
  console.log(`[✔️] Got the answers! 😉`);
  data.medias[0].questions.forEach(questions => {
    if (questions.type.includes("multiple")) {
      questions.choices.forEach(choice => {
        if(choice.isCorrect) {
          console.log(`Q: ${questions.body[0].text}
A: ${choice.body[0].html}
          `)
        }
      });
    }
  });
}


setTimeout(() => {
  sendRequest();
}, 1000);
