import { flag_newGame_N, cardsGamerN, cardsGamerS } from './new-game.js';

//pobranie elementów z DOM
const numbers = document.querySelector(".numbers div");
const symbols = document.querySelector(".symbols div");
const btnAuction = document.querySelector(".btnAuction");
const btnNewTurn = document.querySelector(".btnNewTurn");
const btnNewGameN = document.querySelector(".new-game .n");
const btnNewGameS = document.querySelector(".new-game .s");
const btnCsv = document.querySelector(".csv");

let number;
let symbol;

//flaga czy koniec tury
let endTurn = false;

//flagi kto zaczyna
let Nturn;
let Sturn;

//licytacje moje i dziadka
let auction;
let partnerAuction;

//uzupełnianie tabelki z licytacjami
const tableHead = document.querySelector(".table-bordered thead");
const tableBody = document.querySelector(".table-bordered tbody");
let tableMyAuctions = [];
let tablePartnerAuctions = [];

let eventNumber;
let eventSymbol;

// tablica z wierszami(turami) do csv, początkowo zainicjowane nagłówki
let csv = ["CN1;CN2;CN3;CN4;CN5;CN6;CN7;CN8;CN9;CN10;CN11;CN12;CN13;CS1;CS2;CS3;CS4;CS5;CS6;CS7;CS8;CS9;CS10;CS11;CS12;CS13;Dealer;B1;B2;B3;B4;B5;B6;B7;B8;B9;B10"];

//zmienna przechowująca string kto zaczyna
let dealer;

//wiersz do CSV z danymi z jednej tury
let CSVRow;

let tableAllTurnsPartner = []


//EVENTY wyboru
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

// tablica możliwości partnera do losowania
const partnerAuctionOptions = [
    [1, 2, 3, 4, 5, 6, 7], 
    ["♠", "♥", "♦", "♣", "No Trump", "Pass"]
]
const auctionOptions1 = ["", "1♣", "2♣", "3♣", "4♣", "5♣", "6♣", "7♣", "Pass", "1♦", "2♦", "3♦", "4♦", "5♦", "6♦", "7♦", "Pass", "1♥", "2♥", "3♥", "4♥", "5♥", "6♥", "7♥", "Pass", "1♠", "2♠", "3♠", "4♠", "5♠", "6♠", "7♠", "Pass", "1No Trump", "2No Trump", "3No Trump", "4No Trump", "5No Trump", "6No Trump", "7No Trump", "Pass"]
const auctionOptions2 = ["", "1♣", "2♣", "3♣", "4♣", "5♣", "6♣", "7♣", "1♦", "2♦", "3♦", "4♦", "5♦", "6♦", "7♦", "1♥", "2♥", "3♥", "4♥", "5♥", "6♥", "7♥", "1♠", "2♠", "3♠", "4♠", "5♠", "6♠", "7♠", "1No Trump", "2No Trump", "3No Trump", "4No Trump", "5No Trump", "6No Trump", "7No Trump"]

function partnerTurn(myLastAuction) {

    let partnerAuctionOptions = []
    for(let i = 0; i < auctionOptions1.length; i++){
        if(myLastAuction == auctionOptions1[i]){
            partnerAuctionOptions = auctionOptions1.slice(i+1, auctionOptions1.length)
        }
    }
    let partnerAuctionIndex = Math.floor(Math.random() * partnerAuctionOptions.length);
    let firstPartnerAuctionIndex = Math.floor(Math.random() * auctionOptions2.length);
    
    // S zaczyna - partner
    if (Sturn == true) {
        if (tableBody.firstChild == null) {
            partnerAuction = auctionOptions2[firstPartnerAuctionIndex]
        } else {
            partnerAuction = partnerAuctionOptions[partnerAuctionIndex]
        }
    }

    //N zaczyna - JA
    if (Nturn == true) {
        partnerAuction = partnerAuctionOptions[partnerAuctionIndex]
    }

    partnerAuctionOptions = []
    tablePartnerAuctions.push(partnerAuction)
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


function createTable() {
    // tworzenie nagłówka
    if(tableHead.firstChild == null) {
        const titleElement = document.createElement('tr');
        const tableLineTitleMe = document.createElement("th");
        const tableLineTitleGrandpa = document.createElement("th");
        tableLineTitleMe.textContent = "N";
        tableLineTitleGrandpa.textContent = "S";
        titleElement.appendChild(tableLineTitleMe);
        titleElement.appendChild(tableLineTitleGrandpa);
        tableHead.appendChild(titleElement);
    }

    const tableLine = document.createElement("tr");
    const tableLineElement = document.createElement("td");
    const tableLinePartnerElement = document.createElement("td");

    tableLine.appendChild(tableLineElement);
    tableBody.appendChild(tableLine);
    tableLine.appendChild(tableLinePartnerElement);
    
    tableLinePartnerElement.textContent = partnerAuction; 
    tableLineElement.textContent = auction;
}

function auctionTable() {
    
    //walidacja czy licytacja jest poprawna
    let OKflag; //sprawdzenie czy wszystkie dane są poprawne - boolean
    let myAuctionOptions = []

    if(symbol == "" || symbol == undefined || number == NaN || number == undefined || (number == "" && !(symbol == "Pass"))) {
        OKflag = false;
    } else {
        auction = number + symbol;
        OKflag = true;
    }
    tableMyAuctions.push(auction);

    let myLastAuction = tableMyAuctions[tableMyAuctions.length - 1];
    let partnerLastAuction = tablePartnerAuctions[tablePartnerAuctions.length - 1];
    partnerTurn(myLastAuction);

    for(let i = 0; i < auctionOptions1.length; i++){
        if(partnerLastAuction == auctionOptions1[i]){
            myAuctionOptions = auctionOptions1.slice(i+1, auctionOptions1.length)
        }
    }
    //tworzenie elementów tabeli licytacji, jeśli ruch jest poprawny
    if(flag_newGame_N == true && OKflag == true && endTurn == false) {
        if(myLastAuction == "Pass" || partnerAuction == "Pass") {
            OKflag = false;
            endTurn = true;
            resetBtnColors();
            createTable();
            btnAuction.disabled = true;

            CSVRow = createCSVRow();
            csv.push(CSVRow);

        } else {
            if (myAuctionOptions.indexOf(auction) !== -1) {
                createTable();

                symbol = "";
                number = "";
            } else if(Nturn == true && tableBody.firstChild == null) {
                createTable();

                symbol = "";
                number = "";
            } else {
                tablePartnerAuctions.pop()
                alert("Zmień licytację")
            }
        }
    } else {
        tablePartnerAuctions.pop()
        alert("Wybierz kto zaczyna") 
    }

    resetBtnColors();
}

function resetTable(){
    while(tableBody.firstChild) {
        tableBody.firstChild.remove()
    }
}

//kliknięcie licytuj
btnAuction.addEventListener('click', function() {
    auctionTable()
})

// kliknięcie w przycisk nowa tura
btnNewTurn.addEventListener('click',function() {
    resetBtnColors();
    resetTable();
    btnAuction.disabled = false;
    endTurn = false; // reset domyślnie false
    Nturn = false;
    Sturn = false;
    btnNewGameS.classList.remove("active")
    btnNewGameN.classList.remove("active")
    tableAllTurnsPartner.push(tablePartnerAuctions);
    tablePartnerAuctions = []
})

//N zaczyna
btnNewGameN.addEventListener('click', function(){
    Nturn = true;
    Sturn = false;
    btnNewGameN.classList.add('active')
    btnNewGameS.classList.remove("active")
    resetTable();
    btnAuction.disabled = false;
    tablePartnerAuctions = [];
    dealer = "N";
    
})

// S zaczyna
btnNewGameS.addEventListener('click', function(){
    Sturn = true;
    Nturn = false;
    btnNewGameN.classList.remove('active')
    btnNewGameS.classList.add("active")
    resetTable();
    btnAuction.disabled = false;

    if (Sturn == true) {
        if (tableBody.firstChild == null) {
            auction = ""
        }
    }
    partnerTurn("")
    createTable()

    dealer = "S";
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


function exportCardsToCsv() {
    let cardsToCsv = cardsGamerN + cardsGamerS + dealer +";";
    return cardsToCsv
}


function exportAuctionToCsv() {
    let auctionRow = "";
    var rows = document.querySelectorAll("table tr, table tr");

    for(let i = 1; i < rows.length; i++) {
        var row = "";
        var cols = rows[i].querySelectorAll("td, th");
        
        for(let j = 0; j < cols.length; j++) {

            let sym = cols[j].innerText; //przypisujemy do nowej zmiennej lokalnej aby nie podmieniać symbolu na tekst globalnie
            
            //Zmiana symboli na tekt
            if (cols[j].innerText[1] == "♣") {
                sym.slice(1, cols[j].innerText.length);
                sym = sym[0] + "Clubs"
            
            } else if (cols[j].innerText[1] == "♦") { //♦
                sym.slice(1, cols[j].innerText.length);
                sym = sym[0] + "Diamonds"

            } else if (cols[j].innerText[1] == "♥") {
                sym.slice(1, cols[j].innerText.length);
                sym = sym[0] + "Hearts"

            } else if (cols[j].innerText[1] == "♠") {
                sym.slice(1, cols[j].innerText.length);
                sym = sym[0] + "Spades"
            } 

            //ominięcie pustych komórek (np. gdy S zaczyna)
            if (sym !== "") {
                sym = sym + ";"
            }
            
            row += sym;
        }
        //suma wszystkich wierszy do jednego strinaga do csv
        auctionRow += row;
    }
    return auctionRow
}

//ostateczny string do csv z jednej tury
function createCSVRow() {
    let cardsCSV = exportCardsToCsv();
    let auctionCSV = exportAuctionToCsv();

    return cardsCSV + auctionCSV;
}

//kliknięcie w przycisk pobierz plik csv
btnCsv.addEventListener('click', function() {

    //download csv
    downloadCSV(csv.join("\n"), "rozgrywka.csv");
})