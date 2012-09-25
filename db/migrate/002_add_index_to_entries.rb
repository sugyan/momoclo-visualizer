Sequel.migration do
  change do
    alter_table :entries do
      add_index :created_at
    end
  end
end
