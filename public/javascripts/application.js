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
                        $('#x-min').val(moment(event.min).format('YYYY-MM-DD')).datepicker('update');
                        $('#x-max').val(moment(event.max).format('YYYY-MM-DD')).datepicker('update');
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
    // update functions
    var updateDateRange = function () {
        var min = moment($('#x-min').val());
        var max = moment($('#x-max').val());
        if (min.valueOf() < max.valueOf()) {
            chart.xAxis[0].setExtremes(min.valueOf(), max.valueOf());
        }
    };
    // get data from JSON API
    $.getJSON('/api/blog_comments', function (res) {
        $.each(res, function (key, value) {
            chart.series[member[key]].setData($.map(value, function (e) {
                return {
                    x: e.created_at * 1000,
                    y: e.count
                };
            }));
        });
        updateDateRange();
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
    // datepicker
    $('.datepicker')
        .datepicker({ format: 'yyyy-mm-dd' })
        .bind('changeDate change', function (event) {
            if (event.type === 'changeDate') {
                $(this).datepicker('hide').blur();
            }
            updateDateRange();
        });
});
