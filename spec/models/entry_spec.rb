require 'spec_helper'

describe "Entry Model" do
  let(:entry) { Entry.new }
  it 'can be created' do
    entry.should_not be_nil
  end
end
