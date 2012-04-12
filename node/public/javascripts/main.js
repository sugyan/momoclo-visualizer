$(function () {
    var data = [];
    var key = '0Ahc45BnJXcJzdENmSnlWVDF3bW1WanNReDMzUEtYY0E';
    $.ajaxSetup({
        data: {
            alt: 'json-in-script'
        },
        dataType: 'jsonp'
    });
    $.ajax({
        url: 'http://spreadsheets.google.com/feeds/worksheets/' + key + '/public/values',
        success: function (res) {
            $.each(res.feed.entry, function (i, e) {
                var worksheet = e.id.$t.split('/').pop();
                $.ajax({
                    url: 'http://spreadsheets.google.com/feeds/list/' + key + '/' + worksheet + '/public/values',
                    success: function (res) {
                        data.push(res);
                        if (data.length >= 5) {
                            renderChart(data);
                        }
                    }
                });
            });
        },
        error: function (xhr, err) {
            console.error(err);
        }
    });
});

function renderChart (data) {
    var flags = [];
    var series = $.map(data, function (e) {
        var name = e.feed.title.$t;
        var color = {
            momota  : '#FF0000',
            ariyasu : '#00FF00',
            tamai   : '#FFFF00',
            sasaki  : '#FF00FF',
            takagi  : '#800080'
        }[name];
        return {
            name: name,
            color: color,
            data: $.map(e.feed.entry.reverse(), function (e) {
                if (Number(e.gsx$count.$t > 1000)) {
                    flags.push({
                        type: 'flags',
                        color: color,
                        data: [{
                            x: new Date(e.gsx$date.$t).getTime(),
                            y: Number(e.gsx$count.$t),
                            title: e.gsx$count.$t
                        }],
                        name: e.gsx$title.$t
                    });
                }
                return {
                    x: new Date(e.gsx$date.$t).getTime(),
                    y: Number(e.gsx$count.$t)
                };
            })
        };
    });
    window.chart = new Highcharts.StockChart({
	chart : {
	    renderTo: 'container',
            backgroundColor: 'gray',
            height: $(window).get(0).innerHeight - 25
	},
	rangeSelector: {
	    selected: window.location.hash === '#all' ? 5 : 1
	},
	title: {
	    text : 'comment count'
	},
        yAxis: {
            min: 0
        },
	series: series.concat(flags)
    });    
}
