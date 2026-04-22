// Initial references to DOM elements
const moves = document.getElementById("moves");
const container = document.querySelector(".container");
const startButton = document.getElementById("start-button");
const coverScreen = document.querySelector(".cover-screen");
const result = document.getElementById("result");

let movesCount = 0;
let imagesArr = [];

// Detect if the device supports touch events
const isTouchDevice = () => {
    try {
        document.createEvent("TouchEvent");
        return true;
    } catch (e) {
        return false;
    }
};

// Get row and column value from data-position
const getCoords = (element) => {
    const [row, col] = element.getAttribute("data-position").split("_");
    return [parseInt(row, 10), parseInt(col, 10)];
};

// Check if clicked piece and blank piece are adjacent
// row1, col1 are clicked image coordinates
// row2, col2 are blank image coordinates
const checkAdjacent = (row1, row2, col1, col2) => {
    if (row1 === row2) {
        // left/right
        if (col2 === col1 - 1 || col2 === col1 + 1) {
            return true;
        }
    } else if (col1 === col2) {
        // up/down
        if (row2 === row1 - 1 || row2 === row1 + 1) {
            return true;
        }
    }
    return false;
};

// Shuffle an array using the Fisher-Yates algorithm
// This produces a proper random permutation of the array
const shuffle = (arr) => {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
};

// Check if a 3x3 puzzle arrangement is solvable
// For odd grid width (3x3), the puzzle is solvable
// when the number of inversions is even
const isSolvable = (arr) => {
    const nums = arr.filter((num) => num !== 9); // ignore blank
    let inversions = 0;

    for (let i = 0; i < nums.length - 1; i++) {
        for (let j = i + 1; j < nums.length; j++) {
            if (nums[i] > nums[j]) {
                inversions++;
            }
        }
    }

    return inversions % 2 === 0;
};

// Generate a shuffled and solvable puzzle arrangement
// 9 represents the blank piece
const randomImages = () => {
    do {
        imagesArr = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    } while (!isSolvable(imagesArr));
};

// Generate 3x3 grid with image pieces
const gridGenerator = () => {
    let count = 0;

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            const div = document.createElement("div");
            div.setAttribute("data-position", `${i}_${j}`);
            div.addEventListener("click", selectImage);
            div.classList.add("image-container");

            div.innerHTML = `
                <img
                    src="image_part_00${imagesArr[count]}.png"
                    class="image ${imagesArr[count] === 9 ? "target" : ""}"
                    data-index="${imagesArr[count]}"
                />
            `;

            count += 1;
            container.appendChild(div);
        }
    }
};

// Handle click on an image piece
// If the clicked piece is adjacent to the blank one,
// move both in the DOM and update the logical array
const selectImage = (e) => {
    e.preventDefault();

    const currentElement = e.currentTarget.querySelector(".image");
    if (!currentElement) return;

    const targetElement = document.querySelector(".target");
    if (!targetElement || currentElement === targetElement) return;

    const currentParent = currentElement.parentElement;
    const targetParent = targetElement.parentElement;

    const [row1, col1] = getCoords(currentParent);
    const [row2, col2] = getCoords(targetParent);

    // Move only if pieces are adjacent
    if (!checkAdjacent(row1, row2, col1, col2)) return;

    // Get image indexes before moving
    const currentIndex = parseInt(currentElement.getAttribute("data-index"), 10);
    const targetIndex = parseInt(targetElement.getAttribute("data-index"), 10);

    // Swap images in the DOM
    currentParent.appendChild(targetElement);
    targetParent.appendChild(currentElement);

    // Swap values in logical array
    const currentArrIndex = imagesArr.indexOf(currentIndex);
    const targetArrIndex = imagesArr.indexOf(targetIndex);

    [imagesArr[currentArrIndex], imagesArr[targetArrIndex]] = [
        imagesArr[targetArrIndex],
        imagesArr[currentArrIndex],
    ];

    // Increment and display move count
    movesCount += 1;
    moves.innerText = `Movimientos: ${movesCount}`;

    // Win condition
    if (imagesArr.join("") === "123456789") {
        setTimeout(() => {
            coverScreen.classList.remove("hide");
            container.classList.add("hide");
            result.innerText = `Total de Movimientos: ${movesCount}`;
            startButton.innerText = "Reiniciar Juego";
        }, 1000);
    }
};

// Start button click should display the container
// and generate a new solvable puzzle
startButton.addEventListener("click", () => {
    container.classList.remove("hide");
    coverScreen.classList.add("hide");
    container.innerHTML = "";
    imagesArr = [];
    randomImages();
    gridGenerator();
    movesCount = 0;
    moves.innerText = `Movimientos: ${movesCount}`;
});

// Display start screen first
window.onload = () => {
    coverScreen.classList.remove("hide");
    container.classList.add("hide");
};