$(function () {
    var member = { momota: 0, ariyasu: 1, tamai: 2, sasaki: 3, takagi: 4 };
    var chart = new Highcharts.StockChart({
        chart: {
            renderTo: 'chart',
            backgroundColor: '#404040',
            height: 500
        },
        xAxis: {
            dateTimeLabelFormats: {
                day: '%Y年<br>%m月%d日'
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
        $.each(res, function (key, value) {
            chart.series[member[key]].setData($.map(value, function (e) {
                return {
                    x: new Date(e.created_at * 1000),
                    y: e.count
                };
            }));
        });
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
