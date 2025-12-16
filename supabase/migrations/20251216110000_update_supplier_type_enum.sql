-- Allow 'Airline' in supplier_type and ensure mixed case compatibility
ALTER TABLE public.suppliers DROP CONSTRAINT IF EXISTS suppliers_supplier_type_check;

ALTER TABLE public.suppliers ADD CONSTRAINT suppliers_supplier_type_check 
CHECK (supplier_type IN (
    'Land Operator', 'Transport', 'Hotel', 'Airline', 
    'LAND OPERATOR', 'TRANSPORT', 'HOTEL', 'AIRLINE'
));
