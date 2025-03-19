const button = {
  happy: document.getElementById("happy"),
  sad: document.getElementById("sad"),
  angry: document.getElementById("angry"),
  excited: document.getElementById("excited"),
  neutral: document.getElementById("neutral"),
  tired: document.getElementById("tired"),
  stressed: document.getElementById("stressed"),
  loved: document.getElementById("loved"),
  bored: document.getElementById("bored"),
};

// Store the current year and month for navigation
let currentDate = new Date();

// Mapping of mood to emoji
const moodToEmoji = {
  happy: "😊",
  sad: "☹️",
  angry: "😡",
  excited: "😎",
  neutral: "😐",
  tired: "😴",
  stressed: "😰",
  loved: "❤️",
  bored: "😑",
};

const moodToColor = {
  happy: "#f9e79f", // Yellow for happy
  sad: "#aed6f1", // Blue for sad
  angry: "#e74c3c", // Red for angry
  excited: "#f39c12", // Orange for excited
  neutral: "#d5dbdb", // Gray for neutral
  tired: "#f4e1d2", // Light brown for tired
  stressed: "#f1948a", // Light red for stressed
  loved: "#f5b7b1", // Light pink for loved
  bored: "#d0d3d4", // Light gray for bored
};

// Create Calendar
function createCalendar() {
  const calendarContainer = document.getElementById("calendar");
  const monthYearDisplay = document.getElementById("month-year");

  const currentMonth = currentDate.getMonth(); // Current month (0-11)
  const currentYear = currentDate.getFullYear();

  // Get the first and last days of the current month
  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);

  // Get the number of days in the month
  const totalDays = lastDay.getDate();

  // Set the month-year text
  monthYearDisplay.textContent = `${firstDay.toLocaleString("default", {
    month: "long",
  })} ${currentYear}`;

  // Clear the calendar container
  calendarContainer.innerHTML = "";

  // Create the day labels for the calendar
  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  dayLabels.forEach((day) => {
    const dayLabel = document.createElement("div");
    dayLabel.textContent = day;
    calendarContainer.appendChild(dayLabel);
  });

  // Add blank spaces for days before the first of the month
  for (let i = 0; i < firstDay.getDay(); i++) {
    const emptyDiv = document.createElement("div");
    calendarContainer.appendChild(emptyDiv);
  }

  // Add day numbers to the calendar
  for (let i = 1; i <= totalDays; i++) {
    const dayDiv = document.createElement("div");
    dayDiv.textContent = i;
    dayDiv.setAttribute("data-day", i);

    // Highlight the current day
    if (
      i === new Date().getDate() &&
      currentMonth === new Date().getMonth() &&
      currentYear === new Date().getFullYear()
    ) {
      dayDiv.classList.add("current-day");
    }

    // Get the mood for the day from localStorage
    const moodHistory = JSON.parse(localStorage.getItem("moodHistory")) || [];
    const formattedDate = new Date(
      currentYear,
      currentMonth,
      i
    ).toLocaleDateString();
    const moodForDay = moodHistory.find(
      (entry) => entry.date === formattedDate
    );

    // Change the background of the day based on the mood
    if (moodForDay) {
      const mood = moodForDay.mood;
      dayDiv.style.backgroundColor = moodToColor[mood] || "#ffffff"; // Default to white if no matching mood
    }

    // Display emoji for the day if it exists in localStorage
    if (moodForDay) {
      const emoji = document.createElement("span");
      emoji.classList.add("mood-emoji");
      emoji.textContent = moodToEmoji[moodForDay.mood];
      dayDiv.appendChild(emoji);
    }

    dayDiv.addEventListener("click", () => selectDay(i, formattedDate));
    calendarContainer.appendChild(dayDiv);
  }
}

// Select a day to view or set the mood
function selectDay(day, formattedDate) {
  const selectedDate = new Date();
  selectedDate.setDate(day);

  const moodHistory = JSON.parse(localStorage.getItem("moodHistory")) || [];
  const moodForDay = moodHistory.find((entry) => entry.date === formattedDate);

  const moodMessage = moodForDay
    ? `Your mood on ${formattedDate} is: ${moodForDay.mood}`
    : `No mood recorded for ${formattedDate}. Set your mood now!`;

  document.getElementById("mood-for-day").textContent = moodMessage;

  // Store selected day in the local storage to remember the mood for the date
  localStorage.setItem("selectedDay", formattedDate);
}

// Function to handle mood button clicks and save mood to localStorage
function handleButtonClick(mood) {
  const selectedDate = new Date();
  const formattedDate = selectedDate.toLocaleDateString();

  // Store the mood and date in localStorage
  const moodHistory = JSON.parse(localStorage.getItem("moodHistory")) || [];
  const moodIndex = moodHistory.findIndex(
    (entry) => entry.date === formattedDate
  );

  if (moodIndex > -1) {
    moodHistory[moodIndex].mood = mood;
  } else {
    moodHistory.push({ date: formattedDate, mood });
  }

  localStorage.setItem("moodHistory", JSON.stringify(moodHistory));

  // Add mood to history with a delete button
  addToHistory(mood, formattedDate);

  // Update the mood message
  selectDay(selectedDate.getDate(), formattedDate); // Refresh the displayed mood for the selected day
  createCalendar(); // Refresh the calendar to show the selected mood emoji and color
}

// Function to add mood to the history list with a delete button
function addToHistory(mood, formattedDate) {
  const moodHistoryList = document.getElementById("mood-list");

  const li = document.createElement("li");
  li.textContent = `${moodToEmoji[mood]} ${mood}`;

  const span = document.createElement("span");
  span.classList.add("timestamp");
  span.textContent = new Date().toLocaleString();
  li.appendChild(span);

  // Create and add delete button to the mood entry
  const delButton = document.createElement("button");
  delButton.classList.add("delete-button");
  delButton.title = "Delete the mood";
  li.appendChild(delButton);

  // Delete the selected mood from history and localStorage
  delButton.addEventListener("click", () => {
    const moodHistory = JSON.parse(localStorage.getItem("moodHistory")) || [];
    const updatedHistory = moodHistory.filter(
      (entry) => entry.date !== formattedDate
    );
    localStorage.setItem("moodHistory", JSON.stringify(updatedHistory));
    li.remove();
    createCalendar(); // Re-render the calendar after deletion
  });

  moodHistoryList.prepend(li); // Prepend the mood entry to the list
}

// Loop through all the buttons and add an event listener
Object.keys(button).forEach((mood) => {
  button[mood].addEventListener("click", () => {
    handleButtonClick(mood);
  });
});

// Function to go to the next month
document.getElementById("next-month").addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  createCalendar();
});

// Function to go to the previous month
document.getElementById("prev-month").addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  createCalendar();
});

// Initialize the calendar
createCalendar();
