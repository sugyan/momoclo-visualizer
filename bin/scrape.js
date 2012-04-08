#!/usr/bin/env node

var async              = require('async');
var dataSection        = require('data-section');
var request            = require('request');
var scraper            = require('scraper');
var GoogleClientLogin  = require('googleclientlogin').GoogleClientLogin;
var GoogleSpreadsheets = require('google-spreadsheets');

var googleAuth;
async.waterfall([
    function (callback) {
        googleAuth = new GoogleClientLogin({
            email: process.env.GOOGLE_USERNAME,
            password: process.env.GOOGLE_PASSWORD,
            service: 'spreadsheets',
            accountType: GoogleClientLogin.accountTypes.google
        });
        googleAuth.on(GoogleClientLogin.events.login, callback);
        googleAuth.on(GoogleClientLogin.events.error, function (e) {
            throw e;
        });
        googleAuth.login();
    },
    function (callback) {
        GoogleSpreadsheets({
            key: '0Ahc45BnJXcJzdENmSnlWVDF3bW1WanNReDMzUEtYY0E',
            auth: googleAuth.getAuthId()
        }, callback);
    },
    function (spreadsheet, callback) {
        dataSection.get(function (err, data) {
            if (err) {
                throw err;
            }
            callback(null, data, spreadsheet);
        });
    },
    function (template, spreadsheet, callback) {
        var updateSpreadSheet = function (values, sheet, row, len) {
            console.log('updating sheet %d: %d - %d ...', sheet, row, row + len - 1);
            var url = [
                'https://spreadsheets.google.com/feeds/cells',
                spreadsheet.key,
                spreadsheet.worksheets[sheet].id,
                'private/full'
            ].join('/');
            var entries = values.map(function (e, i) {
                return template.entry
                    .replace(/__BATCH_ID__/g, 'A' + i)
                    .replace(/__URL__/g, url)
                    .replace(/__ROW__/g, e.row)
                    .replace(/__COL__/g, e.col)
                    .replace(/__VALUE__/g, e.value
                             .replace(/&/g, '&amp;')
                             .replace(/</g, '&lt;')
                             .replace(/>/g, '&gt;')
                             .replace(/"/g, '&quot;'));
            });
            var data = template.batch
                    .replace(/__URL__/, url)
                    .replace(/__ENTRIES__/, entries.join('\n'));
            request.post({
                url: url + '/batch',
                body: data,
                headers: {
		    'If-None-Match': 'W/"' + spreadsheet.key + '."',
                    'Content-Type': 'application/atom+xml',
                    'Authorization': 'GoogleLogin auth=' + spreadsheet.auth
                }
            }, function (err, res, body) {
                if (err) {
                    throw err;
                }
                console.log('updated! sheet %d: %d - %d', sheet, row, row + len - 1);
            });
        };
        async.forEach([
            { sheet: 0, max: 15, name: 'momota'  },
            { sheet: 1, max: 21, name: 'ariyasu' },
            { sheet: 2, max: 15, name: 'tamai'   },
            { sheet: 3, max: 19, name: 'sasaki'  },
            { sheet: 4, max: 15, name: 'takagi'  }
        ], function (item, callback) {
            (function scrape (page, row) {
                if (page > item.max) {
                    callback();
                    return;
                }
                console.log('scrape %s:%d', item.name, page);
                scraper('http://ameblo.jp/' + item.name + '-sd/entrylist-' + page + '.html', function (err, $) {
                    if (err) {
                        throw err;
                    }
                    var values = [];
                    var list = $('#recent_entries_list li');
                    list.each(function (i, e) {
                        var li = $(e);
                        values.push({ row: row + i, col: 1, value: li.find('.updatetime').text().trim()      });
                        values.push({ row: row + i, col: 2, value: li.find('.cotb').text().match(/(\d+)/)[1] });
                        values.push({ row: row + i, col: 3, value: li.find('.newentrytitle').text()          });
                        // updateCell(member[key].sheet, member[key].col + i, 1, li.find('.updatetime').text().trim());
                        // updateCell(member[key].sheet, member[key].col + i, 2, li.find('.cotb').text().match(/(\d+)/)[1]);
                        // updateCell(member[key].sheet, member[key].col + i, 3, li.find('.newentrytitle').text());
                    });
                    updateSpreadSheet(values, item.sheet, row, list.length);
                    setTimeout(function () {
                        scrape(page + 1, row + list.length);
                    }, 1000);
                });
            }(1, 2));
        }, function (err) {
            if (err) {
                throw err;
            }
            callback();
        });
    }
], function (err, results) {
    if (err) {
        throw err;
    }
    console.log('all finished!');
});

/* __DATA__
@@ batch
<feed xmlns="http://www.w3.org/2005/Atom"
      xmlns:batch="http://schemas.google.com/gdata/batch"
      xmlns:gs="http://schemas.google.com/spreadsheets/2006">
  <id>__URL__</id>
__ENTRIES__
</feed>
@@ entry
  <entry>
    <batch:id>__BATCH_ID__</batch:id>
    <batch:operation type="update"/>
    <id>__URL__/R__ROW__C__COL__</id>
    <link rel="edit" type="application/atom+xml"
      href="__URL__/R__ROW__C__COL__/version"/>
    <gs:cell row="__ROW__" col="__COL__" inputValue="__VALUE__"/>
  </entry>
 __DATA__*/
