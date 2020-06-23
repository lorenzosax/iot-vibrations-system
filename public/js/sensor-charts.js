let myLineChart;
let lineChartData = {
	labels: [],
	datasets: [{
		label: 'x',
		borderColor: window.chartColors.red,
		backgroundColor: window.chartColors.red,
		fill: false,
		data: [],
		yAxisID: 'y-axis-1',
	}, {
		label: 'y',
		borderColor: window.chartColors.blue,
		backgroundColor: window.chartColors.blue,
		fill: false,
		data: [],
		yAxisID: 'y-axis-1'
	}, {
		label: 'z',
		borderColor: window.chartColors.yellow,
		backgroundColor: window.chartColors.yellow,
		fill: false,
		data: [],
		yAxisID: 'y-axis-1'
	}]
};

function stringToFormattedDate(dateString) {
	return new Date(dateString).toISOString()
		.replace(/T/, ' ')
		.replace(/\..+/, '');
}

function initDataForChart(data) {
	for (let i = 0; i < data.length; i++) {
		lineChartData.datasets[0].data.push(data[i].axes[0]);
		lineChartData.datasets[1].data.push(data[i].axes[1]);
		lineChartData.datasets[2].data.push(data[i].axes[2]);
		lineChartData.labels.push(stringToFormattedDate(data[i].createdAt));
	}
}

function createChart() {
	let ctx = document.getElementById('canvas').getContext('2d');
	myLineChart = Chart.Line(ctx, {
		data: lineChartData,
		options: {
			responsive: true,
			hoverMode: 'index',
			stacked: false,
			title: {
				display: true,
				text: 'Vibration chart',
				fontSize: 20,
			},
			scales: {
				yAxes: [{
					type: 'linear',
					display: true,
					position: 'left',
					id: 'y-axis-1',
					scaleLabel: {
						display: true,
						labelString: 'Acceleration (mg)',
						fontSize: 18,
					}
				}],
				xAxes: [{
					display: true,
					id: 'x-axis-1',
					scaleLabel: {
						display: true,
						labelString: 'Time',
						fontSize: 18,
					}
				}],
			}
		}
	});
}

function openSocket(callback) {
	let socket = io();
	socket.on('sensor', function(data) {
		callback(data);
	});
}

function callbackOnGetData(data) {
	lineChartData.labels.push(stringToFormattedDate(data.createdAt));
	lineChartData.labels.shift();
	lineChartData.datasets.forEach(function(dataset, index) {
		dataset.data.push(data.axes[index]);
		dataset.data.shift();
	});
	myLineChart.update();
}

$(document).ready(function() {
	let numInitialData = 200;
	$.ajax({
		url: '/vibration?last='+numInitialData,
		success: function(data) {
			initDataForChart(data);
			createChart();
			openSocket(callbackOnGetData);
		},
	});
});
