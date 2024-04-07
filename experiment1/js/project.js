// project.js - Experiment 01
// Author: Jacqueline Gracey
// Date:4/7/23

// NOTE: This is how we might start a basic JavaaScript OOP project

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file


function main() {
  const fillers = {
    chest: ["Barbell Bench Press", "Dumbbell Bench", "Push-Ups", "Dips"],
    chest2: ["Incline Bench Press", "Dumbbell Flyes", "Cable Crossover"],
    back: ["Lat Pull-Downs", "Pull-Ups", "Bent-Over Barbell Rows"],
    back2: ["Back Extension", "Low Rows", "Deadlifts"],
    legs: ["Barbell Squats", "Lunges", "Leg Press"],
    legs2 :["Romanian Deadlifts", "Hamstring Curls", "Glute Drive"],
    legs3 :["Calf Raises", "Leg Extension"],
    shoulder: ["Overhead Barbell Press", "Dumbbell Shoulder Press", "Lateral Raises", "Front Raises", "Arnold Press", "Face Pulls"],
    biceps: ["Dumbbell Bicep Curl", "Preacher Curl", "Hammer Curl", "Cable Bicep Curl"],
    triceps: ["Tricep Rope Pushdowns", "Skull Crushers", "Diamond Push-ups", "Overhead Tricep Extension"],
    cardio: ["Stair Climbers", "Inclined Treadmill", "Elliptical", "Biking"],
  };
  
  const template = ` 
  Hello Gym Goer! Choose which day you want:
  
  \tChest and Back Day: 4 sets $chest, 3 sets $chest2, 4 sets $back,
  3 sets $back2.
  
  \tLeg Day: 4 sets $legs, 4 sets $legs2, 3 sets $legs3
  
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
    $("#box").text(story);
  }
  
  /* global clicker */
  $("#clicker").click(generate);
  
  generate();
  
}

// let's get this party started - uncomment me
main();
