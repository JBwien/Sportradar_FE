Event Calendar Application
This is a web-based event calendar application where you can view, add, and filter events by sport. The application uses local storage to save events, so they persist even after refreshing the page.

Features:

	View Events on a Calendar:

		Displays events for the selected month.
		Highlights days with events.


	Add an event by providing:
		Date and time.
		Sport type.
		Teams/participants.
		Description.
	
 Filter by Sport:

		Filter events by selecting a sport from the dropdown menu.
	
 Persistent Storage:

	Events are saved in the browser’s local storage.
	Events remain available until manually deleted or local storage is cleared.
	
 
How to Use

	Load the provided Link:
	 https://sportradar-fe.netlify.app/

	Navigate the Calendar:

		Use the "Previous" and "Next" buttons to navigate between months.
		Select a year using the dropdown menu.
	Add an Event:

	Click the "Add Event" button.
	Fill in the form with event details.
	Submit to save the event.
Filter Events:

	Use the dropdown menu at the top of the calendar to filter events by sport.
View Event Details:

Click on a highlighted day in the calendar to view events for that day.


Project Structure
	index.html: The main HTML file.
	styles.css: Contains the styles for the application.
	script.js: Contains all the JavaScript logic.
	events.json: Initial event data (used if local storage is empty).
