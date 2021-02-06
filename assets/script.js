var weatherData
todaysForcast = document.getElementById('#todayWeather')
var units = 'metric'
var today
var search
var uvi
let cityList 
// Defining list of past searched cities
if( localStorage.cityList != undefined){
    cityList = JSON.stringify(localStorage.cityList)
    cityList = JSON.parse(localStorage.cityList)
} else{
cityList = []};

// clears local storage 
function clearPast(event){
    if (event) event.preventDefault()
    localStorage.clear()
    window.location.href = window.location.href
}

// returns the search input by user
function getSearch(event){
    if (event) event.preventDefault()
    $('#pastSearch').html('')
    $('#todayWeather').html('')
    $("#past")
    search = document.querySelector('#search').value
    
    doSearch(`${search}`)


    //determining if the search input is unique in local storage
    let isUnique = true
    if (cityList.length !=0) {
        for (i=0; i < cityList.length; i++){
        if (search == cityList[i]){
            isUnique = false;
        }else{
            isUnique = true;
        }
    }}
        if (isUnique){
            cityList.push(`${search}`)
            console.log('got to here')
            var x = JSON.stringify(cityList)
            localStorage.setItem('cityList', x)
        }else{
            console.log('f')
        }
    
    
    console.log(`${search}`)
}
// showing past input links 
function showSearch(){
    $('#pastSearch').html('')
    $('#todayWeather').html('')
   
    $.each(cityList, function( k, v ) {
        var thiscity = JSON.stringify(v)
        var indexPos = k
        console.log(thiscity)
        console.log(k)
        $('#pastSearch').append(` 
        <div><button type="button" onClick= 'doSearch(${thiscity})' class="btn btn-outline-secondary">${v}</button></div>
        `)
    });
    }
// obtaining data from openweathermap API
async function doSearch(search) {
    var mySearch = `https://api.openweathermap.org/data/2.5/weather?q=${search}&appid=c2345a6296a12669c7fc5e4a4fbb549c`
    currWeather = await fetch(mySearch).then(r => r.json());
    lat = currWeather.coord["lat"]
    lon = currWeather.coord["lon"]
    var getUVI = `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=c2345a6296a12669c7fc5e4a4fbb549c`
    var fiveDay = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&appid=c2345a6296a12669c7fc5e4a4fbb549c`
    weatherData = await fetch(fiveDay).then(r => r.json());
    uviData = await fetch(getUVI).then(r=>r.json());
    uvi = uviData.value
    today = weatherData.current
    showSearch()
    showCurrent()
    showFive()
}
var todayDate = moment().format('dddd, MMM Do YYYY');
// obtaining date info and showing the current weather for input city 
function showCurrent() {
    todayDate = moment().format('dddd, MMM Do YYYY');
    currTemp = today['temp']
   
    $('#todayWeather').html('')
     $('#todayWeather').append(`
    <div class="card-dark">
        <h1>Current Weather<h1>
        <div class="card-body" id ='currentWeather' width='70'>
            <h2>${todayDate}<h2>
            <img src='http://openweathermap.org/img/wn/${weatherData.current.weather[0].icon}@2x.png' alt='no icon' />

            <h4>Temperature: ${today['temp']}°c</h4>
            <h4>Humidity: ${today['humidity']}%</h4>
            <h4>Wind Speed:${Math.round((today['wind_speed'])*3.6)} KPH</h4>
            <h4>UV index:
                <span class="badge ${
                     uvi < 3 ? 'bg-success':
                     uvi >= 8 ? 'bg-danger':
                     'bg-warning'
                    }">${uvi}</span> </h4>
        </div>
    </div>`)
    $('#currentWeather').css('font-size', '20px')
    
}

      
var date
// obtaining datat and showing 5 day forcast
function showFive(){
$('#forcast').html('')
   for (i=1; i<=5; i++) {
     $('#forcast').append(`
    <div col-2 class="card" id='forcastCards' >
        <h6>${moment.unix(weatherData.daily[i].dt).format("dddd, MMM Do YYYY")}<h6>
        <div class="card-body" id ='futureWeather'style='font-size=12px' col-mb-auto>
            <img src='http://openweathermap.org/img/wn/${weatherData.daily[i].weather[0].icon}@2x.png' alt='no icon' />
            <p>Temperature: ${weatherData.daily[i].temp.day} °c</p>
            <p>Humidity: ${weatherData.daily[i].humidity}%</p>
            <p>Wind Speed: ${Math.round((weatherData.daily[i].wind_speed)*3.6)} KPH</p>
        </div>
    </div>`)
    
   
}
$('futureWeather').css('font-size', '12px')
};

showSearch()

