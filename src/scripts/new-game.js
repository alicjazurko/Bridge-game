const cards = ["2C.svg", "2D.svg", "2H.svg", "2S.svg", "3C.svg", "3D.svg", "3H.svg", "3S.svg", "4C.svg", "4D.svg", "4H.svg", "4S.svg", "5C.svg", "5D.svg", "5H.svg", "5S.svg", "6C.svg", "6D.svg", "6H.svg", "6S.svg", "7C.svg", "7D.svg", "7H.svg", "7S.svg", "8C.svg", "8D.svg", "8H.svg", "8S.svg", "9C.svg", "9D.svg", "9H.svg", "9S.svg", "10C.svg", "10D.svg", "10H.svg", "10S.svg", "JC.svg", "JD.svg", "JH.svg", "JS.svg", "QC.svg", "QD.svg", "QH.svg", "QS.svg", "KC.svg", "KD.svg", "KH.svg", "KS.svg", "AC.svg", "AD.svg", "AH.svg", "AS.svg"]
const emptyCard = "rewers.svg";
const sectionCards = document.querySelector(".cards");

const btnNewGameN = document.querySelector(".new-game .n");
const btnNewGameS = document.querySelector(".new-game .s");
const btnNewTurn = document.querySelector(".btnNewTurn");

let cardsArr = [...cards]; //tablica modyfikowalna, usuwnaie elementów przy rozdawaniu kart

//karty rozdane na 4 graczy
let gamer1;
let gamer2;
let gamer3;
let gamer4;

export let cardsGamerN;
export let cardsGamerS;

export let flag_newGame_N = false; //czy został kliknięcty przycisk nowe rozdanie

//losowanie 13 kart z tablicy cardsArr
function giveCardsForAll() {
    let gamer = [];
    const indexArr = [];
    for(let i = 0; i < 13; i++){
        const index = Math.ceil(Math.random()*cardsArr.length-1);
        let cardValue = cardsArr[index];
        cardsArr.splice(index, 1);
        indexArr.push(index);
        gamer.push(cardValue);
        
    }
    return gamer;   
}

//rozdanie kart każdemy z 4 graczy
function giveCardsForGamers() {
    gamer1 = giveCardsForAll();
    gamer2 = giveCardsForAll();
    gamer3 = giveCardsForAll();
    gamer4 = giveCardsForAll();
}


//pokazanie kart na ekranie dla gracza 1
function myCards(gamer) {
    const myCards = gamer;

    for(let i = 0; i<= 12; i++) {
        let card = document.createElement("img");
        card.src = "images/" + myCards[i];
        sectionCards.appendChild(card);
    }

}

//puste karty pokazują się na poczatku po odświezeniu strony
function emptyCards() {
    for(let i = 0; i <= 12; i++) {
        let card = document.createElement("img");
        card.src = "images/" + emptyCard;
        sectionCards.appendChild(card);
    }
}

emptyCards();

//stworzenie tablicy z kartami którą wykorzystamy do csv
function createCardsTableCSV(gamer) {
    let cards = "";
    let gamerCSV;
    for(let i = 0; i < gamer.length; i++) {
        gamerCSV = gamer[i].slice(0,-4)
        cards += gamerCSV + ";";
    }
    return cards
}

//nowa gra, rozdanie kart
function newGame() {
    giveCardsForGamers(); 
    myCards(gamer1);
    cardsArr = [].concat(cards);

    //tworzenie tablic do csv
    cardsGamerN = createCardsTableCSV(gamer1);
    cardsGamerS = createCardsTableCSV(gamer2);
}


//początek gry po kliknięciu w przycisk z wyborek kto zaczyna
btnNewGameN.addEventListener("click", function() {
    for(let i = 0; i < 13; i++ ){
        sectionCards.removeChild(document.querySelector(".cards img"));
    }
    
    flag_newGame_N = true; //można rozpocząć licytację, jak są wyświetlone karty

    newGame();
})

btnNewGameS.addEventListener("click", function() {
    for(let i = 0; i < 13; i++ ){
        sectionCards.removeChild(document.querySelector(".cards img"));
    }
    
    flag_newGame_N = true; //można rozpocząć licytację, jak są wyświetlone karty

    newGame();
})

btnNewTurn.addEventListener("click", function() {
    for(let i = 0; i < 13; i++ ){
        sectionCards.removeChild(document.querySelector(".cards img"));
    }
    
    flag_newGame_N = false; //można rozpocząć licytację, jak są wyświetlone karty

    emptyCards();
})




