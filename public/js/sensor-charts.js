let lastDate = 0;
let dataX = [];
let dataY = [];
let dataZ = [];
let TICKINTERVAL = 86400000;
let XAXISRANGE = 777600000;

function getDayWiseTimeSeries(baseval, count, yrange) {
	let i = 0;
	while (i < count) {
		let x = baseval;
		let y = Math.floor(Math.random() * (yrange.max - yrange.min + 1)) +
			yrange.min;
		dataX.push({x, y});
		y = Math.floor(Math.random() * (yrange.max - yrange.min + 1)) +
			yrange.min;
		dataY.push({x, y});
		y = Math.floor(Math.random() * (yrange.max - yrange.min + 1)) +
			yrange.min;
		dataZ.push({x, y});
		lastDate = baseval;
		baseval += TICKINTERVAL;
		i++;
	}
}

getDayWiseTimeSeries(new Date('11 Feb 2017 GMT').getTime(), 10,
	{
		min: 10,
		max: 90,
	});

function getNewSeries(baseval, yrange) {
	let newDate = baseval + TICKINTERVAL;
	lastDate = newDate;

	for (let i = 0; i< dataX.length - 10; i++) {
		// IMPORTANT
		// we reset the x and y of the data which is out of drawing area
		// to prevent memory leaks
		dataX[i].x = newDate - XAXISRANGE - TICKINTERVAL;
		dataX[i].y = 0;
		dataY[i].x = newDate - XAXISRANGE - TICKINTERVAL;
		dataY[i].y = 0;
		dataZ[i].x = newDate - XAXISRANGE - TICKINTERVAL;
		dataZ[i].y = 0;
	}

	dataX.push({
		x: newDate,
		y: Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min,
	});
	dataY.push({
		x: newDate,
		y: Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min,
	});
	dataZ.push({
		x: newDate,
		y: Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min,
	});
}

/*
function resetData() {
	// Alternatively, you can also reset the data at certain
	// intervals to prevent creating a huge series
	dataX = dataX.slice(dataX.length - 10, dataX.length);
}
*/

$(document).ready(function() {
	let options = {
		series: [{
			data: dataX,
		},
		{
			data: dataY,
		},
		{
			data: dataZ,
		}],
		chart: {
			id: 'realtime',
			height: 350,
			width: '50%',
			type: 'line',
			animations: {
				enabled: true,
				easing: 'linear',
				dynamicAnimation: {
					speed: 1000,
				},
			},
			toolbar: {
				show: false,
			},
			zoom: {
				enabled: false,
			},
		},
		dataLabels: {
			enabled: false,
		},
		stroke: {
			curve: 'smooth',
		},
		title: {
			text: 'Vibration chart',
			align: 'left',
		},
		markers: {
			size: 0,
		},
		xaxis: {
			type: 'datetime',
			range: XAXISRANGE,
		},
		yaxis: {
			max: 100,
			min: 0,
		},
		legend: {
			show: false,
		},
	};

	let vibrationChart =
		new ApexCharts(document.querySelector('#vibration-chart'), options);
	vibrationChart.render();

	window.setInterval(function() {
		getNewSeries(lastDate, {
			min: 10,
			max: 90,
		});

		vibrationChart.updateSeries([{
			data: dataX,
		},
		{
			data: dataY,
		},
		{
			data: dataZ,
		}]);
	}, 1000);

	let socket = io();
	socket.on('sensor', function(obj) {
		console.log(obj);
	});
});
