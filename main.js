// GLOBAL VARIABLES
let list = [];
let used = [];
let difficulty = document.getElementById("easy").id;
let gameIsRunnig = false;
const secretField = document.getElementById("country");
const guessField = document.getElementById("capital");
const led = document.getElementById("led");

// fetching data everytime the page is refreshed
// instead of everytime a new game begins
fetch("https://restcountries.com/v2/all")
.then((res) => res.json())
.then((data) => initData(data))
.catch((err) => alert(err));
// extract and savedata from API
function initData(d) { list = d; }

// buttons('EASY' || 'MEDIUM' || 'HARD'); default is 'EASY'
function selectDiff() {
  const currentType = event.target;
  difficulty = currentType.id;

  let types = document.getElementsByClassName("mode");
  let activeType = undefined;
  let allInactive = true;

  for (let i = 0; i < types.length; i++) {
    if (!types[i].classList.contains("hide-color")) {
      allInactive = false;
      activeType = types[i];
      break;
    }
  }

  if (activeType === currentType) {
    return activeType.id;
  }

  if (allInactive) {
    currentType.classList.add(currentType.id);
    currentType.classList.remove("hide-color");
  } else {
    activeType.classList.remove(activeType.id);
    activeType.classList.add("hide-color");

    currentType.classList.remove("hide-color");
    currentType.classList.add(currentType.id);
  }
}



// create new list according to the difficulty selected
function generateList() {
  let l = [];
  // easy    56 countries
  // medium  __ countries
  // hard    __ countries

  switch (difficulty) {
     case "easy":
      list.forEach((e) => {
        if (!l.includes(e)) {
          if (
            (e.subregion === "Northern America" && e.population >= 5000000) ||
            (e.region === "Europe" && e.population >= 5000000) ||
            (e.population >= 100000000)
          ) {
            l.push(e);
          }
        }
      });
      break;

    // needs refinement
    case "medium":
      list.forEach((e) => {
        if (
          !list.includes(e) ||
          (e.population <= 400000000 && e.population >= 1000000) ||
          e.region === "America" ||
          e.subregion === "Southern Asia"
        ) {
          l.push(e);
        }
      });
      break;

    // needs refinement
    case "hard":
      list.forEach((e) => {
        if (e.population < 15000000 && e.population > 1000000 || e.region==="America") {
          l.push(e);
        }
      });
      break;

    default:
      break;
  }

  return l;
}

// initiate new game (by pressing 'START')
function startGame() {
  if (difficulty === undefined) {
    alert("Select a difficulty!");
    return;
  }
  // this makes it so that you cannot start
  // X amount of games, since that seemingly
  // creates unexpected behavior
  let startButton = document.getElementsByClassName('start-btn')
  startButton[0].onclick = null
  startButton[0].style.cursor = 'not-allowed'

  console.log("NEW GAME STARTED\tMODE: " + difficulty);

  setTimeout(() => {
    let listAsDiff = generateList();
    console.log("Number of Counties: " + listAsDiff.length);
    game(listAsDiff, used);
  }, 1000);
}

// actual game
async function game(listAsDiff) {
  if (used.length === listAsDiff.length) {
    used = [];
    console.error("RAN OUT OF COUNTRIES");
    return;
  }

  let rand = Math.floor(Math.random() * listAsDiff.length);

  while (used.includes(listAsDiff[rand])) {
    rand = Math.floor(Math.random() * listAsDiff.length);
  }
  used.push(listAsDiff[rand]);
  secretField.innerText = listAsDiff[rand].name;

  let guess = await getGuess();

  //coloring
  if (evalGuess(guess, listAsDiff[rand])) {
    led.style.backgroundColor = "#2DC943";
    console.log("==> GOOD GUESS");
  } else {
    led.style.backgroundColor = "#FE5F57";
    console.log("==> BAD GUESS");
  }

  // synch timing of led and new secretCountry/capital field
  setTimeout(() => {
    led.style.backgroundColor = "transparent";
    guessField.value = "";
    console.log(used.length);
    game(listAsDiff, used);
  }, 900);
}

function getGuess() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      guessField.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          resolve(guessField.value);
        }
      });
    }, 300);
  });
}

function evalGuess(guess, randomCountry) {
  console.log("GUESS:  " + guessField.value);
  console.log("ANSWER: " + randomCountry.capital + "\n");

  if (guess === randomCountry.capital) {
    return true;
  } else {
    return false;
  }
}
