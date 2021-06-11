import { flag_newGame } from './new-game.js';

const numbers = document.querySelector(".numbers div");
const symbols = document.querySelector(".symbols div");
const btnAuction = document.querySelector(".btnAuction");
const btnNewTurn = document.querySelector(".btnNewTurn");
const btnCsv = document.querySelector(".csv");

let number;
let symbol;

//flaga czy koniec tury
let endTurn = false;

//licytacje moje i dziadka
let auction;
let grandpaAuction;

//uzupełnianie tabelki z licytacjami
const tableHead = document.querySelector(".table-bordered thead");
const tableBody = document.querySelector(".table-bordered tbody");
let tableMyAuctions = [];
let tableGrandpaAuctions = [];

let eventNumber;
let eventSymbol;

//dodawanie danych z licytacji do obiektu, który potem konwertujemy na plik json
let dataToJson = {
    date: "",
    myTurn: [],
    grandpaTurn: []
}
//tutaj jeszcze nie działa usuwanie podświetlenia wybranych wcześniejszych kafelków
numbers.addEventListener("click", (e) => {
    eventNumber = e;
    number = eventNumber.target.textContent;
    if(eventSymbol != undefined ) {
        if(eventSymbol.target.id == "btncheckSnt" || eventSymbol.target.id == "btncheckSp") {
            number = ""; // jeżeli pierwszy zostanie wciśnięty symbol i bedzie no trump lub pass
        }
    }
    eventNumber.target.classList.toggle('active');
})

symbols.addEventListener("click", (e) => {
    eventSymbol = e;
    if(eventSymbol.target.id == "btncheckSs" || eventSymbol.target.id == "btncheckSh" || eventSymbol.target.id == "btncheckSd" || eventSymbol.target.id == "btncheckSc") {
        symbol = eventSymbol.target.textContent[0];
    } else if(eventSymbol.target.id == "btncheckSnt") {
        symbol = eventSymbol.target.textContent;
    } else if(eventSymbol.target.id == "btncheckSp") {
        number = "";
        symbol = eventSymbol.target.textContent; 
    }
    eventSymbol.target.classList.toggle("active");
})

//tablica możliwości dziadka do losowania
// function grandpaAuctionOptions() {
    
// }

const grandpaAuctionOptions = [
    [1, 2, 3, 4, 5, 6, 7], 
    ["♠", "♥", "♦", "♣", "No Trump", "Pass"]
]
const auctionOptions1 = ["1♣", "2♣", "3♣", "4♣", "5♣", "6♣", "7♣", "Pass", "1♦", "2♦", "3♦", "4♦", "5♦", "6♦", "7♦", "Pass", "1♥", "2♥", "3♥", "4♥", "5♥", "6♥", "7♥", "Pass", "1♠", "2♠", "3♠", "4♠", "5♠", "6♠", "7♠", "Pass", "1No Trump", "2No Trump", "3No Trump", "4No Trump", "5No Trump", "6No Trump", "7No Trump", "Pass"]

function grandpaTurn(myLastAuction) {
    console.log(myLastAuction)
    // let auctionOptions1 = []
    // auctionOptions1.push(auctionOptions)
    let grandpaAuctionOptions = []
    for(let i = 0; i < auctionOptions1.length; i++){
        if(myLastAuction == auctionOptions1[i]){
            grandpaAuctionOptions = auctionOptions1.slice(i+1, auctionOptions1.length)
            console.log(grandpaAuctionOptions)
            console.log(auctionOptions1)
        }
    }
    let grandpaAuctionIndex = Math.floor(Math.random() * grandpaAuctionOptions.length);
    grandpaAuction = grandpaAuctionOptions[grandpaAuctionIndex]
    grandpaAuctionOptions = []

    // let num = Math.floor(Math.random() * grandpaAuctionOptions[0].length);
    // let symb = Math.floor(Math.random() * grandpaAuctionOptions[1].length);
    // if(symb == 5) {
    //     grandpaAuction = grandpaAuctionOptions[1][symb];
    // } else {
    //     grandpaAuction = grandpaAuctionOptions[0][num] + grandpaAuctionOptions[1][symb];
    // }
}

function resetBtnColors() {
    if(eventNumber.target.classList.contains("active")) {
        eventNumber.target.classList.remove("active");
    }
    if(eventSymbol.target.classList.contains("active")) {
        eventSymbol.target.classList.remove("active");
    }
    number = "";
    symbol = "";
}

function gameDataToJson(date = dataToJson.date, auction, grandpaAuction) {
    dataToJson.date = date
    dataToJson.myTurn.push(auction);
    dataToJson.grandpaTurn.push(grandpaAuction);
}

function createTable() {
    if(tableHead.firstChild == null) {
        const titleElement = document.createElement('tr');
        const tableLineTitleMe = document.createElement("th");
        const tableLineTitleGrandpa = document.createElement("th");
        tableLineTitleMe.textContent = "Ja";
        tableLineTitleGrandpa.textContent = "Dziadek";
        titleElement.appendChild(tableLineTitleMe);
        titleElement.appendChild(tableLineTitleGrandpa);
        tableHead.appendChild(titleElement);
    }
  

    const tableLine = document.createElement("tr");
    const tableLineElement = document.createElement("td");
    const tableLineGrandpaElement = document.createElement("td");

    tableLine.appendChild(tableLineElement);
    tableLineElement.textContent = auction;
    
    tableBody.appendChild(tableLine);

    
    tableLine.appendChild(tableLineGrandpaElement);
    tableLineGrandpaElement.textContent = grandpaAuction; 
}

function auctionTable() {
    
    //walidacja czy licytacja jest poprawna
    let OKflag; //sprawdzenie czy wszystkie dane są poprawne - boolean
    
    if(symbol == "" || symbol == undefined || number == NaN || number == undefined || (number == "" && !(symbol == "No Trump" || symbol == "Pass"))) {
        alert("błąd licytacji, sprawdź czy wybór jest poprawny.")
        OKflag = false;

    } else {
        auction = number + symbol;
        OKflag = true;
        tableMyAuctions.push(auction);
        tableGrandpaAuctions.push(grandpaAuction);
    }
    let myLastAuction = tableMyAuctions[tableMyAuctions.length - 1];
    let grandpaLastAuction = tableGrandpaAuctions[tableGrandpaAuctions.length];
    grandpaTurn(myLastAuction);
    //tworzenie elementów tabeli licytacji, jeśli ruch jest poprawny
    if(flag_newGame == true && OKflag == true && endTurn == false) {
        if(myLastAuction == "Pass" || grandpaLastAuction == "Pass") {
            alert("Koniec tury")
            OKflag = false;
            endTurn = true;
        } else {
            createTable();

            symbol = "";
            number = "";
        }
    } else {
        alert("Musisz rozdać karty, kliknij przycisk nowe rozdanie w prawym górnym rogu.") //dorobić ładny alert
    }

    gameDataToJson(new Date(),auction, grandpaAuction); //do objektu json za kazdym kliknieciem w licytuj
    resetBtnColors();
}

//kliknięcie licytuj
btnAuction.addEventListener('click', function() {
    auctionTable()
})

btnNewTurn.addEventListener('click',function() {
    resetBtnColors();
    endTurn = false;
})




//PLIK CSV

function downloadCSV(csv, filename) {
    let csvFile = new Blob([csv], {type: "text/csv"});
    let downloadLink = document.createElement("a");

    downloadLink.download = filename;
    downloadLink.href = window.URL.createObjectURL(csvFile);
    downloadLink.style.display = "none";

    document.body.appendChild(downloadLink);

    downloadLink.click();

}

function exportTableToCsv(filename) {
    let csv = [];
    var rows = document.querySelectorAll("table tr");
    for(let i = 0; i < rows.length; i++) {
        var row = [];
        var cols = rows[i].querySelectorAll("td, th");
        for(let j = 0; j < cols.length; j++) {
            row.push(cols[j].innerText);

        csv.push(row.join(","));
        }
    }
        //download csv

        downloadCSV(csv.join("\n"), filename)

    
}

btnCsv.addEventListener('click', function() {
    // let jsonData = JSON.stringify(dataToJson);

    exportTableToCsv("rozgrywka" + dataToJson.date + ".csv")
    

})