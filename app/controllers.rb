Visualizer.controllers  do
  get :index do
    render 'index'
  end

  get :blog_comments do
    render 'blog_comments', :locals => { :title => 'blog comments' }
  end
end
