$(function () {
    $.getJSON('/api/all', function (res) {
        var i;
        for (i = 0; i < 5; i++) {
            $.each(res[i + 1], function (j, e) {
                var date = new Date(e.datetime * 1000);
                var cell = $('table').eq(i).find('tr').eq(date.getDay() + 1).find('td').eq(date.getHours());
                var data = cell.data('date') || ''; 
                var val = parseInt(cell.text() || '0') + 1;
                cell.css({ 'background-color': 'rgb(' + String(255 - Math.min(val, 16) * 16) + ', ' + String(255 - (val > 8 ? (val - 8) * 16 : 0)) + ', 255)' });
                cell.text(val);
                cell.data('date', data + '<br>' + (function () {
                    var y = date.getFullYear();
                    var m = date.getMonth() + 1;
                    var d = date.getDate();
                    var t = e.title.length > 12 ? e.title.substring(0, 12) + '...' : e.title;
                    return [y, m > 9 ? m : '0' + m, d > 9 ? d : '0' + d].join('-') + ' ' + t;
                }()));
            });
        }
        $('.cell').each(function (i, e) {
            var cell = $(e);
            var placement = 'right';
            if (cell.text()) {
                if (cell.parent().children().index(cell) > 12) {
                    placement = 'left';
                }
                cell.popover({
                    title: cell.text() + '件',
                    content: cell.data('date'),
                    placement: placement
                });
            }
        });
    });
    // popover({
    //     title: $(this)
    // });
});
