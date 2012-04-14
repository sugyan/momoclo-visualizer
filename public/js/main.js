Highcharts.setOptions({
    global: {
	useUTC: false
    }
});

$(function () {
    $.getJSON('/api/all',function (res) {
        var series = $.map([0, 1, 2, 3, 4], function (i) {
            return {
                color: ['#FF0000', '#00FF00', '#FFFF00', '#FF00FF', '#800080'][i],
                name: ['momota', 'ariyasu', 'tamai', 'sasaki', 'takagi'][i],
                data: $.map(res[i + 1], function (e) {
                    return {
                        x: e.datetime * 1000,
                        y: e.count
                    };
                })
            };
        });
        var chart = new Highcharts.StockChart({
	    chart: {
	        renderTo: 'container',
                backgroundColor: '#404040'
	    },
	    title: {
	        text: 'ブログコメント数',
                style: {
                    color: '#FFFFFF'
                }
	    },
	    rangeSelector: {
	        selected: 1
	    },
            yAxis: {
                min: 0
            },
	    series: series
        });
    });
});
