class Entry < Sequel::Model
  unrestrict_primary_key
  dataset_module do
    def for_highstock
      ret = {}
      where{created_at >= Date.new(2011, 1, 1)}.order(:created_at).each do |row|
        values = row.values
        member = values.delete(:member)
        ret[member] ||= []
        ret[member].push(values)
      end
      ret
    end
  end
end
