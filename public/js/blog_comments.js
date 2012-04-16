Date.prototype.ymd = function () {
    var year  = this.getFullYear();
    var month = this.getMonth() + 1;
    var date  = this.getDate();
    return [
        year,
        (month < 10 ? '0' : '') + month,
        (date  < 10 ? '0' : '') + date
    ].join('-');
};

Highcharts.setOptions({
    global: {
        useUTC: false
    },
    lang: {
        shortMonths: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
    }
});

$(function () {
    var parseDate = function (input) {
        var i = 0, fmt = {};
        var format = 'yyyy-mm-dd';
        var parts = input.match(/(\d+)/g);
        format.replace(/(yyyy|dd|mm)/g, function (part) { fmt[part] = i++; });
        return new Date(parts[fmt['yyyy']], parts[fmt['mm']]-1, parts[fmt['dd']]);
    };
    var initialized = false;
    var updatePermalink = function () {
        var params = {
            from : $('.datetime').eq(0).val(),
            to   : $('.datetime').eq(1).val()
        };
        var max   = $('#range-max').val();
        var check = $('.checkbox input').map(function (i, e) {
            return $(e).attr('checked') ? '1' : '0';
        }).toArray().join('');

        if (max) {
            params.max = Number(max);
        }
        if (check !== '11111') {
            params.check = check;
        }
        $('#permalink').val(location.origin + location.pathname + '?' + $.param(params));
    };
    var chart = new Highcharts.StockChart({
	chart: {
	    renderTo: 'chart',
            backgroundColor: '#404040'
	},
        navigator: {
            xAxis: {
                dateTimeLabelFormats: {
                    week: '%b月%e日'
                }
            }
        },
        plotOptions: {
            series: {
                events: {
                    click: function (event) {
                        window.open(event.point.url, '_blank');
                    }
                }
            }
        },
	rangeSelector: {
	    enabled: false
	},
        xAxis: {
            dateTimeLabelFormats: {
                day: '%Y年<br>%b月%e日',
                week: '%Y年<br>%b月%e日'
            },
            events: {
                setExtremes: function (event) {
                    if (initialized) {
                        $('.datetime').eq(0).val(new Date(event.min).ymd());
                        $('.datetime').eq(1).val(new Date(event.max).ymd());
                        updatePermalink();
                    }
                }
            }
        },
        tooltip: {
            pointFormat: '<span style="color:{series.color}">{point.title}</span>: <b>{point.y}</b><br/>',
            backgroundColor: 'rgba(144, 144, 144, .95)',
            xDateFormat: '%Y年%b月%e日 %H:%M:%S'
        },
	series: [
            { color: 'red'    },
            { color: 'green'  },
            { color: 'yellow' },
            { color: 'pink'   },
            { color: 'purple' }
        ]
    });
    $.getJSON('/api/all', function (res) {
        var i, max_datetime = 0;
        for (i = 0; i < 5; i++) {
            chart.series[i].setData(
                $.map(res[i + 1], function (e) {
                    max_datetime = Math.max(max_datetime, e.datetime);
                    return {
                        x: e.datetime * 1000,
                        y: e.count,
                        url: e.url,
                        title: e.title
                    };
                })
            );
            if (! $('.checkbox input').eq(i).attr('checked')) {
                chart.series[i].hide();
            }
        }

        // xAxis
        var from = parseDate($('.datetime').eq(0).val());
        var to   = parseDate($('.datetime').eq(1).val());
        if (to.getTime() > max_datetime * 1000) {
            to = new Date(max_datetime * 1000);
        }
        chart.xAxis[0].setExtremes(from, to);
        // yAxis
        chart.yAxis[0].setExtremes(0, Number($('#range-max').val()) || null);

        updatePermalink();
        initialized = true;
    });

    // checkbox
    $('.checkbox input').change(function () {
        var index   = $(this).index('.checkbox input');
        var checked = $(this).attr('checked') ? true : false;
        if (checked ^ chart.series[index].visible) {
            chart.series[index][checked ? 'show' : 'hide']();
        }
        updatePermalink();
    });
    // datepicker
    $('#customize .datetime').datepicker({ dateFormat: 'yy-mm-dd' }).change(function () {
        var min = parseDate($('.datetime').eq(0).val());
        var max = parseDate($('.datetime').eq(1).val());
        if (min < max) {
            chart.xAxis[0].setExtremes(min, max);
            updatePermalink();
        }
    });
    // range max
    $('#range-max').bind('input', function () {
        chart.yAxis[0].setExtremes(0, Number($(this).val()) || null);
        updatePermalink();
    });

    // select
    $('#permalink').click(function () { this.select(); });
});
