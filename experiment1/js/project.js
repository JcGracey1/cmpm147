// project.js - purpose and description here
// Author: Your Name
// Date:

// NOTE: This is how we might start a basic JavaaScript OOP project

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file

// define a class
class MyProjectClass {
  // constructor function
  constructor(param1, param2) {
    // set properties using 'this' keyword
    this.property1 = param1;
    this.property2 = param2;
  }
  
  // define a method
  myMethod() {
    // code to run when method is called
  }
}

function main() {
  const fillers = {
    chest: ["Barbell Bench Press", "Dumbbell Bench", "Push-Ups", "Dips"],
    chest2: ["Incline Bench Press", "Dumbbell Flyes", "Cable Crossover"],
    back: ["Lat Pull-Downs", "Pull-Ups", "Bent-Over Barbell Rows"],
    back2: ["Back Extension", "Low Rows", "Deadlifts"],
    legs: ["Barbell Squats", "Romanian Deadlifts", "Lunges", "Leg Press", "Glute Drive", "Calf Raises", "Hamstring Curls", "Leg Extension"],
    shoulder: ["Overhead Barbell Press", "Dumbbell Shoulder Press", "Lateral Raises", "Front Raises", "Arnold Press", "Face Pulls"],
    biceps: ["Dumbbell Bicep Curl", "Preacher Curl", "Hammer Curl", "Cable Bicep Curl"],
    triceps: ["Tricep Rope Pushdowns", "Skull Crushers", "Diamond Push-ups", "Overhead Tricep Extension"],
    cardio: ["Stair Climbers", "Inclined Treadmill", "Elliptical", "Biking"],
  };
  
  const template = ` Hello Gym Goer! Choose which day you want:
  
  \tChest and Back Day: 4 sets $chest, 3 sets $chest2, 4 sets $back,
  3 sets $back2.
  
  \tLeg Day: 4 sets $legs, 4 sets $legs, 3 sets $legs
  
  \tArm Day: 4 sets $shoulder, 4 sets $biceps, 4 sets $triceps
  
  Accomany workout with 15 mintues of $cardio
  
  Enjoy!
  `;
  
  
  // STUDENTS: You don't need to edit code below this line.
  
  const slotPattern = /\$(\w+)/;
  
  function replacer(match, name) {
    let options = fillers[name];
    if (options) {
      return options[Math.floor(Math.random() * options.length)];
    } else {
      return `<UNKNOWN:${name}>`;
    }
  }
  
  function generate() {
    let story = template;
    while (story.match(slotPattern)) {
      story = story.replace(slotPattern, replacer);
    }
  
    /* global box */
    box.innerText = story;
  }
  
  /* global clicker */
  clicker.onclick = generate;
  
  generate();
  
}

// let's get this party started - uncomment me
//main();