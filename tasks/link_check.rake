# -*- coding: utf-8 -*-
require 'logger'

task :link_check do
  log = Logger.new(STDERR)
  Entry.filter('created_at >= ?', Date.today - 7).map(:url).each do |url|
    log.info(url)
    begin
      error = Nokogiri::HTML(open(url)).css('span.error')
      if error.text.match(/削除/)
        Entry[url].delete
        log.info('deleted.')
      end
    rescue => err
      log.error('%s: (%s)' % [err.message, url])
    end
    sleep 1
  end
end
