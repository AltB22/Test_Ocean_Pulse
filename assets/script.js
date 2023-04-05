const searchWeatherButton = document.getElementById("search-by-city-button");
const clearCityHistoryButton = document.getElementById("clear-history-btn");
let cityHistoryArr = [];
let surfSpot = "";
let currentSurfSpot = ""; // Define currentSurfSpot as a global variable

function getCardinalDirection(degrees) {
    const degreeRanges = [
        { direction: "N", range: [0, 11.25] },
        { direction: "NNE", range: [11.25, 33.75] },
        { direction: "NE", range: [33.75, 56.25] },
        { direction: "ENE", range: [56.25, 78.75] },
        { direction: "E", range: [78.75, 101.25] },
        { direction: "ESE", range: [101.25, 123.75] },
        { direction: "SE", range: [123.75, 146.25] },
        { direction: "SSE", range: [146.25, 168.75] },
        { direction: "S", range: [168.75, 191.25] },
        { direction: "SSW", range: [191.25, 213.75] },
        { direction: "SW", range: [213.75, 236.25] },
        { direction: "WSW", range: [236.25, 258.75] },
        { direction: "W", range: [258.75, 281.25] },
        { direction: "WNW", range: [281.25, 303.75] },
        { direction: "NW", range: [303.75, 326.25] },
        { direction: "NNW", range: [326.25, 348.75] },
        { direction: "N", range: [348.75, 360] },
    ];

    for (let i = 0; i < degreeRanges.length; i++) {
        if (degrees >= degreeRanges[i].range[0] && degrees < degreeRanges[i].range[1]) {
            return degreeRanges[i].direction;
        }
    }
    return "N"; // default direction if degrees is not within any of the defined ranges
}


function handleSearchButton(event) {
    event.preventDefault();

    surfSpot = document.getElementById("searched-city-input").value;

    if (surfSpot) {
        getSurfReport(surfSpot);
    } else {
        prompt("Surf spot search field required");
    }
}

async function getSurfReport(surfSpot) {
    let lat = "";
    let lng = "";
    let params = "swellHeight,swellPeriod,swellDirection,windSpeed,windDirection";
    let source = "noaa";
    switch (surfSpot) {
        case "Ocean Beach","ocean beach","San Francisco","san francisco":
            lat = 37.75545;
            lng = -122.5292;
          
        case "Ruggles","ruggles","Newport","newport":
           lat = 41.37268;
           lng = -71.2410;
           
    }


    const response = await fetch(
        `https://api.stormglass.io/v2/weather/point?lat=${lat}&lng=${lng}&params=${params}&source=${source}`,
        {
            headers: {
                Authorization:
                    "5c5365e4-a940-11ed-a138-0242ac130002-5c53665c-a940-11ed-a138-0242ac130002",
            },
        }
    );

    const surfReport = await response.json();
    currentSurfSpot = surfSpot; // Assign the value of surfSpot to currentSurfSpot
    renderSurfForecast(surfReport);
    return surfReport;
}


function renderSurfForecast(surfReport) {
    const currentSurfReportElement = document.getElementById("current-surf-report");

    if (surfReport && surfReport.hours && surfReport.hours.length > 0) {
        const currentTimePeriod = surfReport.hours[0];
        const currentSwellHeight = Math.ceil(3.28 * currentTimePeriod.swellHeight.noaa);
        const currentSwellPeriod = Math.ceil(currentTimePeriod.swellPeriod.noaa);
        const currentSwellDirection = currentTimePeriod.swellDirection.noaa;
        const currentWindSpeed = Math.ceil(currentTimePeriod.windSpeed.noaa);
        const currentWindDirection = currentTimePeriod.windDirection.noaa;
        const currentSurfReportHTML =
            `<h2>${currentSurfSpot}</h2>
      <p>Swell Height: ${currentSwellHeight}ft.</p>
      <p>Swell Period: @ ${currentSwellPeriod} secs</p>
      <p>Swell Direction (of origin): ${getCardinalDirection(currentSwellDirection)}</p>
      <p>Wind: ${currentWindSpeed} mph from the ${getCardinalDirection(currentWindDirection)}</p>`


        currentSurfReportElement.innerHTML = currentSurfReportHTML;
    } else {
        currentSurfReportElement.innerHTML = "No surf report available";
    }
}

searchWeatherButton.addEventListener("click", handleSearchButton);


