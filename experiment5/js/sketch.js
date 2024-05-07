// my_design.js:
/* exported p4_inspirations, p4_initialize, p4_render, p4_mutate */
window.currentShape = 'ellipse';

function p4_inspirations() {
  return [ 
    {
      name: "Sunflower",
      assetUrl: "https://cdn.glitch.global/1c9d03b9-2e22-4073-9de0-1422ff4bbd58/Sunflower_sky_backdrop.jpg?v=1715032109858",
      credit: "Google"
    },
    {
      name: "Taj Mahal",
      assetUrl: "https://cdn.glitch.global/1c9d03b9-2e22-4073-9de0-1422ff4bbd58/taj-mahal.jpg?v=1715031999909",
      credit: "Google"
    },
    {
      name: "Fantasy",
      assetUrl: "https://cdn.glitch.global/1c9d03b9-2e22-4073-9de0-1422ff4bbd58/beautiful-fantasy-landscape-desktop-wallpaper.jpg?v=1715105365655",
      credit: "Google"
    },
    {
      name: "Forest",
      assetUrl: "https://cdn.glitch.global/1c9d03b9-2e22-4073-9de0-1422ff4bbd58/Bos-Nederland-Epe-0x835-c-default.webp?v=1715032896637",
      credit: "Google"
    }
  ];
}

function p4_initialize(inspiration) {
  resizeCanvas(inspiration.image.width / 4, inspiration.image.height / 4);
  let design = {
    background: 100,
    foreground: [],
  }
  inspiration.image.loadPixels();
  for(let i = 0; i < 300; i++){
    // Get color data from the image at random positions
    let x = floor(random(inspiration.image.width));
    let y = floor(random(inspiration.image.height));
    let index = (x + y * inspiration.image.width) * 4; // Calculate the index of the pixel

    // Extract color data from the pixel
    let red = inspiration.image.pixels[index];
    let green = inspiration.image.pixels[index + 1];
    let blue = inspiration.image.pixels[index + 2];
    let brightness = (red + green + blue) / 3;
    let shapeSize = map(brightness, 0, 255, 5, 0)
    let shapeX = map(x, 0, inspiration.image.width, 0, width)
    let shapeY = map(y, 0, inspiration.image.height, 0, height)
    let opacity = random(255);
    let a = inspiration.image.pixels[index + 3]; // Alpha value of the pixel
    
    // Check if the pixel is fully transparent
    if (a === 0) {
      continue; // Skip drawing the shape if the pixel is fully transparent
    }    
    design.foreground.push({x: shapeX,
      y: shapeY,
      size: shapeSize,
      w: random(width / 2),
      h: random(height/ 2),
      s: random(50),
      rotation: random(10),
      fill: [red,green,blue,opacity]})
  }
  return design;
}

function p4_render(design, inspiration) {
  background(design.background);
  for (let shapes of design.foreground) {
    noStroke();
    //rotate(radians(shapes.rotation));
    fill(shapes.fill)
    if(window.currentShape == 'ellipse'){
      ellipse(shapes.x,shapes.y,shapes.w,shapes.h);
    } else if (window.currentShape == 'rectangle'){
      rect(shapes.x,shapes.y,shapes.w,shapes.h);
    } else {
      drawSpikeyBall(shapes.x,shapes.y,shapes.w/3,shapes.h);
    }
    
  }
}

function p4_mutate(design, inspiration, rate) {
  for (let shapes of design.foreground) {
    shapes.x = mut(shapes.x, 0, width, rate)
    shapes.y = mut(shapes.y, 0, height, rate)
    shapes.w = mut(shapes.w, 0, width/2, rate)
    shapes.h = mut(shapes.h, 0, height/2, rate)
    //if(window.currentShape!='spikey'){
    shapes.fill[0] = mut(shapes.fill[0], shapes.fill[0] - 30, shapes.fill[0] + 30, rate)
    shapes.fill[1] = mut(shapes.fill[1], shapes.fill[1] - 30, shapes.fill[1] + 30, rate)
    shapes.fill[2] = mut(shapes.fill[2], shapes.fill[2] - 30, shapes.fill[2] + 30, rate)
    shapes.fill[3] = mut(shapes.fill[3], shapes.fill[3] - 30, shapes.fill[3] + 30, rate)

  }
}

function mut(num, min, max, rate) {
  return constrain(randomGaussian(num, (rate * (max - min)) / 20), min, max);
}

function drawSpikeyBall(x, y, radius, spikeDepth) {
  beginShape();
  for (let angle = 0; angle < 360; angle += 1) {
    // Calculate the modulation of the radius based on the angle
    let radiusVariation = sin(angle * 10) * spikeDepth;
    let modRadius = radius + radiusVariation;

    // Calculate vertex coordinates
    let vx = x + cos(angle) * modRadius;
    let vy = y + sin(angle) * modRadius;
    vertex(vx, vy);
  }
  endShape(CLOSE);
}

// end my_design
// start p4_base.js:

/* exported preload, setup, draw */
/* global memory, dropper, restart, rate, slider, activeScore, bestScore, fpsCounter */
/* global p4_inspirations, p4_initialize, p4_render, p4_mutate */

let bestDesign;
let currentDesign;
let currentScore;
let currentInspiration;
let currentCanvas;
let currentInspirationPixels;

function preload() {
  

  let allInspirations = p4_inspirations();

  for (let i = 0; i < allInspirations.length; i++) {
    let insp = allInspirations[i];
    insp.image = loadImage(insp.assetUrl);
    let option = document.createElement("option");
    option.value = i;
    option.innerHTML = insp.name;
    dropper.appendChild(option);
  }
  dropper.onchange = e => inspirationChanged(allInspirations[e.target.value]);
  currentInspiration = allInspirations[0];

  restart.onclick = () =>
    inspirationChanged(allInspirations[dropper.value]);
}

function inspirationChanged(nextInspiration) {
  currentInspiration = nextInspiration;
  currentDesign = undefined;
  memory.innerHTML = "";
  setup();
}



function setup() {
  currentCanvas = createCanvas(width, height);
  currentCanvas.parent(document.getElementById("active"));
  currentScore = Number.NEGATIVE_INFINITY;
  currentDesign = p4_initialize(currentInspiration);
  bestDesign = currentDesign;
  image(currentInspiration.image, 0,0, width, height);
  loadPixels();
  currentInspirationPixels = pixels;
}

function evaluate() {
  loadPixels();

  let error = 0;
  let n = pixels.length;
  
  for (let i = 0; i < n; i++) {
    error += sq(pixels[i] - currentInspirationPixels[i]);
  }
  return 1/(1+error/n);
}



function memorialize() {
  let url = currentCanvas.canvas.toDataURL();

  let img = document.createElement("img");
  img.classList.add("memory");
  img.src = url;
  img.width = width;
  img.heigh = height;
  img.title = currentScore;

  document.getElementById("best").innerHTML = "";
  document.getElementById("best").appendChild(img.cloneNode());

  img.width = width / 2;
  img.height = height / 2;

  memory.insertBefore(img, memory.firstChild);

  if (memory.childNodes.length > memory.dataset.maxItems) {
    memory.removeChild(memory.lastChild);
  }
}

let mutationCount = 0;

function draw() {
  
  if(!currentDesign) {
    return;
  }
  randomSeed(mutationCount++);
  currentDesign = JSON.parse(JSON.stringify(bestDesign));
  rate.innerHTML = slider.value;
  p4_mutate(currentDesign, currentInspiration, slider.value/100.0);
  
  randomSeed(0);
  p4_render(currentDesign, currentInspiration);
  let nextScore = evaluate();
  activeScore.innerHTML = nextScore;
  if (nextScore > currentScore) {
    currentScore = nextScore;
    bestDesign = currentDesign;
    memorialize();
    bestScore.innerHTML = currentScore;
  }
  
  fpsCounter.innerHTML = Math.round(frameRate());
}
