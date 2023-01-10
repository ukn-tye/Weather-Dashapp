const key = "e6e2603e227b47a2f1a1b17ad72df419";
let city = "Dallas";
const mydate = moment().format('dddd');
const curtime = moment().format('LT')
const dateTime = moment().format('YYYY-MM-DD HH:MM')
const cardTime = $('.time').text(curtime);
const cardTodayBody = $('.cardBodyToday');
const fiveForecastEl = $('.fiveDayForecast');
let icon = $('.icon');

let cityHist = [];

$('.search').on("click", function (event) {
	event.preventDefault();
	city = $(this).parent('.btnPar').siblings('.textVal').val().trim();
	if (city === "") {
		return;
	};
	cityHist.push(city);

	localStorage.setItem('city', JSON.stringify(cityHist));
	fiveForecastEl.empty();
	getHistory();
	getWeatherToday();
});

let contHistEl = $('.cityHist');
function getHistory() {
	contHistEl.empty();

	for (let i = 0; i < cityHist.length; i++) {

		let rowEl = $('<row>');
		let btnEl = $('<button>').text(`${cityHist[i]}`)

		rowEl.addClass('row histBtnRow');
		btnEl.addClass('btn btn-outline-secondary histBtn');
		btnEl.attr('type', 'button');

		contHistEl.prepend(rowEl);
		rowEl.append(btnEl);
	} if (!city) {
		return;
	}
};

function getWeatherToday() {
	let getUrlCurrent = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${key}`;

	$(cardTodayBody).empty();

	$.ajax({
		url: getUrlCurrent,
		method: 'GET',
	}).then(function (response) {
		$('.cardTodayCityName').text(response.name);
		$('.cardTodayDate').text(mydate);
		$('.cardTime').text(curtime);

        //icons
		var pEl = $('<p>').text(`Temperature: ${response.main.temp} °F`);
		cardTodayBody.append(pEl);
		var pElHumid = $('<p>').text(`Humidity: ${response.main.humidity} %`);
		cardTodayBody.append(pElHumid);
		var pElWind = $('<p>').text(`Wind Speed: ${response.wind.speed} MPH`);
		cardTodayBody.append(pElWind);
		let lon = response.coord.lon;;
		let lat = response.coord.lat;

		let getUrlUvi = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,daily,minutely&appid=${key}`;

		$.ajax({
			url: getUrlUvi,
			method: 'GET',
		}).then(function (response) {
			let pElUvi = $('<p>').text(`UV Index: `);
			let uviSpan = $('<span>').text(response.current.uvi);
			let uvi = response.current.uvi;
			pElUvi.append(uviSpan);
			cardTodayBody.append(pElUvi);

			if (uvi >= 0 && uvi <= 2) {
				uviSpan.attr('class', 'green');
			} else if (uvi > 2 && uvi <= 5) {
				uviSpan.attr("class", "yellow")
			} else if (uvi > 5 && uvi <= 7) {
				uviSpan.attr("class", "orange")
			} else if (uvi > 7 && uvi <= 10) {
				uviSpan.attr("class", "red")
			} else {
				uviSpan.attr("class", "purple")
			}
		});
	});
	getFiveDayForecast();
};


function getFiveDayForecast() {
	const getUrlFiveDay = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${key}`;

	$.ajax({
		url: getUrlFiveDay,
		method: 'GET',
	}).then(function (response) {
		const fiveDayArray = response.list;
		let myWeather = [];
		$.each(fiveDayArray, function (index, value) {
			testObj = {
				date: value.dt_txt.split(' ')[0],
				time: value.dt_txt.split(' ')[1],
				temp: value.main.temp,
				icon: value.weather[0].icon,
				humidity: value.main.humidity
				
			}
			console.log(response);
			if (value.dt_txt.split(' ')[1] === "12:00:00") {
				myWeather.push(testObj);
			}
		})
	
		for (let i = 0; i < myWeather.length; i++) {

			const divElCard = $('<div>');
			divElCard.attr('class', 'card text-white bg-darkGrey mb-3 cardOne text-center');
			divElCard.attr('style', 'max-width: 200px;');
			fiveForecastEl.append(divElCard);

			const divElHeader = $('<div>');
			divElHeader.attr('class', 'card-header space')
			const m = moment(`${myWeather[i].date}`).format('dddd');
			divElHeader.text(m);
			divElCard.append(divElHeader)

			const divElBody = $('<div>');
			divElBody.attr('class', 'card-body');
			divElCard.append(divElBody);

			const divElIcon = $('<img>');
			divElIcon.attr('class', 'icons');
			divElIcon.attr('src', `https://openweathermap.org/img/wn/${myWeather[i].icon}@2x.png`);
			divElBody.append(divElIcon);

			const pElTemp = $('<p>').text(`${myWeather[i].temp} °F`);
			divElBody.append(pElTemp);
			
		}
	});
};

function weatherDetails(response){

	const {id} = response.weather[0];

	if(id == 800){
		icon.src = "./assets/imgs/icons8-sun-96.png";
	}else if(id >= 200 && id <= 232){
		icon.src = "./assets/imgs/icons8-cloud-lightning-96.png";  
	}else if(id >= 600 && id <= 622){
		icon.src = "./assets/imgs/icons8-snow-96.png";
	}else if(id >= 701 && id <= 781){
		icon.src = "./assets/imgs/icons8-fog-96.png";
	}else if(id >= 801 && id <= 804){
		icon.src = "./assets/imgs/icons8-cloud-96.png";
	}else if((id >= 500 && id <= 531) || (id >= 300 && id <= 321)){
		icon.src = "./assets/imgs/icons8-torrential-rain-96.png";
	}
	
}


//Allows for the example data to load for Denver
function PlaceholderLoad() {

	const cityHistStore = JSON.parse(localStorage.getItem('city'));

	if (cityHistStore !== null) {
		cityHist = cityHistStore
	}
	getHistory();
	getWeatherToday();
};

PlaceholderLoad();