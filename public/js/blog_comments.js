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
    }
});

$(function () {
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
	rangeSelector: {
	    enabled: false
	},
        xAxis: {
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
        yAxis: {
            min: 0,
            max: Number($('#range-max').val()) || null
        },
	series: [{
            color: 'red',
            name: 'momota'
        }, {
            color: 'green',
            name: 'ariyasu'
        }, {
            color: 'yellow',
            name: 'tamai'
        }, {
            color: 'pink',
            name: 'sasaki'
        }, {
            color: 'purple',
            name: 'takagi'
        }]
    });
    $.getJSON('/api/all', function (res) {
        var i, max_datetime = 0;
        for (i = 0; i < 5; i++) {
            chart.series[i].setData(
                $.map(res[i + 1], function (e) {
                    max_datetime = Math.max(max_datetime, e.datetime);
                    return {
                        x: e.datetime * 1000,
                        y: e.count
                    };
                })
            );
            if (! $('.checkbox input').eq(i).attr('checked')) {
                chart.series[i].hide();
            }
        }

        // xAxis
        var from = $('.datetime').eq(0).val();
        var to   = $('.datetime').eq(1).val();
        if (new Date(to).getTime() > max_datetime * 1000) {
            to = new Date(max_datetime * 1000);
        }
        chart.xAxis[0].setExtremes(new Date(from), new Date(to));

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
        var min = new Date($('.datetime').eq(0).val());
        var max = new Date($('.datetime').eq(1).val());
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
