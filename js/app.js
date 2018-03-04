(function() {
  'use strict';

  const movies = [];

  const renderMovies = function() {
    $('#listings').empty();

    for (const movie of movies) {
      const $col = $('<div>').addClass('col s6');
      const $card = $('<div>').addClass('card hoverable');
      const $content = $('<div>').addClass('card-content center');
      const $title = $('<h6>').addClass('card-title truncate');

      $title.attr({
        'data-position': 'top',
        'data-tooltip': movie.title
      });

      $title.tooltip({ delay: 50 }).text(movie.title);

      const $poster = $('<img>').addClass('poster');

      $poster.attr({
        src: movie.poster,
        alt: `${movie.poster} Poster`
      });

      $content.append($title, $poster);
      $card.append($content);

      const $action = $('<div>').addClass('card-action center');
      const $plot = $('<a>');

      $plot.addClass('waves-effect waves-light btn modal-trigger');
      $plot.attr('href', `#${movie.id}`);
      $plot.text('Plot Synopsis');

      $action.append($plot);
      $card.append($action);

      const $modal = $('<div>').addClass('modal').attr('id', movie.id);
      const $modalContent = $('<div>').addClass('modal-content');
      const $modalHeader = $('<h4>').text(movie.title);
      const $movieYear = $('<h6>').text(`Released in ${movie.year}`);
      const $modalText = $('<p>').text(movie.plot);

      $modalContent.append($modalHeader, $movieYear, $modalText);
      $modal.append($modalContent);

      $col.append($card, $modal);

      $('#listings').append($col);

      $('.modal-trigger').leanModal();
    }
  };

  function getPlot(imdbID) {
		return fetch(`https://omdb-api.now.sh/?i=${imdbID}`)
  			.then((res) => response.json())
        .then((data) => {
          let result = data.Plot;
          return result;
        });
	}

  // ADD YOUR CODE HERE NK
  // Listen for submissions on the search form. Prevent Default $action
  function getMovies(string) {
    fetch(`https://omdb-api.now.sh/?s=${string}`) // template literal
        .then(function(res) {
            return res.json();
        })

        .then(function(data) {
            for(let movie of data.Search) {
              movies.push(movie);
          }
        })

        .then(function() {
            for(let movie of movies) { // try different for loop?
              getPlot(movie.imdbID).then(result => {
                  movie.Plot = result;
              });
            }
        })

        .then(function() {
      				console.log(movies);
      				setTimeout(() => {
      					renderMovies();
      				}, 200);
      			});
    }

    let searchButton = document.getElementById('searchButton');
    let searchField = document.getElementById('search');

    searchButton.addEventListener('click', ev => {
          ev.preventDefault(); // if event does not get handled, default action should not be taken as it normally would.
          if(searchField.value) { // if anything is in searchField, it'll eval to true
              getMovies(searchField.value);
              searchField.value = '';
          }
    });
})();
