$(function () {
    var member = { momota: 0, ariyasu: 1, tamai: 2, sasaki: 3, takagi: 4 };
    var chart = new Highcharts.StockChart({
        chart: {
            renderTo: 'chart'
        },
        colors: ['#FF0000', '#00FF00', '#FFFF00', '#FF00FF', '#800080'],
        series: [{}, {}, {}, {}, {}]
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
});
