task :scrape do
  ['momota', 'ariyasu', 'tamai', 'sasaki', 'takagi'].each do |member|
    doc  = Nokogiri::HTML(open("http://ameblo.jp/#{ member }-sd/entrylist-1.html"))
    doc.css('#recent_entries_list li').each do |li|
      url   = li.css('.newentrytitle a')[0][:href]
      entry = Entry[url] || Entry.new(:url => url)
      entry.update(
        :title      => li.css('.newentrytitle').text,
        :created_at => li.css('.updatetime').text.strip,
        :count      => li.css('.cotb').text.match(/\((\d+)\)/)[1],
      )
    end
    sleep 1
  end
end
