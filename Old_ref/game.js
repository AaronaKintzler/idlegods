const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');

// Set canvas dimensions
canvas.width = 400;
canvas.height = 400;

// Load the background image
const backgroundImage = new Image();
backgroundImage.src = 'TownMap.JPG';

// Player object
const player = {
    x: 50,
    y: 50,
    width: 50,
    height: 50,
    color: 'blue',
    speed: 5
};

// Track which keys are pressed
const keys = {};

// Grid overlay for 10x10 80x80 black squares
const grid = Array.from({ length: 10 }, () => Array(10).fill(true));

// Draw the background image and player
function draw() {
    // Draw the background image, stretched to cover the entire canvas
    context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

    // Draw the grid of black squares
    drawGrid();

    // Draw the player (the blue square) on top of the background
    context.fillStyle = player.color;
    context.fillRect(player.x, player.y, player.width, player.height);
}

// Draw the 10x10 grid of 80x80 black squares
function drawGrid() {
    for (let row = 0; row < 10; row++) {
        for (let col = 0; col < 10; col++) {
            if (grid[row][col]) {
                context.fillStyle = 'black';
                context.fillRect(col *40, row * 40, 40, 40);
            }
        }
    }
}

// Progress values for actions
const progress = {
    Observe: 0,
    Riverbed: 0,
    Well: 0
};

// Milestone messages
const observeMessages = {
    1: "Allows you to hear more prayers. (otherwise you'd miss some)",
    25: "leads to restoring aquifer",
    50: "You meet a tiny little creature. You realize that for prayers they'll help you support the town. This could be helpful.",
    75: "You find a forgotten shrine. Enki. Is that your name?",
    100: "Not a thing goes by in this town that you cannot sense. You are truly Omniscient (at least in this tiny little town :) ) [boost to prayers]"
};

const wellMessages = {
    1: "Long since dried up, residents sometimes still cast the bucket down, as though ritualistically.",
    10: "A bucket is cast down without much hope, but when it comes up a little water comes with it. The person is elated as they are surprised.",
    50: "Something floats up to the surface of the water. A rune is carved on it, and a figure. The people are purplexed, but they build a wooden case around it and give it offerings to thank the gods, to thank you, for their change in fortune (Shrine exists)",
};

const rbMessages = {
    1: "A dusty creek lies like a scar next to the town. It's been nearly a decade since even a dribble of water has traversed its depths. ",
    25: "The villagers head to the river, barely more than a creek. But they bring bucket to drink from the fresh water. Nearby a group of deer lap the water alongside them. ",
    50: "This dried Riverbed leads to an underground chamber, an long dried aquifer. The overflow will travel into the ground and feed the land around here as well. ",
    75: "The water now flows, knee deep, cold and fresh",
    100: "A large trout eyes an elderly man holding a hook. Despite the plentiful fish dancing in the water, they continue to elude his increasingly desparate array of bait. "
};

// Accessibility alert for key events
function accessibilityAlert(message) {
    const liveRegion = document.getElementById('liveRegion');
    liveRegion.textContent = message;
}

// Game update loop
function update() {
    draw();

    // Move player based on keys
    if (keys['ArrowUp']) player.y -= player.speed;
    if (keys['ArrowDown']) player.y += player.speed;
    if (keys['ArrowLeft']) player.x -= player.speed;
    if (keys['ArrowRight']) player.x += player.speed;

    // Request next frame
    requestAnimationFrame(update);
}

// Reveal grid squares for each point in "Observe" progress
function revealGridSquare() {
    let availableSquares = [];

    // Find all black squares (true values in the grid)
    for (let row = 0; row < 10; row++) {
        for (let col = 0; col < 10; col++) {
            if (grid[row][col]) {
                availableSquares.push({ row, col });
            }
        }
    }

    // If there are any black squares left, make one of them transparent
    if (availableSquares.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableSquares.length);
        const { row, col } = availableSquares[randomIndex];
        grid[row][col] = false; // Make the square transparent
    }
}


// Handle button clicks
function handleAction(action) {
    if (progress[action] !== undefined) {
        // Increment progress by 1% for "Observe," "Riverbed," and "Well"
        progress[action] = Math.min(progress[action] + 1, 100);

        // Update the progress bar display
        updateProgressBar(action, progress[action]);

        // Update milestones for Observe
        if (action === 'Observe') {
            updateObserve(progress[action]);
            revealGridSquare(progress[action]);
        }

        if (action === 'Well') {
            updateWell(progress[action]);
        }

        if (action === 'Riverbed') {
            updateRiverbed(progress[action]);
        }

        // Announce progress for accessibility
        accessibilityAlert(`${action} progress: ${progress[action]}%`);
    } else {
        accessibilityAlert(`${action} action performed`);
    }
}

// Update progress bar display
function updateProgressBar(action, value) {
    const progressElement = document.getElementById(`${action.toLowerCase()}Progress`);
    if (progressElement) {
        progressElement.style.width = `${value}%`;
        progressElement.textContent = `${value}%`;
    }
}

// Update Observe milestones
function updateObserve(observeProgress) {
    if (observeProgress >= 1 && observeProgress < 25) {
        document.getElementById('o_milestone1').textContent = `1% ${observeMessages[1]}`;
    }
    if (observeProgress >= 25 && observeProgress < 50) {
        document.getElementById('o_milestone2').textContent = `25% ${observeMessages[25]}`;
    }
    if (observeProgress >= 50 && observeProgress < 75) {
        document.getElementById('o_milestone3').textContent = `50% ${observeMessages[50]}`;
    }
    if (observeProgress >= 75 && observeProgress < 100) {
        document.getElementById('o_milestone4').textContent = `75% ${observeMessages[75]}`;
    }
    if (observeProgress === 100) {
        document.getElementById('o_milestone5').textContent = `100% ${observeMessages[100]}`;
    }
}

function updateRiverbed(rbProgress) {
    if (rbProgress >= 1 && rbProgress < 25) {
        document.getElementById('r_milestone1').textContent = `1% ${rbMessages[1]}`;
    }
    if (rbProgress >= 25 && rbProgress < 50) {
        document.getElementById('r_milestone2').textContent = `25% ${rbMessages[25]}`;
    }
    if (rbProgress >= 50 && rbProgress < 75) {
        document.getElementById('r_milestone3').textContent = `50% ${rbMessages[50]}`;
    }
    if (rbProgress >= 75 && rbProgress < 100) {
        document.getElementById('r_milestone4').textContent = `75% ${rbMessages[75]}`;
    }
    if (rbProgress === 100) {
        document.getElementById('r_milestone5').textContent = `100% ${rbMessages[100]}`;
    }
}

function updateWell(wellProgress) {
    if (wellProgress >= 1 && wellProgress < 10) {
        document.getElementById('w_milestone1').textContent = `1% ${wellMessages[1]}`;
    }
    if (wellProgress >= 10 && wellProgress < 50) {
        document.getElementById('w_milestone2').textContent = `10% ${wellMessages[10]}`;
    }
    if (wellProgress >= 50 && wellProgress < 75) {
        document.getElementById('w_milestone3').textContent = `50% ${wellMessages[50]}`;
    }
}

function startPrayersCounter() {
    setInterval(() => {
        prayers += 1; // Increment prayers by 1
        document.getElementById('prayersDisplay').textContent = `Prayers: ${prayers}`; // Update display
    }, 1000); // Run every 1000 milliseconds (1 second)
}

// Key down event
window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    if (e.key === 'ArrowUp') accessibilityAlert('Moving up');
    if (e.key === 'ArrowDown') accessibilityAlert('Moving down');
    if (e.key === 'ArrowLeft') accessibilityAlert('Moving left');
    if (e.key === 'ArrowRight') accessibilityAlert('Moving right');
});

// Key up event
window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});



// Start the game loop after the image loads
backgroundImage.onload = () => {
    update();
};