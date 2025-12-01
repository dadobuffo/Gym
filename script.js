// Workout data - you can easily modify or extend this
const workoutData = {
  workoutA: {
    title: "Workout A",
    focus: "Chest & Triceps",
    exercises: [
      {
        name: "Bench Press",
        muscle: "Chest",
        sets: 4,
        reps: "8-10",
        weight: 60,
        unit: "kg",
      },
      {
        name: "Incline Dumbbell Press",
        muscle: "Upper Chest",
        sets: 3,
        reps: "10-12",
        weight: 22,
        unit: "kg",
      },
      {
        name: "Cable Flyes",
        muscle: "Chest",
        sets: 3,
        reps: "12-15",
        weight: 15,
        unit: "kg",
      },
      {
        name: "Triceps Pushdown",
        muscle: "Triceps",
        sets: 3,
        reps: "12-15",
        weight: 20,
        unit: "kg",
      },
      {
        name: "Overhead Triceps Extension",
        muscle: "Triceps",
        sets: 3,
        reps: "10-12",
        weight: 15,
        unit: "kg",
      },
    ],
  },
  workoutB: {
    title: "Workout B",
    focus: "Back & Biceps",
    exercises: [
      {
        name: "Pull-ups",
        muscle: "Back",
        sets: 4,
        reps: "8-10",
        weight: 0,
        unit: "bodyweight",
      },
      {
        name: "Bent Over Rows",
        muscle: "Back",
        sets: 3,
        reps: "10-12",
        weight: 50,
        unit: "kg",
      },
      {
        name: "Lat Pulldown",
        muscle: "Back",
        sets: 3,
        reps: "10-12",
        weight: 40,
        unit: "kg",
      },
      {
        name: "Barbell Curl",
        muscle: "Biceps",
        sets: 3,
        reps: "10-12",
        weight: 25,
        unit: "kg",
      },
      {
        name: "Hammer Curl",
        muscle: "Biceps",
        sets: 3,
        reps: "12-15",
        weight: 12,
        unit: "kg",
      },
    ],
  },
  workoutC: {
    title: "Workout C",
    focus: "Legs & Shoulders",
    exercises: [
      {
        name: "Squats",
        muscle: "Legs",
        sets: 4,
        reps: "8-10",
        weight: 80,
        unit: "kg",
      },
      {
        name: "Leg Press",
        muscle: "Legs",
        sets: 3,
        reps: "10-12",
        weight: 100,
        unit: "kg",
      },
      {
        name: "Leg Curl",
        muscle: "Hamstrings",
        sets: 3,
        reps: "12-15",
        weight: 30,
        unit: "kg",
      },
      {
        name: "Shoulder Press",
        muscle: "Shoulders",
        sets: 3,
        reps: "10-12",
        weight: 30,
        unit: "kg",
      },
      {
        name: "Lateral Raises",
        muscle: "Shoulders",
        sets: 3,
        reps: "12-15",
        weight: 10,
        unit: "kg",
      },
      {
        name: "Calf Raises",
        muscle: "Calves",
        sets: 4,
        reps: "15-20",
        weight: 50,
        unit: "kg",
      },
    ],
  },
};

// DOM elements
const workoutSelector = document.querySelector(".workout-selector");
const workoutDetails = document.getElementById("workoutDetails");
const workoutTitle = document.getElementById("workoutTitle");
const workoutFocus = document.getElementById("workoutFocus");
const exercisesContainer = document.getElementById("exercisesContainer");
const backButton = document.getElementById("backButton");
const totalExercises = document.getElementById("totalExercises");
const totalSets = document.getElementById("totalSets");
const completeWorkoutBtn = document.getElementById("completeWorkout");
const currentDate = document.getElementById("currentDate");
const currentYear = document.getElementById("currentYear");

// Template for exercise cards
const exerciseTemplate = document.getElementById("exerciseTemplate");

// State variables
let currentWorkout = null;
let isWorkoutView = false;

// Initialize the app
function initApp() {
  // Set current date
  const today = new Date();
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  currentDate.textContent = today.toLocaleDateString("en-US", options);

  // Set current year in footer
  currentYear.textContent = today.getFullYear();

  // Add event listeners to workout buttons
  document
    .getElementById("workoutA")
    .addEventListener("click", () => showWorkout("workoutA"));
  document
    .getElementById("workoutB")
    .addEventListener("click", () => showWorkout("workoutB"));
  document
    .getElementById("workoutC")
    .addEventListener("click", () => showWorkout("workoutC"));

  // Add event listener to back button
  backButton.addEventListener("click", hideWorkout);

  // Add event listener to complete workout button
  completeWorkoutBtn.addEventListener("click", completeWorkout);

  // Handle browser back button
  window.addEventListener("popstate", handlePopState);

  // Handle initial page load
  handleInitialLoad();

  // Listen for Enter key to save inputs
  document.addEventListener("keydown", (e) => {
    if (
      e.key === "Enter" &&
      document.activeElement.classList.contains("input-field")
    ) {
      document.activeElement.blur();
    }
  });
}

// Handle browser back button
function handlePopState(event) {
  if (isWorkoutView) {
    hideWorkout();
  }
}

// Handle initial page load
function handleInitialLoad() {
  const hash = window.location.hash.substring(1);

  if (hash && workoutData[hash]) {
    showWorkout(hash);
  } else {
    history.replaceState({ view: "home" }, "", "#home");
  }
}

// Show workout details
function showWorkout(workoutId) {
  const workout = workoutData[workoutId];

  if (!workout) return;

  currentWorkout = workoutId;
  isWorkoutView = true;

  // Update workout header
  workoutTitle.textContent = workout.title;
  workoutFocus.textContent = `Focus: ${workout.focus}`;

  // Clear previous exercises
  exercisesContainer.innerHTML = "";

  // Generate exercise cards
  let totalSetsCount = 0;

  workout.exercises.forEach((exercise, index) => {
    const exerciseCard = createExerciseCard(exercise, index);
    exercisesContainer.appendChild(exerciseCard);
    totalSetsCount += exercise.sets;
  });

  // Update summary
  totalExercises.textContent = workout.exercises.length;
  totalSets.textContent = totalSetsCount;

  // Show workout details and hide selector
  workoutSelector.classList.add("hidden");
  workoutDetails.classList.remove("hidden");

  // Add to browser history
  history.pushState(
    { workout: workoutId, view: "workout" },
    "",
    `#${workoutId}`
  );

  // Scroll to top
  window.scrollTo(0, 0);
}

// Create exercise card from template and data
function createExerciseCard(exercise, index) {
  // Clone the template
  const card = exerciseTemplate.content.cloneNode(true);

  // Get elements from the cloned template
  const exerciseCard = card.querySelector(".exercise-card");
  const exerciseName = card.querySelector(".exercise-name");
  const exerciseMuscle = card.querySelector(".exercise-muscle");
  const setsInput = card.querySelector(".sets-input");
  const repsInput = card.querySelector(".reps-input");
  const weightInput = card.querySelector(".weight-input");
  const notesTextarea = card.querySelector("textarea");

  // Set exercise data
  exerciseName.textContent = exercise.name;
  exerciseMuscle.textContent = exercise.muscle;

  // Load saved data or use defaults
  const savedData = loadExerciseData(exercise.name);

  if (savedData) {
    // Use saved data
    setsInput.value = savedData.sets || exercise.sets;
    repsInput.value = savedData.reps || exercise.reps;
    weightInput.value =
      savedData.weight || `${exercise.weight} ${exercise.unit}`;
    notesTextarea.value = savedData.notes || "";
  } else {
    // Use default data
    setsInput.value = exercise.sets;
    repsInput.value = exercise.reps;
    weightInput.value = `${exercise.weight} ${exercise.unit}`;
  }

  // Add event listeners for inputs
  setsInput.addEventListener("focus", (e) => e.target.select());
  repsInput.addEventListener("focus", (e) => e.target.select());
  weightInput.addEventListener("focus", (e) => e.target.select());

  // Save data when input loses focus
  setsInput.addEventListener("blur", () => saveExerciseData(exercise.name));
  repsInput.addEventListener("blur", () => saveExerciseData(exercise.name));
  weightInput.addEventListener("blur", () => saveExerciseData(exercise.name));
  notesTextarea.addEventListener("input", () =>
    saveExerciseData(exercise.name)
  );

  // Also save on Enter key
  setsInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      saveExerciseData(exercise.name);
      e.target.blur();
    }
  });

  repsInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      saveExerciseData(exercise.name);
      e.target.blur();
    }
  });

  weightInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      saveExerciseData(exercise.name);
      e.target.blur();
    }
  });

  // Update total sets when sets input changes
  setsInput.addEventListener("blur", updateTotalSets);

  return exerciseCard;
}

// Save exercise data to localStorage
function saveExerciseData(exerciseName) {
  // Find the exercise card
  const exerciseCards = document.querySelectorAll(".exercise-card");

  exerciseCards.forEach((card) => {
    const nameElement = card.querySelector(".exercise-name");
    if (nameElement.textContent === exerciseName) {
      const setsInput = card.querySelector(".sets-input");
      const repsInput = card.querySelector(".reps-input");
      const weightInput = card.querySelector(".weight-input");
      const notesTextarea = card.querySelector("textarea");

      // Get all exercise data
      const exerciseData = JSON.parse(
        localStorage.getItem("workoutData") || "{}"
      );

      // Update data for this exercise
      exerciseData[exerciseName] = {
        sets: setsInput.value,
        reps: repsInput.value,
        weight: weightInput.value,
        notes: notesTextarea.value,
        lastUpdated: new Date().toISOString(),
      };

      // Save to localStorage
      localStorage.setItem("workoutData", JSON.stringify(exerciseData));

      console.log(`Saved data for ${exerciseName}`);
    }
  });
}

// Load exercise data from localStorage
function loadExerciseData(exerciseName) {
  const exerciseData = JSON.parse(localStorage.getItem("workoutData") || "{}");
  return exerciseData[exerciseName] || null;
}

// Update total sets count
function updateTotalSets() {
  if (!isWorkoutView) return;

  let total = 0;
  const setsInputs = document.querySelectorAll(".sets-input");

  setsInputs.forEach((input) => {
    const value = parseInt(input.value) || 0;
    total += value;
  });

  totalSets.textContent = total;
}

// Hide workout details and show selector
function hideWorkout() {
  isWorkoutView = false;
  currentWorkout = null;

  workoutDetails.classList.add("hidden");
  workoutSelector.classList.remove("hidden");

  // Add home state to history
  history.pushState({ view: "home" }, "", "#home");
}

// Complete workout function
function completeWorkout() {
  alert("Great job! Workout completed. Your data has been saved.");
  hideWorkout();
}

// Initialize app when DOM is loaded
document.addEventListener("DOMContentLoaded", initApp);
