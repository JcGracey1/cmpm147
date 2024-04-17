function resizeScreen() {
  centerHorz = canvasContainer.width() / 2; // Adjusted for drawing logic
  centerVert = canvasContainer.height() / 2; // Adjusted for drawing logic
  console.log("Resizing...");
  resizeCanvas(canvasContainer.width(), canvasContainer.height());
  // redrawCanvas(); // Redraw everything based on new size
}

// setup() function is called once when the program starts
function setup() {
  // place our canvas, making it fit our container
  canvasContainer = $("#canvas-container");
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height());
  canvas.parent("canvas-container");
  // resize canvas is the page is resized

  $(window).resize(function() {
    resizeScreen();
  });
  resizeScreen();

  noiseSeed(millis());

  // Initialize unique noise offsets for each oval
  for (let i = 0; i < 10; i++) {
    baseOffsets.push(random(1000)); // These remain constant throughout execution
  }
}

/* exported setup, draw */

let seed = 0;

const sunsetColor = "#ed8728";
const treeColor = "#2f1303";
const cloudColor = "#d4aab3";
const sunColor = "#fbfae5";


function draw() {
  randomSeed(seed);
  background(100);

  // Define dynamic parameters for movement
  const timeFactor = millis() / 100000.0;
  const scrub = mouseX / width;

  // Calculate the position of the sun along a fixed path
  let sunX = width / 1.5 + timeFactor * width / 2; // Start from the center with dynamic movement
  let sunY = height / 1.7 + timeFactor * height / 4; // Start from the middle vertically with dynamic movement
  let sunSize = width / 10; // Size of the sun

  fill(sunsetColor);
  rect(0, 0, width, height / 1.2);


  // Draw the sun with dynamic movement
  fill(sunColor);
  ellipse(sunX, sunY, sunSize);

  // Draw random clouds with dynamic movement
  drawClouds(20);

  fill(treeColor);
  beginShape();
  vertex(0, height / 1.2);
  const steps = 10;
  for (let i = 0; i < steps + 1; i++) {
    let x = (width * i) / steps;
    let y = height /1.2  - (random() * random() * random() * height) / 4 - height / 50;
    vertex(x, y);
  }
  vertex(width, height / 1.2);
  endShape(CLOSE);  

  // Draw trees with dynamic movement
  fill(treeColor);
  const treeTimeFactor = millis() / 70000.0;
  const trees = 15 * random();
  for (let i = 0; i < trees; i++) {
    let x = width * (random() + scrub / 50 + treeTimeFactor); // Random x position modified by dynamic parameters
    let s = random(width / 20) + 10; // Random size
    let minHeight = height / 2; // Minimum height
    let maxHeight = height; // Maximum height
    let y = random(minHeight, maxHeight); // Random y-coordinate within range

    // Draw dynamic trees
    rect(x - s / 8, (y - s)/2 , s / 3, s * 10 );
    let swigglyX = x - s / 8;
    let swigglyY = (y - s) / 2;
    let swigglyWidth = 60;
    let swigglyHeight = 30;
    drawSwigglyEllipse(swigglyX, swigglyY, swigglyWidth, swigglyHeight);
  }
  
  fill(treeColor);
  rect(0, height / 1.25, width, height / 2);
}



function drawSwigglyEllipse(x, y, w, h) {
  beginShape();
  for (let i = 0; i < TWO_PI; i += 0.1) {
    let xOffset = random(-5, 5);
    let yOffset = random(-5, 5);
    let ellipseX = x + cos(i) * w / 2 + xOffset;
    let ellipseY = y + sin(i) * h / 2 + yOffset;
    vertex(ellipseX, ellipseY);
  }
  endShape(CLOSE);
}

function drawClouds(numClouds) {
  noStroke();
  fill(cloudColor);

  // Define dynamic parameters
  const scrub = mouseX / width;
  const timeFactor = millis() / 80000.0;

  for (let i = 0; i < numClouds; i++) {
    let x = width * (random() + (scrub / 50 + timeFactor)); // Random x position modified by time and scrub
    let y = random(height / 4); // Random y position in the upper quarter of the canvas
    let radius = random(20, 80); // Random radius for the cloud
    let noiseScale = random(0.01, 0.1); // Random noise scale to create variation in shape

    beginShape();
    for (let angle = 0; angle < TWO_PI; angle += 0.1) {
      let xOffset = radius * cos(angle);
      let yOffset = radius * sin(angle);
      let noiseVal = noise((x + xOffset) * noiseScale, (y + yOffset) * noiseScale);
      let cloudRadius = radius + map(noiseVal, 0, 1, -20, 20); // Apply variation to the radius
      let cloudXVaried = x + cloudRadius * cos(angle); // Modify x position based on cloudRadius
      let cloudYVaried = y + cloudRadius * sin(angle); // Modify y position based on cloudRadius
      vertex(cloudXVaried, cloudYVaried);
    }
    endShape(CLOSE);
  }
}

