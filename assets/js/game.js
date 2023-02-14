// Variables  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
let words = ["HTML", "CSS", "AUTO", "TRES", "CORRECTO", "PUEDE", "TENDRA"];
let secretWord = ""; // 1
let emptyListCharacters = []; // 2
let replaceCount = 0; // 2
let currentArmedWord = ""; // 3
let incorrectLetters = ""; // 4
let incorrectLettersCount = 0; // 5

// Elements HTML %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
const $canvas = document.getElementById("canvas");

// Custom properties elements HTML %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
$canvas.height = $canvas.width * 1.33;
let ctxCanvas = $canvas.getContext("2d");
let x = Math.round($canvas.width / 2);
let y = Math.round($canvas.height / 5);

// Handlers Events %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
document.addEventListener("DOMContentLoaded", (e) => addNewSecretWords());

document.addEventListener("click", (e) => { // 1
  if (e.target.matches(".btn--primary")) {
    resetGlobalsVariables();
    secretWord = chooseSecretWord();
    cleanRectangularSectionCanvas(ctxCanvas, 0, 0, $canvas.width, $canvas.height);
    drawLines(secretWord);
    document.addEventListener("keydown", handlerKeyDown);
  }
});

// Functions  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

// get and add new words
const addNewSecretWords = () => {
  if (JSON.parse(sessionStorage.getItem("listWordsAdd")) !== null) {
    const addednewWords = JSON.parse(sessionStorage.getItem("listWordsAdd"));
    words = words.concat(addednewWords);
  }
};

// randomly select secret word
const chooseSecretWord = () => {
  let randomIndexWord = Math.floor(Math.random() * words.length);
  return words[randomIndexWord];
};

// clean rectangular section of canvas
const cleanRectangularSectionCanvas = (context, xi, yi, xf, yf) => {
  context.clearRect(xi, yi, xf, yf);
};
 
// drawing lines of characters of the secret word to be guessed
const drawLines = (word) => {
  const widthLetter = 25;
  const widthSpace = 10; 
  let widthWord = widthLetter * word.length + widthSpace * (word.length - 1);
  let centerWordInX = x - Math.round(widthWord) / 2;
  ctxCanvas.beginPath();
  ctxCanvas.lineWidth = 3;
  ctxCanvas.strokeStyle = "black";
  ctxCanvas.lineCap = "round";
  ctxCanvas.lineJoin = "round";
  ctxCanvas.setLineDash([25, 10]);
  ctxCanvas.moveTo(centerWordInX, y + 10);
  ctxCanvas.lineTo(centerWordInX + widthWord, y + 10);
  ctxCanvas.stroke();
  ctxCanvas.closePath();
};

// check if the letter pressed is a letter
const pressALetter = (letter) => {
  const lowercase_letters = "abcdefghijklmnñopqrstuvwxyz";
  const uppercase_letters = lowercase_letters.toUpperCase();
  // console.log(letters.includes(letter));
  return uppercase_letters.includes(letter);
};

// get list with the position of the matches according to the letter pressed
const getPositionsMatches = (letter, word) => {
  let matches = [];
  for (let i = 0; i < word.length; i++) {
    if (word[i] === letter) {
      matches.push(i);
    }
  }
  return matches;
};

// fill in the matching positions of the pressed letter
const replaceMatchingLetters = (letter, word) => { // 2
  let matches = getPositionsMatches(letter, word);
  matches.forEach((position) => {
    emptyListCharacters[position] = letter;
  });
};

// complete word whit correct letters
const completeWord = (letter, word) => {
  if (replaceCount === 0) {
    const emptyWord = word.replaceAll(/[A-Z]/g, " ");
    emptyListCharacters = emptyWord.split("");
    replaceMatchingLetters(letter, word);
  } else {
    replaceMatchingLetters(letter, word);
  }
  replaceCount++;
  return emptyListCharacters.join("");
};

// get value of CSS variable
const getVariableCSS = (variableName) => {
  return getComputedStyle(document.documentElement).getPropertyValue(variableName);
};

// draw letter belonging to the secret word
const drawCorrectLetter = (context, letter, word) => { //3
  let textColor = getVariableCSS("--second-color");
  cleanRectangularSectionCanvas(context, 0, 0, $canvas.width, y);
  currentArmedWord = completeWord(letter, word);
  context.textAlign = "center";
  context.font = "34px monospace";
  context.fillStyle = `${textColor}`;
  context.fillText(currentArmedWord.split("").join(" "), x, y, 270);
};

// reset globals variables
const resetGlobalsVariables = () => {
  incorrectLettersCount = 0;
  currentArmedWord = "";
  incorrectLetters = "";
  emptyListCharacters = []
  replaceCount = 0;
};

// display message of the result obtained in the game
const showMessageResult = (context, message, color) => {
  context.textAlign = "center";
  context.font = "22px Verdana";
  context.fillStyle = color;
  context.fillText(message, 150, 200);
  document.removeEventListener("keydown", handlerKeyDown)
  resetGlobalsVariables();
};

// draw letter not belonging to the secret word
const drawIncorrectLetter = (context, letter) => { // 4
  let textColor = getVariableCSS("--fourth-color");
  context.clearRect(0, y + 15, $canvas.width, y + 50);
  if (!incorrectLetters.includes(letter)) {
    incorrectLetters += ` ${letter}`;
  }
  context.textAlign = "center";
  context.font = "20px Verdana";
  context.fillStyle = `${textColor}`;
  context.fillText(incorrectLetters, x, y + 40, 200);
};

// draw part of the gallows
const drawGallows = (failsCount) => {
  let gallowsCenter = y + 280
  ctxCanvas.beginPath();
  ctxCanvas.lineWidth = 2;
  ctxCanvas.strokeStyle = "green";
  ctxCanvas.setLineDash([]);
  switch(failsCount) {
    case 1:
      ctxCanvas.moveTo(50, gallowsCenter);
      ctxCanvas.lineTo(140, gallowsCenter);
      ctxCanvas.moveTo(95, gallowsCenter);
      ctxCanvas.lineTo(95, gallowsCenter - 100);
      ctxCanvas.moveTo(95, gallowsCenter - 100);
      ctxCanvas.lineTo(170, gallowsCenter - 100);
      ctxCanvas.moveTo(170, gallowsCenter - 100);
      ctxCanvas.lineTo(170, gallowsCenter - 80);
      break;
    case 2:
      ctxCanvas.moveTo(180, gallowsCenter - 70);
      ctxCanvas.arc(170, gallowsCenter - 70, 10, 0, Math.PI * 2);
      break;
    case 3:
      ctxCanvas.moveTo(170, gallowsCenter - 60);
      ctxCanvas.lineTo(170, gallowsCenter - 30);
      break;
    case 4:
      ctxCanvas.moveTo(170, gallowsCenter - 60);
      ctxCanvas.lineTo(160, gallowsCenter - 45);
      break;
    case 5:
      ctxCanvas.moveTo(170, gallowsCenter - 60);
      ctxCanvas.lineTo(180, gallowsCenter - 45);
      break;
    case 6:
      ctxCanvas.moveTo(170, gallowsCenter - 30);
      ctxCanvas.lineTo(160, gallowsCenter - 15);
      break;
    case 7:
      ctxCanvas.moveTo(170, gallowsCenter - 30);
      ctxCanvas.lineTo(180, gallowsCenter - 15);
      break;
  }
  ctxCanvas.stroke();
  ctxCanvas.closePath();
};

// check if I win the game
const checkWinGame = (context, word, currentArmedWord) => {
  if (currentArmedWord === word) {
    showMessageResult(context, "Felicidades Ganaste");
  }
};

// 
const checkEndGame = (context, failsCount) => {
  if (failsCount >= 7) {
    showMessageResult(context, "Fin del juego", "red");
  }
};

// determine the action to be taken if the letter belongs to the secret word
const letterIncludedInWord = (letter, word) => { //5
  if (word.includes(letter)) {
    drawCorrectLetter(ctxCanvas, letter, word);
    checkWinGame(ctxCanvas, word, currentArmedWord);
  } else {
    incorrectLettersCount++;
    drawIncorrectLetter(ctxCanvas, letter);
    drawGallows(incorrectLettersCount);
    checkEndGame(ctxCanvas, incorrectLettersCount);
  }
};

// handler function of event keydown
function handlerKeyDown(e) {
  const pressedKey = e.key.toUpperCase();
  if (incorrectLettersCount < 7) {
    if(pressALetter(pressedKey)) {
      letterIncludedInWord(pressedKey, secretWord);
    }
  }
}