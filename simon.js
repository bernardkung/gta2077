

// Define variables needed for the Simon board
var simoncanvas = document.getElementById("simoncanvas");
var simoncontext = simoncanvas.getContext("2d");
var rect = simoncanvas.getBoundingClientRect();
var w = rect.width / 2;

var quad1 = {color: "#ffea37", xcoords: 0, ycoords: 0};
var quad2 = {color: "#dd4b3e", xcoords: w, ycoords: 0};
var quad3 = {color: "#3edd4b", xcoords: 0, ycoords: w};
var quad4 = {color: "#4b3edd", xcoords: w, ycoords: w};
var quadrants = [quad1, quad2, quad3, quad4];

var score = 0;
var high_score = 0;
var seq_len = score;
var simonSeq = [];

var nClick = 0;
var listening = false;



// Draw the initial Simon board
function drawQuadrant(x, y, w, h, color) {
    simoncontext.fillStyle = color;
    simoncontext.fillRect(x, y, w, h);
}

function drawBoard() {
    for (var quad of quadrants) {
        drawQuadrant(quad.xcoords, quad.ycoords, w, w, quad.color);
    }
}

function addSimonStep() {
    // Push a random number between 1 and 4 as the next step
    simonSeq.push(Math.round(Math.random() * 3) + 1)
}

function demonstrate() {
    console.log("Demonstrating!");
    addSimonStep();
    console.log(simonSeq);

    for (var s in simonSeq) {
        let q = simonSeq[s] - 1;
        setTimeout(function () {
            console.log("Flash!")
            flashQuadrant(q)
        }, 1000 * (s));
    }

    // Start listening for player response
    setTimeout(function() {
        listening = true;
        console.log("Listening!");
    }, (simonSeq.length - 1) * 1000);
}

// Flashes a quadrant to a different color
function flashQuadrant(q) {
    // Flash the tile white
    drawQuadrant(quadrants[q].xcoords, quadrants[q].ycoords, w, w, "#ffffff")

    // Flash the tile back to original color after a brief period of time
    setTimeout(
        function() {
        drawQuadrant(quadrants[q].xcoords, quadrants[q].ycoords, w, w, quadrants[q].color)
    },
    300
    );
}

// Detects which quadrant a click was in
function clickQuadrant(x, y) {
    if (x < w) {
        if (y < w) {
            return 1;
        }
        else {
            return 3;
        }
    }
    else if (x >= w) {
        if (y < w) {
            return 2;
        }
        else {
            return 4;
        }
    }
}


// Scoring
function setHighScore() {
    document.querySelector('#high_score').innerText = parseInt(high_score);
}

function scoreIncrease()
{
    score++;
    seq_len++;

    document.querySelector('#score').innerText = parseInt(score);
}

function scoreReset()
{
    nClick = 0;
    score = 0;
    seq_len = score + 1;
    simonSeq = [];
    document.querySelector('#score').innerText = parseInt(score);
}



// Initialize by drawing the board
drawBoard();


// Start game
var start_button = document.getElementById("start");
start_button.addEventListener('click', function(event) {
    // Reset score
    scoreReset();
    demonstrate();
}, false)


// Listen for player response
simoncanvas.addEventListener('click', function(event) {

    if (listening & nClick <= seq_len) {
        // Detect click location
        var xClick = event.pageX - rect.left;
        var yClick = event.pageY - rect.top;
        qClick = clickQuadrant(xClick, yClick);
        flashQuadrant(qClick - 1);
        nClick++;
        console.log("Clicks: ", nClick, "; Quadrant: ", qClick);

        // If click was incorrect
        if (qClick !== simonSeq[nClick - 1]) {
            // Turn off listening
            listening = false;
            // Check if a new high score was set
            if (score > high_score) {
                high_score = score;
                setHighScore();
                alert('Game Over!\nYou got a new high score of ' + score + '!');
            }
            else {
                alert('Game Over!\nYou got ' + score + ' in a row!');
            }
            scoreReset();
        }
        else {
            // If this is the last expected click
            if (nClick === seq_len) {
                // Turn off listening
                listening = false;
                nClick = 0;
                scoreIncrease();
                // Start the next sequence
                setTimeout(function () {
                    demonstrate();
                }, 500);
            }
        }
    }
}, false);




document.getElementById('test').addEventListener('click', function(event) {
    for (var i = 0; i < 3; i ++) {
        setTimeout(function () {
            console.log("Lighting!")
        }, 1000 * (i + 0.5));
        setTimeout(function () {
            console.log("Thunder!")
        }, 1000 * (i + 1));
    }
})
