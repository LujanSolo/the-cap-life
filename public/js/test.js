// ************************ Reference variables ************************//
const container = $("#container");
const characterTurnCardEl = $(".character-turn-card");

const startGameCardEl = $(".start-game-card");
const lifeEventsCardEl = $(".life-events-card");
const acquiredGoodCardEl = $(".acquired-good-card");
const pickedLifeEventCardEl = $(".picked-life-events-card");
const pickedGoodsCardEl = $(".picked-acquired-good-card");
const gameOverCardEl = $(".game-over-card");

const rollbtnEl = $("#roll-btn");
const rollResultEl = $("#die-result");

const lifeEventsCardbtn = $(".life-event-btn");
const acquiredGoodCardbtn = $(".acquired-good-btn");
const pickedLifeEventCardbtn = $(".picked-life-btn");
const pickedGoodsCardbtn = $(".picked-good-btn");
const playAgainbtn = $(".play-again-btn");
const workaholicStartbtn = $(".workaholic-start-game-btn"); //start btn
const freeSpiritStartbtn = $(".free-spirit-start-game-btn"); //start btn
const workLifeStartbtn = $(".work-life-start-game-btn"); //start btn

// this creates an array of all the tile divs
const tileArray = $(".col-4");

// this sorts the tile divs by id
tileArray.sort((a, b) => parseInt(a.id) - parseInt(b.id));

// ************************ Global variables ************************//
let currentPosition = 0;
let userIcon = "";
let userMoney = 0;
let userDopaLevel = 0;

let lifeEventsBucket = [];
let goodsBucket = [];

// ************************ Functions ************************//

// function to start game
function startGame(event) {
  // call function to get goods array and life events array
  getLifeEventsArray();
  getGoodsArray();

  // get response from user, add the character selected traits to local storage and to variable
  switch (event.currentTarget.id) {
    case "workaholic":
      userIcon = "fa-horse";
      userMoney = 5000;
      userDopaLevel = 30;
      break;
    case "free-spirit":
      userIcon = "fa-otter";
      userMoney = 1000;
      userDopaLevel = 80;
      break;
    case "work-life":
      userIcon = "fa-dragon";
      userMoney = 2500;
      userDopaLevel = 50;
      break;
  }

  // hide startGame menu
  startGameCardEl.hide();

  // show character turn el
  characterTurnCardEl.show();

  // set dragon to starting position (this will get moved to the start game function later)
  $(tileArray[0]).addClass(`fa-solid ${userIcon}`);
}

function startTurn() {
  // variable with rollDie number
  const dieRole = rollDie();
  // update rollResultEl text
  rollResultEl.text(dieRole);

  // get player position -- loop through divs and see if class exists
  for (let i = 0; i < tileArray.length; i++) {
    if (
      tileArray[i].classList[tileArray[i].classList.length - 1] === userIcon
    ) {
      const startPosition = tileArray[i].id;
      // console.log(currentPosition)

      // remove class in that div
      $(tileArray[startPosition - 1]).removeClass(`fa-solid ${userIcon}`);
      // transitions opacity -- 0 - 100% in a second or so

      // get new position on board
      currentPosition = parseInt(startPosition) + parseInt(dieRole);
      console.log(currentPosition);
      if (currentPosition >= tileArray.length) {
        currentPosition = tileArray.length;
      }
    }
  }

  // update position
  $(tileArray[currentPosition - 1]).addClass(`fa-solid ${userIcon}`);
  // todo transitions opacity -- 0 - 100% in a second or so

  // call show card functions
  showAcquirableGoodsCard();
  showLifeEvents();
  characterTurnCardEl.hide();
}

// function to show acquirable goods card
function showAcquirableGoodsCard() {
  // set this card to display block
  acquiredGoodCardEl.show();

  // edits the info on this card 
  $("#product-name").text(`${goodsBucket[currentPosition].product_name}`);
  $("#product-money-stats").text(
    `Costs: ${goodsBucket[currentPosition].money_change}`
  );
  $("#product-mood-stats").text(
    `Mood Change: ${goodsBucket[currentPosition].dopa_change}`
  );
}

// function to show life events card
function showLifeEvents() {
  //set this card to display block
  lifeEventsCardEl.show();
}

// todo function to show acquirable goods card
function showPickedAcquirableGoodsCard() {
  // set lifeevents and goods cards to display none
  acquiredGoodCardEl.hide();
  lifeEventsCardEl.hide();

  // set this card to display block
  pickedGoodsCardEl.show();

  // todo edit the info on this card
}

// todo function to show life events card
function showPickedLifeEvents() {
  // set lifeevents and goods cards to display none
  acquiredGoodCardEl.hide();
  lifeEventsCardEl.hide();

  //set this card to display block
  pickedLifeEventCardEl.show();

  // todo edit the info on this card
}

//  function to check if game is over
function checkGameOver() {
  // if current position is >= last game tile then game over
  if (currentPosition >= tileArray.length) {
    pickedGoodsCardEl.hide();
    pickedLifeEventCardEl.hide();

    endGame();
  } else {
    characterTurnCardEl.show();
  }
}

// todo function to end game
function endGame() {
  // check win or lose
  // print game over and stats
  gameOverCardEl.show();
  // set values from local storage to user Database
}

// todo function for play again
function playAgain() {
  // todo clear local storage

  // clear buckets and values
  currentPosition = 0;
  userMoney = 0;
  userDopaLevel = 0;
  lifeEventsBucket = [];
  goodsBucket = [];

  // hide gameOver card and remove class on last tile
  gameOverCardEl.hide();
  $(tileArray[tileArray.length - 1]).removeClass(`fa-solid ${userIcon}`);
  // refresh play game page
  startGameCardEl.show();
}

// functions to get random life events and gooods and put them in an array at beginning of game
const getLifeEventsArray = async () => {
  const response = await fetch("/api/lifeEventRoutes", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (response.ok) {
    const data = await response.json();
    // shuffle the data array
    data.sort(function (a, b) {
      return 0.5 - Math.random();
    });
    // push into lifeEventBucket
    for (let i = 0; i < tileArray.length; i++) {
      lifeEventsBucket.push(data[i]);
    }
  } else {
    alert(response.statusText);
  }
  console.log(lifeEventsBucket);
};

const getGoodsArray = async () => {
  const response = await fetch("/api/acquiredGoodsRoutes", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (response.ok) {
    const data = await response.json();
    // shuffle the data array
    data.sort(function (a, b) {
      return 0.5 - Math.random();
    });
    // push into goodsBucket
    for (let i = 0; i < tileArray.length; i++) {
      goodsBucket.push(data[i]);
    }
  } else {
    alert(response.statusText);
  }
  console.log(goodsBucket);
};

// todo function for local storage
function getLocalStorage() {
  // get the items
}

function setLocalStorage() {
  // set the items
}

// ************************ Helper Functions ************************//
function rollDie() {
  return 1 + Math.floor(Math.random() * 4);
}

// ************************ Initiating functions ************************//
rollbtnEl.on("click", startTurn);

lifeEventsCardbtn.on("click", showPickedLifeEvents);

acquiredGoodCardbtn.on("click", showPickedAcquirableGoodsCard);

pickedLifeEventCardbtn.on("click", function () {
  pickedLifeEventCardEl.hide();
  checkGameOver();
});

pickedGoodsCardbtn.on("click", function () {
  pickedGoodsCardEl.hide();
  checkGameOver();
});

workaholicStartbtn.on("click", startGame);
freeSpiritStartbtn.on("click", startGame);
workLifeStartbtn.on("click", startGame);

playAgainbtn.on("click", playAgain);
