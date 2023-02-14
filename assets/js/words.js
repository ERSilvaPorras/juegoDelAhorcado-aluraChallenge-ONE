// Elements HTML  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
const $newWordTextarea = document.getElementById("container__textarea");

// Custom properties elements HTML %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
$newWordTextarea.focus();

// Handlers Events  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
document.addEventListener("keyup", (e) => {
  if (e.code === "Enter") {
    setNewWordToListNewWordSession();
  }
});

document.addEventListener("click", (e) => {
  if (e.target.matches(".btn--primary")) {
    setNewWordToListNewWordSession();
  }
});

// Functions  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

// validate that the word does not exceed 8 characters and is not duplicated within the reserved words
const validateNewSecretWord = (newSecretWord, secretsWords) => {
  return (
    newSecretWord !== "" &&
    newSecretWord !== null &&
    newSecretWord.length <= 8 &&
    !secretsWords.includes(newSecretWord)
  );
};

// check and add word to list of new secret words
const setNewWordToListNewWordSession = () => {
  sessionStorage.setItem("addNewWord", $newWordTextarea.value.toUpperCase());
  if (sessionStorage.getItem("listWordsAdd") === null) {
    sessionStorage.setItem("listWordsAdd", JSON.stringify([]));
  }
  const addNewWord = sessionStorage.getItem("addNewWord");
  const listWordsAdd = JSON.parse(sessionStorage.getItem("listWordsAdd"));
  if (validateNewSecretWord(addNewWord, listWordsAdd)) {
    listWordsAdd.push(addNewWord);
    sessionStorage.setItem("listWordsAdd", JSON.stringify(listWordsAdd));
  }
};
