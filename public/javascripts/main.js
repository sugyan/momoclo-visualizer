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
        error: function (xhr, error) {
            console.err(error);
        }
    });
});

function renderChart (data) {
    var series = $.map(data, function (e) {
        var name = e.feed.title.$t;
        return {
            name: name,
            color: {
                '赤': '#FF0000',
                '緑': '#00FF00',
                '黄': '#FFFF00',
                '桃': '#FF00FF',
                '紫': '#800080'
            }[name],
            data: $.map(e.feed.entry.reverse(), function (e) {
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
            backgroundColor: 'lightgray'
	},
	rangeSelector: {
	    selected: 1
	},
	title: {
	    text : 'comment count'
	},
	series: series
    });    
}
