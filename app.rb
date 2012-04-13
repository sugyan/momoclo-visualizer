require 'sinatra'
require 'sinatra/json'
require 'pg'

get '/' do
  redirect '/blog_comments/index.html'
end

get '/api/all' do
  res = {}
  uri = URI.parse(ENV['SHARED_DATABASE_URL'])
  pgconf = { host: uri.host, dbname: uri.path.slice(1..-1) }
  if uri.user && uri.password
    pgconf[:user]     = uri.user
    pgconf[:password] = uri.password
  end
  conn = PG.connect(pgconf)
  conn.exec('SELECT * FROM item ORDER BY member_id, datetime ASC').each do |row|
    id = row.delete('member_id')
    row['datetime'] = DateTime.parse(row['datetime']).to_time.to_i
    row['count']    = row['count'].to_i
    res[id] = [] unless res[id]
    res[id].push(row)
  end
  conn.close

  json res
end
