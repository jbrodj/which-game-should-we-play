const app = {} /* namespace object */

const clientId = '4uDiIV1cKZ'

// User Inputs (The values passed to the query need to be above or below the user selection because there's no option for equal to+greater than in the API. So the values are offset by 0.1 on the range inputs to make the query inclusive of the value selected.)
const playersSlider = document.getElementById('playerSliderInput'); /* Variable containing players input */
const playersDisplay = document.getElementById('playersDisplay'); /* Variable to display value of players input */
playersDisplay.innerHTML = Math.floor(playersSlider.value); /* Round the value to nearest integer for display */

playersSlider.oninput = function() { /* When slider is moved, update the value the user sees*/
    playersDisplay.innerHTML = Math.floor(this.value);
}
const timeSlider = document.getElementById('timeSliderInput'); /* Variable containing the time input */
const timeDisplay = document.getElementById('timeDisplay'); /* Variable to display the value of time input */
timeDisplay.innerHTML = Math.floor(timeSlider.value);

timeSlider.oninput = function() { /* When slider is moved, update the value the user sees*/
    timeDisplay.innerHTML= Math.floor(this.value);
}
const minTimeSlider = document.getElementById('minTimeSliderInput'); /* Variable containing the time input */
const minTimeDisplay = document.getElementById('minTimeDisplay'); /* Variable to display the value of time input */
minTimeDisplay.innerHTML = Math.ceil(minTimeSlider.value);

minTimeSlider.oninput = function() { /* When slider is moved, update the value the user sees */
    minTimeDisplay.innerHTML= Math.ceil(this.value);
}

const ageSlider = document.getElementById('ageSliderInput'); /* Variable containing the time input */
const ageDisplay = document.getElementById('ageDisplay'); /* Variable to display the value of time input */
ageDisplay.innerHTML = Math.floor(ageSlider.value);

ageSlider.oninput = function(event) { /* When slider is moved, update the value the user sees */
    ageDisplay.innerHTML= Math.floor(this.value);
}

// // User Inputs (The values passed to the query need to be above or below the user selection because there's no option for equal to+greater than in the API. So the values are offset by 0.1 on the range inputs to make the query inclusive of the value selected.)
// const $playersSlider = $('#playerSliderInput'); /* Variable containing players input */
// const playersDisplay = document.getElementById('playersDisplay'); /* Variable to display value of players input */
// playersDisplay.innerHTML = Math.floor($playersSlider.value); /* Round the value to nearest integer for display */
// // const $playersDisplay = $('#playersDisplay'); /* Variable to display value of players input */
// console.log(playersDisplay)

// // console.log($('#playersDisplay').innerHTML)
// // console.log(Math.floor($playersSlider[0].value))

// // $playersSlider.oninput = function() { /* When slider is moved, update the value the user sees*/
// //     $playersDisplay.text = Math.floor(this[0].value);
// // }
// // console.log($playersDisplay)
// // console.log($playersDisplay[0].id.text)
// const $timeSlider = $('#timeSliderInput'); /* Variable containing the time input */
// const $timeDisplay = $('#timeDisplay'); /* Variable to display the value of time input */
// $timeDisplay.innerHTML = Math.floor($timeSlider[0].value);

// $timeSlider.oninput = function() { /* When slider is moved, update the value the user sees*/
//     $timeDisplay.innerHTML= Math.floor(this[0].value);
// }
// const $minTimeSlider = $('#minTimeSliderInput'); /* Variable containing the time input */
// const $minTimeDisplay = $('#minTimeDisplay'); /* Variable to display the value of time input */
// $minTimeDisplay.innerHTML = Math.ceil($minTimeSlider[0].value);

// $minTimeSlider.oninput = function() { /* When slider is moved, update the value the user sees */
//     $minTimeDisplay.innerHTML= Math.ceil(this[0].value);
// }

// const $ageSlider = $('#ageSliderInput'); /* Variable containing the time input */
// const $ageDisplay = $('#ageDisplay'); /* Variable to display the value of time input */
// $ageDisplay.innerHTML = Math.floor($ageSlider[0].value);

// $ageSlider.oninput = function() { /* When slider is moved, update the value the user sees */
//     $ageDisplay.innerHTML= Math.floor(this[0].value);
// }


// ajax call for the api
app.gameFinder = function () {
    $.ajax({
        url: `https://api.boardgameatlas.com/api/search`,
        method: 'GET',
        dataType: 'JSON',
        data: {
            client_id: clientId,
            fields: 'name,description,categories,rank,year_published,min_players,max_players,min_playtime,max_playtime,min_age,url',
            lt_min_age: ageSlider.value,
            gt_max_players: playersSlider.value,
            lt_min_players: playersSlider.value,
            lt_max_playtime: timeSlider.value,
            gt_min_playtime: minTimeSlider.value,
            order_by: 'rank',
        }
    }).then(function(result) {
        const searchResult = result.games
        app.displayGame(searchResult) 
    })
}

// function for displaying results - runs for each item in the search results
app.displayGame = function(resultItems) {

    const noResHtml = `
        <p>Sorry, there aren't any games that meet those criteria. Try another search!</p>
    `
    resultItems.forEach (function(item) {

        const resultHtml = `
        <h3>🎲 ${item.name} (${item.year_published}) 🎲</h3>
        <ul>
            <li>Age ${item.min_age} and up</li>
            <li>${item.min_players} to ${item.max_players} players</li>
            <li>Playtime: ${item.min_playtime} to ${item.max_playtime} minutes</li>
            <li>See this game on <a href="${item.url}" target="_blank">Board Game Atlas</a></li>
        </ul>
        <div class="descDiv">
            <h4>Game Description</h4>
            ${item.description}
        </div>`

        $('.searchResults').removeClass('hide'); /* display the article element in the search results */
        $('.resultHeading').removeClass('hide'); /* display the h2 in the search results */
        $('.resultAppend').append(resultHtml); /* adds the html to the result section*/
    })

// Error message printed to results section if the returned array has zero items. 
    if (resultItems.length === 0) {
        $('.searchResults').removeClass('hide'); /* display the article element in the search results */
        $('.resultHeading').addClass('hide'); /* display the h2 in the search results */
        $('.resultAppend').append(noResHtml) /* display error message in the search results */
    }
}

// Separate api function to run the random game generator
app.gameRandom = function () {
    $.ajax({
        url: `https://api.boardgameatlas.com/api/search`,
        method: 'GET',
        dataType: 'JSON',
        data: {
            client_id: clientId,
            random: 'true',
            fields: 'name,description,categories,rank,year_published,min_players,max_players,min_playtime,max_playtime,min_age,url'
        }
    }).then(function(result) {
        const randomResult = result.games
        app.displayRandomGame(randomResult)
    })
}

// function for displaying results of the random generator
app.displayRandomGame = function(resultRandom) {
    resultRandom.forEach (function(item) {
        const randomHtml = `
        <h3 class="randomGame">${item.name} (${item.year_published})</h3>
        <ul>
            <li>Age ${item.min_age} and up</li>
            <li>${item.min_players} to ${item.max_players} players</li>
            <li>Playtime: ${item.min_playtime} to ${item.max_playtime} minutes</li>
            <li>See this game on <a href="${item.url}" target="_blank">Board Game Atlas</a></li>
        </ul>
        <div>
            <h4>Game Description</h4>
            ${item.description}
        </div>`
        $('.randomAppend').append(randomHtml)
    })
}

app.init = function () { /* initializer */

    // Event listener for main form submit
    $('.formButton').on('click', function(event) { /* runs gameFinder on button click */
        event.preventDefault();
        $('.resultAppend').empty(); /* Clear the results section each time the form submits*/

        const minNum = parseInt(minTimeSlider.value)
        const maxNum = parseInt(timeSlider.value) /* Convert time slider values to integers so they can be compared below */
        console.log($playersSlider.value)
        if (minNum > maxNum) {
            $('.resultHeading').empty(); /* Clear the results heading if this error occurs*/
            alert(`Oops! Maximum game time must be greater than minimum game time! :)`)

            return /* end the function if the if statment executes - prevents the app from running a queery with bad inputs */
        }

        app.gameFinder()
    })

    // event listener for random button submit
    $('#randomButton').on('click', function(event) { /* run gameRandom when the random button is clicked */
        event.preventDefault();
        $('.randomAppend').empty();
        app.gameRandom()
    })
}

$(function() {  /* document ready */
    app.init()
})