const key = "e6e2603e227b47a2f1a1b17ad72df419";
let city = "Dallas";
const mydate = moment().format('dddd');
const curtime = moment().format('LT')
const dateTime = moment().format('YYYY-MM-DD HH:MM')
const cardTime = $('.time').text(curtime);
const cardTodayBody = $('.cardBodyToday');
const fiveForecastEl = $('.fiveDayForecast');

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

function getWeather() {
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
		let pEl = $('<p>').text(`Temperature: ${response.main.temp} °F`);
		cardTodayBody.append(pEl);
		let pElHumid = $('<p>').text(`Humidity: ${response.main.humidity} %`);
		cardTodayBody.append(pElHumid);
		let pElWind = $('<p>').text(`Wind Speed: ${response.wind.speed} MPH`);
		cardTodayBody.append(pElWind);
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
		const  myWeather = [];

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

			//Temp
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

function PlaceholderLoad() {

	const cityHistStore = JSON.parse(localStorage.getItem('city'));

	if (cityHistStore !== null) {
		cityHist = cityHistStore
	}
	getWeather();
};

PlaceholderLoad();