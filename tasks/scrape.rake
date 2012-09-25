require 'logger'

task :scrape do
  log = Logger.new(STDERR)
  ['momota', 'ariyasu', 'tamai', 'sasaki', 'takagi'].each do |member|
    page = 1
    while true do
      url = "http://ameblo.jp/#{ member }-sd/entrylist-#{ page }.html"
      begin
        # scrape and update
        doc = Nokogiri::HTML(open(url))
        doc.css('#recent_entries_list li').each do |li|
          url   = li.css('.newentrytitle a')[0][:href]
          entry = Entry[url] || Entry.new(:url => url)
          entry.update(
            :member     => member,
            :title      => li.css('.newentrytitle').text,
            :created_at => li.css('.updatetime').text.strip,
            :count      => li.css('.cotb').text.match(/\((\d+)\)/)[1],
          )
        end
      rescue => err
        log.error('%s: (%s)' % [err.message, url])
        break
      end
      # next page?
      break if doc.css('.page .nextPage').length == 0
      page += 1
      sleep 1
    end
  end
end
