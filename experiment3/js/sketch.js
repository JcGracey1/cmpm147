let seed = 0;
let tilesetImage;
let currentGrid = [];
let numRows, numCols;

function preload() {
  tilesetImage = loadImage(
    "https://cdn.glitch.com/25101045-29e2-407a-894c-e0243cd8c7c6%2Ftileset.png?v=1611654020439"
  );
}

function reseed() {
  seed = (seed | 0) + 1109;
  randomSeed(seed);
  noiseSeed(seed);
  select("#seedReport").html("seed " + seed);
  regenerateGrid();
}

function regenerateGrid() {
  select("#asciiBox").value(gridToString(generateGrid(numCols, numRows)));
  reparseGrid();
}

function reparseGrid() {
  currentGrid = stringToGrid(select("#asciiBox").value());
}

function gridToString(grid) {
  let rows = [];
  for (let i = 0; i < grid.length; i++) {
    rows.push(grid[i].join(""));
  }
  return rows.join("\n");
}

function stringToGrid(str) {
  let grid = [];
  let lines = str.split("\n");
  for (let i = 0; i < lines.length; i++) {
    let row = [];
    let chars = lines[i].split("");
    for (let j = 0; j < chars.length; j++) {
      row.push(chars[j]);
    }
    grid.push(row);
  }
  return grid;
}

function setup() {
  numCols = select("#asciiBox").attribute("rows") | 0;
  numRows = select("#asciiBox").attribute("cols") | 0;

  createCanvas(16 * numCols, 16 * numRows).parent("canvasContainer");
  select("canvas").elt.getContext("2d").imageSmoothingEnabled = false;

  select("#reseedButton").mousePressed(reseed);
  select("#asciiBox").input(reparseGrid);

  reseed();
}


function draw() {
  randomSeed(seed);
  drawGrid(currentGrid);
}

function placeTile(i, j, ti, tj) {
  image(tilesetImage, 16 * j, 16 * i, 16, 16, 8 * ti, 8 * tj, 8, 8);
}

function generateGrid(numCols, numRows) {
  let grid = [];

  // Initialize the grid with default values
  for (let i = 0; i < numRows; i++) {
    let row = [];
    for (let j = 0; j < numCols; j++) {
      row.push("_");
    }
    grid.push(row);
  }

  // Define the number of rectangles
  const numRectangles = 4;
  const maxRectWidth = 10;
  const maxRectHeight = 5;

  let rectangles = [];

  // Generate rectangles at random positions and store their center points
  for (let n = 0; n < numRectangles; n++) {
    let rectWidth = Math.floor(Math.random() * maxRectWidth) + 1;
    let rectHeight = Math.floor(Math.random() * maxRectHeight) + 1;
    let startX = Math.floor(Math.random() * (numCols - rectWidth));
    let startY = Math.floor(Math.random() * (numRows - rectHeight));

    // Store the rectangle center point for path connections
    rectangles.push({
      centerX: startX + Math.floor(rectWidth / 2),
      centerY: startY + Math.floor(rectHeight / 2)
    });

    // Fill the rectangle area with '.'
    for (let i = startY; i < startY + rectHeight; i++) {
      for (let j = startX; j < startX + rectWidth; j++) {
        grid[i][j] = ".";
      }
    }
  }

  // Connect each rectangle to the next via their center points
  for (let i = 0; i < rectangles.length - 1; i++) {
    connectPoints(grid, rectangles[i].centerX, rectangles[i].centerY, rectangles[i + 1].centerX, rectangles[i + 1].centerY, ".");
  }
  
  const numChests = 3; 
  for (let h = 0; h < numChests; h++) {
    let chestX, chestY;
    do {
      chestX = Math.floor(Math.random() * numCols);
      chestY = Math.floor(Math.random() * numRows);
      // Ensure the tile is '.' and not part of a narrow path
    } while (!isValidChestPosition(grid, chestX, chestY));
    grid[chestY][chestX] = 'C'; 
    grid[chestY][chestX-1] = 'L';
  }

  return grid;
}

function isValidChestPosition(grid, x, y) {
  // First check if the main position is valid
  if (grid[y][x] !== '.') {
    return false;
  }
  // Ensure each surrounding position is also '.'
  return (
    grid[y][x - 1] === '.' && // Left
    grid[y][x + 1] === '.' && // Right
    y > 0 && grid[y - 1][x] === '.' && // Top (checking y > 0 to avoid accessing -1 index)
    y < grid.length - 1 && grid[y + 1][x] === '.' // Bottom (checking bounds)
  );
}

function connectPoints(grid, startX, startY, endX, endY, char) {
  let x = startX;
  let y = startY;

  // Connect horizontally first
  while (x !== endX) {
    grid[y][x] = char;
    x += Math.sign(endX - x); // Increment or decrement to move towards endX
  }

  // Then connect vertically
  while (y !== endY) {
    grid[y][x] = char;
    y += Math.sign(endY - y); // Increment or decrement to move towards endY
  }

  // Make sure the endpoint is included
  grid[endY][endX] = char;
}






function drawGrid(grid) {
  background(128);

  for(let i = 0; i < grid.length; i++) {
    for(let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] == '_') {
        placeTile(i, j, 21, floor(random(21,24)));
      } 
      
      if(gridCheck(grid, i, j,".")){
        placeTile(i,j,floor(random(5,6)),24);
      } else{
        drawContext(grid, i, j, ".", 4, 15);
      }
      
      if(gridCheck(grid,i,j,"C")){
        placeTile(i,j, floor(random(0,5)), floor(random(28,30)));
      }
      
      if(gridCheck(grid, i, j, "L")){
        placeTile(i,j, 28, 2);
      }
      
    }
  }
}

function gridCheck(grid, i, j, target) {
  if (i >= 0 && i < grid.length && j >= 0 && j < grid[i].length) {
    return grid[i][j] === target;
  } else {
    return false;
  }
}

function gridCode(grid, i, j, target) {
  return (
    (gridCheck(grid, i - 1, j, target) << 0) +
    (gridCheck(grid, i, j - 1, target) << 1) +
    (gridCheck(grid, i, j + 1, target) << 2) +
    (gridCheck(grid, i + 1, j, target) << 3)
  );
}

function drawContext(grid, i, j, target, dti, dtj, invert = false) {
  let code = gridCode(grid, i, j, target);
  if (invert) {
    code = ~code & 0xF;
  }
  else {
    // Handle error or provide a default tile placement
    console.error("Invalid tile code:", code);
  }
  let [ti, tj] = lookup[code];
  placeTile(i, j, dti + ti, dtj + tj);

}

const lookup = [
  [1, 1],
  [1, 0], 
  [0, 1], 
  [0, 0], 
  [2, 1], 
  [2, 0], 
  [1, 1],
  [1, 0], 
  [1, 2], 
  [1, 1],
  [0, 2], 
  [0, 1], 
  [2, 2], 
  [2, 1], 
  [1, 2], 
  [1, 1]
];
