document.addEventListener("DOMContentLoaded", () => {
  const app = document.getElementById("app");
  const calendarBtn = document.getElementById("calendar-view");
  const addEventBtn = document.getElementById("add-event-view");

  let events = [];
  let currentDate = new Date();

  // Load events.json
  fetch("events.json")
    .then((res) => res.json())
    .then((data) => {
      events = data;
      loadCalendarView();
    });

  // Load Calendar View
  const loadCalendarView = () => {
    app.innerHTML = `
      <div id="calendar-controls">
        <button id="prev-month">Previous</button>
        <span id="current-month">${currentDate.toLocaleString("default", {
          month: "long",
        })}</span>
        <select id="year-select"></select>
        <button id="next-month">Next</button>
      </div>
      <div class="calendar"></div>
    `;

    const calendar = document.querySelector(".calendar");
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    // Populate year dropdown
    const yearSelect = document.getElementById("year-select");
    for (let year = 1990; year <= 2030; year++) {
      const option = document.createElement("option");
      option.value = year;
      option.textContent = year;
      if (year === currentYear) option.selected = true;
      yearSelect.appendChild(option);
    }

    yearSelect.addEventListener("change", (e) => {
      currentDate.setFullYear(parseInt(e.target.value, 10));
      loadCalendarView();
    });

    // Populate days in the calendar
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const dayElement = document.createElement("div");
      dayElement.classList.add("day");
      dayElement.textContent = day;

      // Erstellen des Datumsstrings ohne Zeitzonenverschiebung
      const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      
      const dayEvents = events.filter((event) => event.date === dateString);

      if (dayEvents.length > 0) {
        const marker = document.createElement("div");
        marker.classList.add("event-marker");
        dayElement.addEventListener("click", () => showEventDetails(dayEvents));
        dayElement.appendChild(marker);
      }

      calendar.appendChild(dayElement);
    }

    // Add Event Listeners for Month Navigation
    document.getElementById("prev-month").addEventListener("click", () => {
      currentDate.setMonth(currentDate.getMonth() - 1);
      loadCalendarView();
    });

    document.getElementById("next-month").addEventListener("click", () => {
      currentDate.setMonth(currentDate.getMonth() + 1);
      loadCalendarView();
    });
  };

  // Show Event Details
  const showEventDetails = (eventDetails) => {
    app.innerHTML = "";
    eventDetails.forEach((event) => {
      const detailDiv = document.createElement("div");
      detailDiv.innerHTML = `
        <h3>${event.sport}: ${event.teams}</h3>
        <p>Date: ${event.date}</p>
        <p>Time: ${event.time}</p>
      `;
      app.appendChild(detailDiv);
    });
  };

  // Add Event View
  const loadAddEventView = () => {
    app.innerHTML = `
      <form id="add-event-form">
        <input type="date" id="event-date" required />
        <input type="time" id="event-time" required />
        <input type="text" id="event-sport" placeholder="Sport" required />
        <input type="text" id="event-teams" placeholder="Teams/Participants" required />
        <button type="submit">Add Event</button>
      </form>
    `;

    document.getElementById("add-event-form").addEventListener("submit", (e) => {
      e.preventDefault();

      const newEvent = {
        date: document.getElementById("event-date").value,
        time: document.getElementById("event-time").value,
        sport: document.getElementById("event-sport").value,
        teams: document.getElementById("event-teams").value,
      };

      events.push(newEvent);
      alert("Event added!");
      loadCalendarView();
    });
  };

  // Navigation
  calendarBtn.addEventListener("click", loadCalendarView);
  addEventBtn.addEventListener("click", loadAddEventView);
});
