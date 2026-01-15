ALTER TABLE products ADD COLUMN is_featured BOOLEAN DEFAULT false;
COMMENT ON COLUMN products.is_featured IS 'Manually pin this product to the Trending section on the Agent Dashboard';
