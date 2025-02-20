// 1. Deposit some money
// 2. Determine number of lines to bet on
// 3. Collect a bet amount
// 4. Spin the slot machine
// 5. Check if the user won
// 6. Give the user their winnings
// 7. Play again

//set the initial values
let totalBet = 0;
let numberOfLines = 1;
let balance = 0;

//set up the slot machine
const ROWS = 3;
const COLS = 3;

const SYMBOLS_COUNT = {
    "A": 2,
    "B": 4,
    "C": 6,
    "D": 8,
};

const SYMBOL_VALUES = {
    "A": 5,
    "B": 4,
    "C": 3,
    "D": 2,
};


const updateTotalBet = (amount) => {
    totalBet += amount;
    document.getElementById("currentTotalBet").innerHTML = "Your total bet is: " + totalBet;
};

const selectLineAmount = (amountOfLines) => {
    numberOfLines = amountOfLines;
    document.getElementById("numberOfLines").innerHTML = "Your total amount of lines is: " + numberOfLines;
}

function resetBetAmount() {
    totalBet = 0;
    document.getElementById("currentTotalBet").innerHTML = "Your total bet is: " + totalBet;
}
function resetLineAmount() {
    numberOfLines = 1;
    document.getElementById("numberOfLines").innerHTML = "Your total amount of lines is: " + numberOfLines;
}

const createSlotMatrix = () => {
    const symbols = [];
    for ([symbol, count] of Object.entries(SYMBOLS_COUNT)) {
        for (let i = 0; i < count; i++) {
            symbols.push(symbol);
        }
    }
    const reels = [];
    for (let i = 0; i < COLS; i++) {
        reels.push([]);
        const reelSymbols = [...symbols];
        for (let j = 0; j < ROWS; j++) {
            const  randomIndex = Math.floor(Math.random() * reelSymbols.length)
            const selectedSymbol = reelSymbols[randomIndex];
            reels[i].push(selectedSymbol);
            reelSymbols.splice(randomIndex, 1);
        }
    } 
    return transposeMatrix(reels);
}

const transposeMatrix = (matrix) => {
    //return matrix[0].map((_, i) => matrix.map(row => row[i]));
    const rows = [];
    for (let i = 0; i < ROWS; i++) {
        rows.push([]);
        for (let j = 0; j < COLS; j++) {
            rows[i].push(matrix[j][i]);
        }
    }
    return rows;
}

const printSlotMatrix = () => {
    const matrix = createSlotMatrix();
    const spinContainer = document.getElementById("spinContainer");
    spinContainer.innerHTML = ""; // Clear previous results
    for (const row of matrix) {
        let rowString = row.join(" | ");
        const finishedRow = document.createElement("p");
        finishedRow.innerHTML = rowString;
        spinContainer.appendChild(finishedRow);
    }
    return matrix;
}

const checkWin = (matrix) => {
    let winnings = 0;
    for (let i = 0; i< numberOfLines; i++) {
        const line = matrix[i];
        if (line.every(value => value === line[0])) {
            winnings += totalBet * SYMBOL_VALUES[line[0]];
        }
    }
    return winnings;
}

document.addEventListener("DOMContentLoaded", () => {
    //create starter image
    printSlotMatrix();

    //Calculate and display the balance
    document.getElementById("setBalanceButton").addEventListener("click", () => {
    const balanceInput = document.getElementById("balanceInput").value;
    balance = parseInt(balanceInput);
    if (isNaN(balance) || balance <= 0) {
        alert("Please enter a valid balance.");
    } else {
        document.getElementById("currentBalance").innerHTML = "Your total balance is: " + balance;
    }
    });

    //get bet amount from user with buttons
    document.getElementById("currentTotalBet").innerHTML = "Your total bet is: " + totalBet;

    //spim the slot and get winnings
    document.getElementById("spinButton").addEventListener("click", () => {
        if (totalBet === 0) {
            alert("You need to bet something to spin!");
            return;
        }
        if (balance < totalBet*numberOfLines) {
            alert("You don't have enough money to bet that amount per line!");
            return;
        }
        const matrix = printSlotMatrix();
        winnings = checkWin(matrix);
        document.getElementById("currentWinnings").innerHTML = "You won: " + winnings
        balance += winnings - totalBet*numberOfLines;
        document.getElementById("currentBalance").innerHTML = "Your total balance is: " + balance;  
    });
   
});