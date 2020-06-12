let dataX = [];
let dataY = [];
let dataZ = [];
let DAYRANGE = 86400000;
let XAXISRANGE = 3600000; // 60 min

let vibrationChart;

function calculateCorrectMaxAndMinYaxis() {
	let min = [];
	let max = [];
	min.push((_.min(dataX, function(o) {return o.y;})).y);
	min.push((_.min(dataY, function(o) {return o.y;})).y);
	min.push((_.min(dataZ, function(o) {return o.y;})).y);
	max.push((_.max(dataX, function(o) {return o.y;})).y);
	max.push((_.max(dataY, function(o) {return o.y;})).y);
	max.push((_.max(dataZ, function(o) {return o.y;})).y);
	vibrationChart.opts.yaxis[0].min = _.min(min);
	vibrationChart.opts.yaxis[0].max = _.max(max);
}

function prepopulateVibrationChart(count, data) {
	let i = 0;
	let now = Date.now();
	while (i < count) {
		let x = new Date(data[i].createdAt).getTime();
		if (now - x <= XAXISRANGE) {
			dataX.push({x, y:data[i].axes[0]});
			dataY.push({x, y:data[i].axes[1]});
			dataZ.push({x, y:data[i].axes[2]});
		}
		i++;
	}
	calculateCorrectMaxAndMinYaxis();
}

function putNewVibrationData(data) {
	/*
	let now = Date.now();
	for (let i = 0; i < dataX.length; i++) {
		// IMPORTANT
		// remove data which is out of drawing area
		// to prevent memory leaks
		if (now - dataX[i].x > XAXISRANGE) {
			dataX.shift();
			dataY.shift();
			dataZ.shift();
		} else {
			break;
		}
	}
	*/

	dataX.push({
		x: new Date(data.createdAt).getTime(),
		y: data.axes[0],
	});
	dataY.push({
		x: new Date(data.createdAt).getTime(),
		y: data.axes[1],
	});
	dataZ.push({
		x: new Date(data.createdAt).getTime(),
		y: data.axes[2],
	});
	calculateCorrectMaxAndMinYaxis();
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

	vibrationChart =
		new ApexCharts(document.querySelector('#vibration-chart'), options);

	let numInitialData = 30;
	$.ajax({
		url: '/vibrations?last='+numInitialData,
		success: function(data) {
			prepopulateVibrationChart(
				numInitialData,
				data);
			vibrationChart.render();
			let socket = io();
			socket.on('sensor', function(data) {
				putNewVibrationData(data);
				vibrationChart.updateSeries([{
					data: dataX,
				},
				{
					data: dataY,
				},
				{
					data: dataZ,
				}]);
			});
		},
	});
});
