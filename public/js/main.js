$(function () {
    $.getJSON('/api/all',function (res) {
        var data = $.map(res[1], function (e) {
            return {
                x: e.datetime * 1000,
                y: e.count
            };
        });
        window.chart = new Highcharts.StockChart({
	    chart: {
	        renderTo: 'container',
                backgroundColor: '#404040'
	    },
	    title: {
	        text: 'ブログコメント数'
	    },
	    rangeSelector: {
	        selected: 1
	    },
	    series: [{
                color: '#FF0000',
                name: 'test',
                data: data
            }]
        });
    });
});
