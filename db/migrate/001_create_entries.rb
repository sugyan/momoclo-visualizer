Sequel.migration do
  up do
    create_table :entries do
      primary_key :id
    end
  end

  down do
    drop_table :entries
  end
end
