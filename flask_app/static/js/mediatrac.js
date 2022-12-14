// swiper carosel

var swiper = new Swiper(".watching-content", {
    slidesPerView:1,
    spaceBetween: 10,
    autoplay: {
        delay: 6666,
        disableOnInteraction: false,
    },
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
    breakpoints:{
        280:{
            slidesPerView:1,
            spaceBetween: 10,
        },
        320:{
            slidesPerView:2,
            spaceBetween: 10,
        },
        510:{
            slidesPerView:2,
            spaceBetween: 10,
        },
        758:{
            slidesPerView:3,
            spaceBetween: 15,
        },
        900:{
            slidesPerView:4,
            spaceBetween: 10,
        }
    }
});

// // Tooltip
// $(document).ready(function(){
//     $('[data-toggle="tooltip"]').tooltip();   
// });



//IMDB API
const showSearchBox = document.getElementById("showSearchBox");
const searchList = document.getElementById("searchList");
const resultGrid = document.getElementById("resultGrid");

// fetch movie data from IMDb API
async function fetchshows(movie_title){
    const URL = `http://www.omdbapi.com/?s=${movie_title}&page=1&apikey=daf864d9`;
    const res = await fetch(`${URL}`);
    const data = await res.json();
    // console.log(data); => Response: "True"; Search: "list of movies finded"; TotalResults: "number"
    if(data.Response == "True"){
        displayShowList(data.Search); //grab the list of movies
    }
}

//this function will be called when the user key in letter into search bar
function findShows(){
    //OMDb API is capital letter insensitive so just need to trim the space
    let searchTerm = (showSearchBox.value).trim();
    //Hide the search list container when there is no input
    if(searchTerm.length == 0){
        //hideSearchList == display: none (in css)
        searchList.classList.add('hideSearchList');
    } else{
        searchList.classList.remove('hideSearchList');
        fetchshows(searchTerm)
    }
}

// Here, parameter "shows" are a list of movies fetched from API in JSON format
function displayShowList(shows){
    searchList.innerHTML = "";
    for(let i = 0; i < shows.length; i++){
        let showListItem = document.createElement('div');
        // grab the imdb ID from each movie
        showListItem.dataset.id = shows[i].imdbID;
        showListItem.classList.add('searchListItem');
        //because some of the movie don't have poster
        if(shows[i].Poster != "N/A"){
            showPoster = shows[i].Poster;
        } else{
            showPoster = "https://cdn.dribbble.com/users/1208688/screenshots/4563859/no-found.gif"
        }

        //append the list of movies to the search List Item container
        showListItem.innerHTML = `
        <div class="searchItemThumbnail">
            <img src= ${showPoster} alt="image not available">
        </div>
        <div class="searchItemInfo">
            <h5>${shows[i].Title}</h5>
            <p>${shows[i].Year}</p>
        </div>
        `;
        searchList.appendChild(showListItem);
    }
    loadShowDetails();
}

//Add on-click event on search list items, in order to show the full movie info bellow, and meanwhile hide the search list item container
function loadShowDetails(){
    searchListShows = searchList.querySelectorAll('.searchListItem');
    searchListShows.forEach(show => {
        show.addEventListener('click', async () => {
            searchList.classList.add('hideSearchList')
            showSearchBox.value = ""
            const result = await fetch(`http://www.omdbapi.com/?i=${show.dataset.id}&apikey=daf864d9`)
            const showDetails = await result.json();
            console.log(showDetails);
            displayShowDetails(showDetails);
        })
    });
}

//print out movie details in the lower container
function displayShowDetails(details){
    resultGrid.innerHTML = `
    <form action="/add_show" method="post">
    <main class="homeContainer container">
        <div class="show-content-wrapper">
            <div class="showPoster">
                <img src="${details.Poster}" alt="Sorry, currently no poster for this movie">
                <input type="hidden" name="showPoster" value="${details.Poster}">
            </div>
            <div class="showInfo">
                <h3 class="showTitle">${details.Title} <span class="showYear">(${details.Year})</span></h3>
                <input type="hidden" name="showYear" value="${details.Year}">
                <input type="hidden" name="showTitle" value="${details.Title}">
                <div class="showTinyInfo">
                    <div class="rated"><span class="badge rounded-pill text-bg-secondary">${details.Rated}</span> </div>
                    <input type="hidden" name="showAgeGroup" value="${details.Rated}">
                    <div class="runtime"><span class="badge rounded-pill text-bg-secondary">${details.Runtime}</span></div>
                    <div class="type"><span class="badge rounded-pill text-bg-secondary">${details.Type}</span> </div>
                    <input type="hidden" name="showType" value="${details.Type}">
                    <input type="hidden" name="showRuntime" value="${details.Runtime}">
                </div>
                <p class="writer"><b>Writer:</b> ${details.Writer}</p>
                <input type="hidden" name="showWriter" value="${details.Writer}">
                <p class="actors"><b>Actors:</b> ${details.Actors}</p>
                <input type="hidden" name="showActors" value="${details.Actors}">
                <p class="genre"><b>Genre:</b> ${details.Genre}</p>
                <input type="hidden" name="showGenre" value="${details.Genre}">
                <p class="country"><b>Country:</b> ${details.Country}</p>
                <input type="hidden" name="showCountry" value="${details.Country}">
                <p class="language"><b>Language:</b> ${details.Language}</p>
                <input type="hidden" name="showLanguage" value="${details.Language}">
                <p class="released"><b>Released:</b> ${details.Released}</p>
                <input type="hidden" name="showReleased" value="${details.Released}">
                <p class="boxOffice"><b>Box office:</b> ${details.BoxOffice}</p>
                <input type="hidden" name="showBoxOffice" value="${details.BoxOffice}">
                <p class = "awards"><b><i class = "fas fa-award"></i></b> <span class="badge rounded-pill text-bg-warning">${details.Awards}</span>
                </p>
                <input type="hidden" name="showAwards" value="${details.Awards}">
                <input type="hidden" name="imdbID" value="${details.imdbID}">
            </div>
            <div class="showRatingBox">
                <p class="rating"><b>imdb Rating:</b> <i class='bx bxs-star'></i> ${details.imdbRating} /10</p>
                <input type="hidden" name="imdbRating" value="${details.imdbRating}">
                <div class="user_interaction">
                    <input name="submit_button" value="Want" type="submit" class="btn btn-light">
                    <a class="btn btn-light" data-bs-toggle="modal" data-bs-target="#Watching_modal">Watching</a>
                    <a class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#Watched_modal">Watched</a>
                </div>
            </div>
        </div>

        <div class="plot-wrapper">
            <div class="heading">
                <h2 class="heading-title">Story</h2>
            </div>
            <p>${details.Plot}</p>
            <input type="hidden" name="showPlot" value="${details.Plot}">
        </div>

    </main>

    <form action="/add_show" method="post">
        <div class="modal fade" id="Watching_modal" role="dialog">
            <div class="modal-dialog modal-sm modal-dialog-centered">
                <div class="modal-content" style="background: rgb(26, 25, 25);">
                    <div class="modal-header">
                        <h5 class="modal-title" id="modal-title">Watching...</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <label for="modal-season" class="form-label">Season</label>
                        <input type="number" class="form-control" id="modal-season" name="season" value="1">
                        <label for="modal-episode" class="form-label">Episode</label>
                        <input type="number" class="form-control" id="modal-episode" name="episode" value="1">
                    </div>
                    <div class="modal-footer">
                        <button type="submit" class="btn btn-secondary">It's a movie!</button>
                        <button type="submit" class="btn btn-success">Add</button>
                    </div>
                </div>
            </div>
        </div>
        <input type="hidden" name="showPoster" value="${details.Poster}">
        <input type="hidden" name="showYear" value="${details.Year}">
        <input type="hidden" name="showTitle" value="${details.Title}">
        <input type="hidden" name="showRuntime" value="${details.Runtime}">
        <input type="hidden" name="showCountry" value="${details.Country}">
        <input type="hidden" name="showReleased" value="${details.Released}">
        <input type="hidden" name="showGenre" value="${details.Genre}">
        <input type="hidden" name="imdbID" value="${details.imdbID}">
        <input type="hidden" name="imdbRating" value="${details.imdbRating}">
        <input type="hidden" name="showType" value="${details.Type}">
        
        <input type="hidden" name="showPlot" value="${details.Plot}">
        <input type="hidden" name="showAwards" value="${details.Awards}">
        <input type="hidden" name="showBoxOffice" value="${details.BoxOffice}">
        <input type="hidden" name="showLanguage" value="${details.Language}">
        <input type="hidden" name="showActors" value="${details.Actors}">
        <input type="hidden" name="showWriter" value="${details.Writer}">
        <input type="hidden" name="showAgeGroup" value="${details.Rated}">
        <input type="hidden" name="submit_button" value="Watching">
    </form>

    <form action="/add_show" method="post">
        <div class="modal fade" id="Watched_modal" role="dialog">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content" style="background: rgb(26, 25, 25);">
                    <div class="modal-header">
                        <h5 class="modal-title" id="modal-title">Rate and Comment</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <label for="modal-rate" class="form-label">Rate (out of 10)</label>
                        <input type="number" class="form-control" id="modal-rate" name="user_rating" value="">
                        <label for="modal-comment" class="form-label">Comment</label>
                        <textarea name="comment" id="modal-comment" cols="20" rows="4" class="form-control"></textarea>
                    </div>
                    <div class="modal-footer">
                        <button type="submit" class="btn btn-success">Submit</button>
                    </div>
                </div>
            </div>
        </div>
        <input type="hidden" name="showPoster" value="${details.Poster}">
        <input type="hidden" name="showYear" value="${details.Year}">
        <input type="hidden" name="showTitle" value="${details.Title}">
        <input type="hidden" name="showRuntime" value="${details.Runtime}">
        <input type="hidden" name="showCountry" value="${details.Country}">
        <input type="hidden" name="showReleased" value="${details.Released}">
        <input type="hidden" name="showGenre" value="${details.Genre}">
        <input type="hidden" name="imdbID" value="${details.imdbID}">
        <input type="hidden" name="imdbRating" value="${details.imdbRating}">
        <input type="hidden" name="showType" value="${details.Type}">
        <input type="hidden" name="showPlot" value="${details.Plot}">
        <input type="hidden" name="showAwards" value="${details.Awards}">
        <input type="hidden" name="showBoxOffice" value="${details.BoxOffice}">
        <input type="hidden" name="showLanguage" value="${details.Language}">
        <input type="hidden" name="showActors" value="${details.Actors}">
        <input type="hidden" name="showWriter" value="${details.Writer}">
        <input type="hidden" name="showAgeGroup" value="${details.Rated}">
        <input type="hidden" name="submit_button" value="Watched">
    </form>
    `;
}

window.addEventListener('click', (event) => {
    if(event.target.className != "form-control"){
        searchList.classList.add('hideSearchList');
    }
})


