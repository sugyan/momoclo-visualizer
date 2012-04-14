#!/usr/bin/env ruby
require 'logger'
require 'nokogiri'
require 'open-uri'
require 'pg'

uri = URI.parse(ENV['SHARED_DATABASE_URL'])
pgconf = { host: uri.host, dbname: uri.path.slice(1..-1) }
if uri.user && uri.password
  pgconf[:user]     = uri.user
  pgconf[:password] = uri.password
end
$conn = PG.connect(pgconf)
$log = Logger.new(STDOUT)
$member = { 1 => 'momota', 2 => 'ariyasu', 3 => 'tamai', 4 => 'sasaki', 5 => 'takagi' }

def scrape (id, page)
  name = $member[id]
  $log.info("scarpe #{name}:#{page}")

  doc = Nokogiri::HTML(open("http://ameblo.jp/#{name}-sd/entrylist-#{page}.html"))
  list = doc.css('#recent_entries_list li')
  list.each do |li|
    datetime = li.css('.updatetime').text.strip
    title    = li.css('.newentrytitle')[0].text()
    count    = li.css('.cotb').text.match(/(\d+)/)[1].to_i()
    url      = li.css('a')[0][:href]

    if $conn.exec('SELECT url FROM item WHERE url = $1', [ url ]).count == 0
      $conn.exec(
        "INSERT INTO item (url, member_id, title, count, datetime) VALUES ($1::varchar, $2::integer, $3::varchar, $4::int, $5::timestamp AT TIME ZONE 'JST')",
        [ url, id, title, count, datetime ]
      )
      $log.debug("insert - #{url}: #{count}")
    else
      $conn.exec(
        "UPDATE item SET count = $1::integer, datetime = $2::timestamp AT TIME ZONE 'JST' WHERE url = $3::varchar",
        [ count, datetime, url ]
      )
      $log.debug("update - #{url}: #{count}")
    end
  end
  if list.length == 20 && page < 20
    sleep 1
    scrape(id, page + 1)
  end
end

$member.each do |key, value|
  scrape(key, 1)
end
$conn.close()
