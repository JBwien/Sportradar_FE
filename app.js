document.addEventListener("DOMContentLoaded", () => {
  const app = document.getElementById("app");
  const calendarBtn = document.getElementById("calendar-view");
  const addEventBtn = document.getElementById("add-event-view");

  let events = [];
  let currentDate = new Date();
  let selectedSport = "All"; // Default sport filter

  // Initialize Events from Local Storage or JSON file
  const loadEvents = () => {
    const storedEvents = localStorage.getItem("events");
    if (storedEvents) {
      events = JSON.parse(storedEvents);
    } else {
      // Fetch events.json if no local storage
      fetch("events.json")
        .then((res) => res.json())
        .then((data) => {
          events = data;
          saveEventsToLocalStorage();
          loadCalendarView();
        });
    }
  };

  // Save Events to Local Storage
  const saveEventsToLocalStorage = () => {
    localStorage.setItem("events", JSON.stringify(events));
  };

  // Fade-in Effect
  const fadeInContent = (container) => {
    container.style.opacity = "0";
    container.style.transform = "translateY(10px)";
    setTimeout(() => {
      container.style.transition = "all 0.5s ease";
      container.style.opacity = "1";
      container.style.transform = "translateY(0)";
    }, 50);
  };

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
        <select id="sport-filter">
          <option value="All">All Sports</option>
        </select>
      </div>
      <div class="calendar"></div>
    `;

    fadeInContent(app); // Apply fade-in effect

    const calendar = document.querySelector(".calendar");
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const yearSelect = document.getElementById("year-select");
    yearSelect.innerHTML = ""; // Populate year dropdown
    for (let year = 2000; year <= 2030; year++) {
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

    // Populate sport filter
    const sportFilter = document.getElementById("sport-filter");
    const sports = [...new Set(events.map((event) => event.sport))];
    sports.forEach((sport) => {
      const option = document.createElement("option");
      option.value = sport;
      option.textContent = sport;
      sportFilter.appendChild(option);
    });

    sportFilter.value = selectedSport; // Set current filter
    sportFilter.addEventListener("change", (e) => {
      selectedSport = e.target.value;
      loadCalendarView();
    });

    // Populate days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const dayElement = document.createElement("div");
      dayElement.classList.add("day");
      dayElement.textContent = day;

      const dateString = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      let dayEvents = events.filter((event) => event.date === dateString);

      // Apply sport filter
      if (selectedSport !== "All") {
        dayEvents = dayEvents.filter((event) => event.sport === selectedSport);
      }

      if (dayEvents.length > 0) {
        const marker = document.createElement("div");
        marker.classList.add("event-marker");
        dayElement.addEventListener("click", () => showEventDetails(dayEvents));
        dayElement.appendChild(marker);
      }

      calendar.appendChild(dayElement);
    }

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
    fadeInContent(app); // Apply fade-in effect
    eventDetails.forEach((event) => {
      const detailDiv = document.createElement("div");
      detailDiv.innerHTML = `
        <h3>${event.sport}: ${event.teams}</h3>
        <p>Date: ${event.date}</p>
        <p>Time: ${event.time}</p>
        <p><strong>Description:</strong> ${event.description}</p>
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
        <textarea id="event-description" placeholder="Description" rows="4" required></textarea>
        <button type="submit">Add Event</button>
      </form>
    `;

    fadeInContent(app); // Apply fade-in effect

    document.getElementById("add-event-form").addEventListener("submit", (e) => {
      e.preventDefault();

      const newEvent = {
        date: document.getElementById("event-date").value,
        time: document.getElementById("event-time").value,
        sport: document.getElementById("event-sport").value,
        teams: document.getElementById("event-teams").value,
        description: document.getElementById("event-description").value,
      };

      events.push(newEvent);
      saveEventsToLocalStorage(); // Save to local storage
      alert("Event added!");
      loadCalendarView();
    });
  };

  // Navigation
  calendarBtn.addEventListener("click", loadCalendarView);
  addEventBtn.addEventListener("click", loadAddEventView);

  // Initialize
  loadEvents();
});
