require 'spec_helper'

describe "ApiController" do
  before do
    get "/api/blog_comments"
  end

  it "returns empty json" do
    last_response.body.should == "{}"
  end
end
