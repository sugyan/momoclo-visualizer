$(function () {
    var initialized = false;
    var member = { momota: 0, ariyasu: 1, tamai: 2, sasaki: 3, takagi: 4 };
    var chart = new Highcharts.StockChart({
        chart: {
            renderTo: 'chart',
            backgroundColor: '#404040',
            height: 500
        },
	rangeSelector: {
	    enabled: false
	},
        xAxis: {
            dateTimeLabelFormats: {
                day: '%Y年<br>%m月%d日'
            },
            events: {
                setExtremes: function (event) {
                    if (initialized) {
                        $('#x-min').val(moment(event.min).format('YYYY-MM-DD'));
                        $('#x-max').val(moment(event.max).format('YYYY-MM-DD'));
                    }
                }
            }
        },
        yAxis: {
            min: 0
        },
        navigator: {
            xAxis: {
                dateTimeLabelFormats: {
                    week: '%m月%d日'
                }
            }
        },
        colors: [
            'red',
            'green',
            'yellow',
            'pink',
            'purple'
        ],
        series: [
            { name: 'momota'  },
            { name: 'ariyasu' },
            { name: 'tamai'   },
            { name: 'sasaki'  },
            { name: 'takagi'  }
        ]
    });
    $.getJSON('/api/blog_comments', function (res) {
        var max_datetime = 0;
        $.each(res, function (key, value) {
            chart.series[member[key]].setData($.map(value, function (e) {
                if (e.created_at > max_datetime) {
                    max_datetime = e.created_at;
                }
                return {
                    x: e.created_at * 1000,
                    y: e.count
                };
            }));
        });
        var from = moment($('#x-min').val());
        var to   = moment($('#x-max').val());
        if (to.unix() > max_datetime) {
            to = new Date(max_datetime * 1000);
        }
        chart.xAxis[0].setExtremes(from.valueOf(), to.valueOf());

        initialized = true;
    });

    // bootstrap
    $('form').tooltip({
        selector: '.tt',
        title: function () {
            var color = $(this).data('color');
            var name  = $(this).data('color-name');
            return $('<div>').append(
                $('<div>').css({
                    'color': color,
                    'font-weight': 'bold',
                    'font-size': 'large'
                }).text(name)
            ).html();
        }
    });
});
