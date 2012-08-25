Visualizer.controllers :api do
  get :blog_comments, :provides => :json do
    Entry.for_highstock.to_json
  end
end
