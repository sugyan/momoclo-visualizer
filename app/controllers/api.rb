Visualizer.controllers :api do
  get :blog_comments, :provides => :json, :cache => true do
    expires_in 30
    Entry.for_highstock.to_json
  end
end
