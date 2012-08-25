Sequel.migration do
  change do
    create_table :entries do
      String :url, :primary_key => true
      String :member
      String :title
      DateTime :created_at
      Integer :count
    end
  end
end
