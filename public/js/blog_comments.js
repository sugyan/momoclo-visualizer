Highcharts.setOptions({
    global: {
        useUTC: false
    }
});

$(function () {
    $.getJSON('/api/all',function (res) {
        var series = $.map([0, 1, 2, 3, 4], function (i) {
            return {
                color: ['red', 'green', 'yellow', 'pink', 'purple'][i],
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
	        renderTo: 'chart',
                backgroundColor: '#404040'
	    },
	    title: {
	        text: 'コメント数',
                style: {
                    color: '#808080'
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
        var refresh = function () {
            var param = {};
            var check = $('#customize input[type="checkbox"]').map(function (i, e) {
                var checked = $(e).attr('checked') ? true : false;
                if (checked ^ chart.series[i].visible) {
                    chart.series[i][checked ? 'show' : 'hide']();
                }
                return checked ? '1' : '0';
            }).toArray().join('');
            var max = $('#customize input[type="number"]').val();
            chart.yAxis[0].setExtremes(0, max || null);
            if (check !== '11111') {
                param.check = check;
            }
            if (max !== "") {
                param.max = max;
            }
            $('#permalink').val(location.origin + location.pathname + '?' + $.param(param));
        };
        $('#customize input[type="checkbox"]').change(refresh);
        $('#customize input[type="number"]').bind('input', refresh);
        $('#permalink').click(function () {
            this.select();
        });
        refresh();
    });
});
