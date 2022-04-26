const colors = {
  'easy': 'bg-green-500',
  'medium': 'bg-yellow-400',
  'hard': 'bg-red-500',
  'bg': 'bg-gray-300',
  'textLight': 'text-gray-500',
  'textDark': 'text-slate-900',
  'goodGuess' : 'bg-green-300',
  'badGuess' : 'bg-red-300',
}

// GLOBAL VARIABLES
let list = [];
let difficulty = document.getElementById("easy").id;

let gameIsRunnig = false;

const secretField = document.getElementById("country");
const guessField = document.getElementById("capital");
const startButton = document.getElementById('start');
const resetButton = document.getElementById('reset');
const led = document.getElementById("background");

startButton.addEventListener('click',() => {
  if (!gameIsRunnig && startButton.classList.contains('cursor-pointer')) {
    start();
    
    startButton.classList.remove('cursor-pointer')
    startButton.classList.add('cursor-not-allowed')
  }
});

resetButton.addEventListener('click', () => {
  guessField.value = "";
  if (gameIsRunnig) {
    gameIsRunnig = false;
    alert("GAME SHOULD BE RUNNING");
    // window.location.reload();
  }
});


// fetching data everytime the page is refreshed
fetch("https://restcountries.com/v2/all")
.then((res) => res.json())
.then((data) => initData(data))
.catch((err) => alert(err));
setTimeout(() =>{}, 900);


// extract and savedata from API
function initData(d) { list = d; }

// buttons('EASY' || 'MEDIUM' || 'HARD'); default is 'EASY'
function selectDiff() {
  const currentType = event.target;
  difficulty = currentType.id;
  
  let types = document.getElementById('modes').children;
  for (let i = 0; i < types.length; i++) {
    if (types[i] == currentType) {
      if (types[i].classList.contains( colors.bg )) {
        types[i].classList.remove( colors.bg )
        types[i].classList.remove( colors.textLight )
      }
      types[i].classList.add( colors[types[i].id] );
      types[i].classList.add( colors.textDark );
      console.log(types[i].classList);
    }
    else {
      if (!types[i].classList.contains( colors.bg )) {
        types[i].classList.remove( colors[types[i].id] )
        types[i].classList.remove( colors.textDark )

        types[i].classList.add( colors.bg )
        types[i].classList.add( colors.textLight )
      }
    }
  }  
}

// create new list according to the difficulty selected
function generateList() {
  let l = [];
  
  switch (difficulty) {
    case "easy":
      list.forEach((e) => {
        if (!l.includes(e)) {
          if ( (e.subregion === "Northern America" && e.population >= 5000000) || (e.region === "Europe" && e.population >= 5000000) || (e.population >= 100000000)) {
              l.push(e);
          }
        }
      });
    break;

    // needs refinement
    case "medium":
      list.forEach((e) => {
        if (!list.includes(e) || (e.population <= 400000000 && e.population >= 1000000) || e.region === "America" || e.subregion === "Southern Asia") {
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
function start() {
  console.log("NEW GAME STARTED\tMODE: " + difficulty);
  gameIsRunnig = true;
  let point = 0;
  let used = [];
  
  let listAsDiff = generateList();
  console.log("Number of Counties: " + listAsDiff.length);
  game(listAsDiff, used, 0);
}

// actual game
async function game(listAsDiff, used, points) {
  if (used.length === listAsDiff.length) {
    console.log("Progres: " + points + " / " + used.length);
    console.error("NO COUNTRIES LEFT");
    gameIsRunnig = false;
    return;
  }
  let rand = Math.floor(Math.random() * listAsDiff.length);
  
  while (used.includes(listAsDiff[rand])) {
    rand = Math.floor(Math.random() * listAsDiff.length);
  }
  country = listAsDiff[rand];
  used.push(country);
  secretField.innerText = country.name;

  let guess = await getGuess();

  //coloring
  if (evalGuess(guess, country)) {
    console.log("===> GOOD GUESS");
    points++;
    led.style.backgroundColor = '#4ADE80'
  } else {
    console.log("===> BAD GUESS");
    led.style.backgroundColor = '#EF4444'
  }

  // synch timing of led and new secretCountry/capital field
  setTimeout(() => {
    led.style.backgroundColor = "transparent";
    guessField.value = "";
    console.log("Progres: " + points + " / " + used.length);

    if (gameIsRunnig === true) {
      game(listAsDiff, used, points);
    }
    else {
      return;
    }
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
  if (guess === randomCountry.capital) {
    return true;
  } else {
    return false;
  }
}
