#!/usr/bin/env ruby
require 'nokogiri'
require 'open-uri'
doc = Nokogiri::HTML(open('http://ameblo.jp/sasaki-sd/entrylist-1.html'))
doc.css('#recent_entries_list li').each do |li|
  data = {
    datetime: li.css('.updatetime').text.strip,
    title:    li.css('.newentrytitle').text,
    count:    li.css('.cotb').text.match(/(\d+)/)[1].to_i,
    url:      li.css('a')[0][:href],
  }
  puts data
end
