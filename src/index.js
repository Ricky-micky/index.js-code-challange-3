document.addEventListener("DOMContentLoaded", () => {
  let currentMovieId;
  let currentTicketsSold;
  let currentCapacity;
  // Function to fetch movie details
  function getMovieDetails() {
    // Adjusting the URL to my local 
      fetch('http://localhost:3000/films/1') 
          .then(response => response.json())
          .then(movie => {
             // Store the current movie ID
              currentMovieId = movie.id;
              // Store the current tickets sold
              currentTicketsSold = movie.tickets_sold; 
              // Store the current capacity
              currentCapacity = movie.capacity; 
               // Call the new function to update movie details
              updateMovieDetails(movie);
          })
          .catch(error => console.error('Error fetching movie details:', error));
  }
  // Function to update movie details in the DOM
  function updateMovieDetails(movie) {
      const availableTickets = movie.capacity - movie.tickets_sold;
      //should Update the DOM with movie details...
      document.getElementById('movie-title').textContent = movie.title;
      document.getElementById('movie-runtime').textContent = movie.runtime;
      document.getElementById('movie-showtime').textContent = movie.showtime;
      document.getElementById('movie-tickets').textContent = availableTickets;
      document.getElementById('film-info').textContent = movie.description;
      document.getElementById('movie-poster').src = movie.poster;
      // Adding event listener to work with the buy button
      const buyButton = document.getElementById("buy-ticket");
      buyButton.onclick = () => {
          if (availableTickets > 0) {
              updateTicketsSold(currentMovieId, currentTicketsSold + 1);
          } else {
              alert('No tickets available for this movie.');
          }
      };
  }
  // letting a Function to fetch all movies and populate the menu
  function getAllMovies() {
     // match the URL with your local URL 
      fetch('http://localhost:3000/films') 
          .then(response => response.json())
          .then(movies => {
 const filmsList = document.getElementById('films');
filmsList.innerHTML = '';
 // Loop movie data and create a list of item for through  each movie
  movies.forEach(movie => {
  const li = document.createElement('li');
li.classList.add('film', 'item');
 li.textContent = movie.title;
//subjoin  a click event to load the movie details when clicked
 li.addEventListener('click', () => displayMovieDetails(movie));
 //track on list item to the films menu
filmsList.appendChild(li);
 });
})
.catch(error => console.error('Error fetching movies:', error));
  }
  // assigning a function to display movie details
  function displayMovieDetails(movie) {
    // Accumilate the current movie ID
      currentMovieId = movie.id; 
      // Store the current tickets sold
      currentTicketsSold = movie.tickets_sold;
       //  in the movie-details section the current capacity
      currentCapacity = movie.capacity;
      // Calling new function to update all movie details
      updateMovieDetails(movie); 
  }
  //keeping a Function to update tickets sold on the server
  function updateTicketsSold(movieId, newTicketsSold) {
 fetch(`http://localhost:3000/films/${movieId}`, {
  method: 'PATCH',
  headers: {
     'Content-Type': 'application/json',
    },
    body: JSON.stringify({
  tickets_sold: newTicketsSold,
    }),
      })
      .then(response => response.json())
      .then(updatedMovie => {
          // Update UI after ticket purchasing
          currentTicketsSold = updatedMovie.tickets_sold; // Amend current tickets sold
          const availableTickets = updatedMovie.capacity - updatedMovie.tickets_sold;
          document.getElementById('movie-tickets').textContent = availableTickets;
          // Unfit button if sold out
          document.getElementById('buy-ticket').disabled = availableTickets <= 0;
          if (availableTickets <= 0) {
              alert('Tickets sold out!');
          } else {
              alert('Ticket purchased successfully!');
          }
      })
      .catch(error => console.error('Error updating tickets sold:', error));
  }
  // Fetch all movies and populate the menu when the page loads
  getAllMovies();
  // calling function....
  getMovieDetails();
});