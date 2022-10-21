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
        <div class="showPoster">
            <img src="${details.Poster}" alt="Sorry, currently no poster for this movie">
            <input type="hidden" name="showPoster" value="${details.Poster}">
            <div>
                <input name="submit_button" value="Want" type="submit" class="btn btn-success">
                <a class="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#Watching_modal">Watching</a>
                <a class="btn btn-outline-success" data-bs-toggle="modal" data-bs-target="#Watched_modal">Watched</a>
            </div>
        </div>
        <div class="showInfo">
            <h3 class="showTitle">${details.Title}</h3><h3 class="showYear"> (${details.Year})</h3>
            <input type="hidden" name="showYear" value="${details.Year}">
            <input type="hidden" name="showTitle" value="${details.Title}">
            <ul class="showTinyInfo">
                <li class="rated">Rating: ${details.Rated}</li>
                <li class="runtime">Runtime: ${details.Runtime}</li>
                <input type="hidden" name="showRuntime" value="${details.Runtime}">
            </ul>
            <p class="type"><b>Type:</b> ${details.Type}</p>
            <input type="hidden" name="showType" value="${details.Type}">
            <p class="writer"><b>Writer:</b> ${details.Writer}</p>
            <p class="actors"><b>Actors:</b> ${details.Actors}</p>
            <p class="Plot"><b>Plot:</b> ${details.Plot}</p>
            <p class="country"><b>Country:</b> ${details.Country}</p>
            <input type="hidden" name="showCountry" value="${details.Country}">
            <p class="released"><b>Released:</b> ${details.Released}</p>
            <input type="hidden" name="showReleased" value="${details.Released}">
            <p class="language"><b>Language:</b> ${details.Language}</p>
            <p class="genre"><b>Genre:</b> ${details.Genre}</p>
            <input type="hidden" name="showGenre" value="${details.Genre}">
            <p class="boxOffice"><b>Box office:</b> ${details.BoxOffice}</p>
            <p class = "awards"><b><i class = "fas fa-award"></i></b> ${details.Awards}</p>
            <input type="hidden" name="imdbID" value="${details.imdbID}">
        </div>
        <div class="showRatingBox">
            <p class="rating"><b>imdb Rating:</b> <i class='bx bxs-star'></i> ${details.imdbRating} /10</p>
            <input type="hidden" name="imdbRating" value="${details.imdbRating}">
            <p class="myRating"><b>My Rating:</b> <i class='bx bxs-star'></i> Null </p>
        </div>
    </form>

    <form action="/add_show" method="post">
        <div class="modal fade" id="Watching_modal" role="dialog">
            <div class="modal-dialog modal-sm modal-dialog-centered">
                <div class="modal-content">
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
        <input type="hidden" name="submit_button" value="Watching">
    </form>

    <form action="/add_show" method="post">
        <div class="modal fade" id="Watched_modal" role="dialog">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
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
        <input type="hidden" name="submit_button" value="Watched">
    </form>
    `;
}

window.addEventListener('click', (event) => {
    if(event.target.className != "form-control"){
        searchList.classList.add('hideSearchList');
    }
})




