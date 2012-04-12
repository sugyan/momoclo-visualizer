#!/usr/bin/env ruby
require 'date'
require 'logger'
require 'nokogiri'
require 'open-uri'
require 'pg'

$log = Logger.new(STDOUT)
$conn = PG.connect(dbname: 'momoclo')
$member = { 1 => 'momota', 2 => 'ariyasu', 3 => 'tamai', 4 => 'sasaki', 5 => 'takagi' }

def scrape (id, page)
  name = $member[id]
  $log.info("scarpe #{name}:#{page}")

  doc = Nokogiri::HTML(open("http://ameblo.jp/#{name}-sd/entrylist-#{page}.html"))
  doc.css('#recent_entries_list li').each do |li|
    datetime = DateTime.parse(li.css('.updatetime').text.strip + '+09:00')
    title    = li.css('.newentrytitle')[0].text()
    count    = li.css('.cotb').text.match(/(\d+)/)[1].to_i()
    url      = li.css('a')[0][:href]

    if $conn.exec('SELECT url FROM item WHERE url = $1', [ url ]).count == 0
      $conn.exec(
        'INSERT INTO item (url, member_id, title, count, datetime) VALUES ($1::varchar, $2::integer, $3::varchar, $4::int, $5::timestamp)',
        [ url, id, title, count, datetime ]
      )
      $log.debug("insert - #{url}: #{count}")
    else
      $conn.exec(
        'UPDATE item SET count = $1::integer WHERE url = $2::varchar',
        [ count, url ]
      )
      $log.debug("update - #{url}: #{count}")
    end
  end
end

# TODO
scrape(1, 1)
$conn.close()
