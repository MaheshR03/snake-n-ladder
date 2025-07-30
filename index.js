// Initial game state
var number1 = 0;  
var number2 = 0;  
var turn = 1;  
var started1 = false;  
var started2 = false;  
var dices = ["", "&#9856", "&#9857", "&#9858", "&#9859", "&#9860", "&#9861"];  

// Generate the game board
var id = 100;
for (var a = 0; a < 5; a++) {
    for (var b = 0; b <= 9; b++) {
        document.getElementById("out").innerHTML += "<div class='boardbox left' id='box" + id + "'></div>";
        id--;
    }
    for (var c = 0; c <= 9; c++) {
        document.getElementById("out").innerHTML += "<div class='boardbox right' id='box" + id + "'></div>";
        id--;
    }
}

// Place pawns outside the board
document.getElementById("out").innerHTML += `
    <div id='pawnContainer'>
        <div id='pawn1_out' class='pawn'><img src='pawn.png' class='img'></div>
        <div id='pawn2_out' class='pawn'><img src='pawn2.png' class='img'></div>
    </div>
`;

// Style to position pawns next to each other
document.getElementById("pawnContainer").style.cssText = `
    position: absolute; top: 560px; left: 100px; display: flex; gap: 10px;
`;

// Start a new game
var play = function() {
    number1 = 0;
    number2 = 0;
    started1 = false;
    started2 = false;
    turn = 1;

    document.getElementById("out").style.visibility = "visible";
    document.getElementById("dice").style.visibility = "visible";
    document.getElementById("Play").style.visibility = "hidden";

    document.getElementById("dice").innerHTML = dices[1];
    document.getElementById("turnDisplay").innerHTML = "Player 1's Turn";
    document.getElementById("turnDisplay").style.backgroundColor = "black";

    document.getElementById("pawn1_out").style.visibility = "visible";
    document.getElementById("pawn2_out").style.visibility = "visible";

    // Enable Roll Dice button
    document.getElementById("RollDice").disabled = false;  

    // Reset pawns on board
    document.querySelectorAll(".boardbox").forEach(box => box.innerHTML = "");
}

// Dice roll function
var random = function() {
    var dice = document.getElementById("dice");

    // Add rolling animation
    dice.classList.add("dice-rolling");

    setTimeout(() => {
        dice.classList.remove("dice-rolling");  
        var roll = Math.ceil(Math.random() * 6);  
        dice.innerHTML = dices[roll];  

        if (turn === 1) {
            if (!started1 && roll === 6) {
                started1 = true;  
                number1 = 1;  // Start at position 1
                updatePawnPosition("pawn1", 0, 1);
                document.getElementById("pawn1_out").style.visibility = "hidden";  
            } else if (started1) {
                movePlayer(1, roll);
            }
        } else {
            if (!started2 && roll === 6) {
                started2 = true;  
                number2 = 1;  
                updatePawnPosition("pawn2", 0, 1);
                document.getElementById("pawn2_out").style.visibility = "hidden";  
            } else if (started2) {
                movePlayer(2, roll);
            }
        }

        // ✅ Always switch turns after rolling (even if it's a 6)
        turn = (turn === 1) ? 2 : 1;

        // Update turn display
        document.getElementById("turnDisplay").innerHTML = turn === 1 ? "Player 1's Turn" : "Player 2's Turn";
        document.getElementById("turnDisplay").style.backgroundColor = turn === 1 ? "black" : "orange";

        // Highlight the active player's pawn
        highlightPawn();

    }, 500); 
}

// Move the player based on dice roll
var movePlayer = function(player, diceRoll) {
    var currentPosition = (player === 1) ? number1 : number2;
    var pawn = (player === 1) ? "pawn1" : "pawn2";

    var newPosition = currentPosition + diceRoll;

    // Handle snakes and ladders
    var snakeLadderMap = {
        5: 25, 10: 29, 22: 41, 28: 55, 44: 95, 
        70: 89, 79: 81, 99: 7, 92: 35, 73: 53, 
        78: 39, 37: 17, 31: 14
    };

    if (snakeLadderMap[newPosition]) {
        newPosition = snakeLadderMap[newPosition];
    }

    // Ensure player doesn't go past 100
    if (newPosition > 100) {
        newPosition = currentPosition;  
    }

    // Move pawn visually
    updatePawnPosition(pawn, currentPosition, newPosition);

    // Check for win
    if (newPosition === 100) {
        setTimeout(() => {
            alert("Player " + player + " wins!");
            resetGame();
        }, 500);
    }

    // Update player position
    if (player === 1) {
        number1 = newPosition;
    } else {
        number2 = newPosition;
    }
}

// Move the pawn visually
var updatePawnPosition = function(pawn, currentPosition, newPosition) {
    if (currentPosition > 0) {
        var currentBox = document.getElementById("box" + currentPosition);
        currentBox.innerHTML = "";
    }

    var newBox = document.getElementById("box" + newPosition);
    newBox.innerHTML = "<img id='" + pawn + "' class='img' src='" + (pawn === 'pawn1' ? 'pawn.png' : 'pawn2.png') + "'></img>";
}

// Highlight the active player's pawn on the right
// Highlight the active player's pawn on the right side
var highlightPawn = function() {
    var pawn1Right = document.getElementById("pawn1_side"); // Right-side pawn for Player 1
    var pawn2Right = document.getElementById("pawn2_side"); // Right-side pawn for Player 2

    if (turn === 1) {
        pawn1Right.style.border = "5px solid yellow"; // Highlight Player 1's right-side pawn
        pawn2Right.style.border = "none"; 
    } else {
        pawn1Right.style.border = "none";
        pawn2Right.style.border = "5px solid yellow"; // Highlight Player 2's right-side pawn
    }
};

// Reset the game
var resetGame = function() {
    document.getElementById("out").style.visibility = "hidden";
    document.getElementById("dice").style.visibility = "hidden";
    document.getElementById("Play").style.visibility = "visible";
    document.getElementById("Play").innerHTML = "New Game";

    document.getElementById("pawn1_out").style.visibility = "visible";
    document.getElementById("pawn2_out").style.visibility = "visible";
}