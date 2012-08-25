$(function () {
    $.getJSON('/api/blog_comments', function (res) {
        var chart = new Highcharts.StockChart({
            chart: {
                renderTo: 'chart'
            },
	    series: $.map(res, function (array) {
                return {
                    data: $.map(array, function (e) {
                        return {
                            x: Date.parse(e.created_at),
                            y: e.count
                        };
                    })
                };
            })
        });
    });
});
