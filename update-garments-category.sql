-- Add category column to garments_products table
ALTER TABLE garments_products ADD COLUMN category VARCHAR(255) AFTER title;

-- Update existing products with default category if needed
UPDATE garments_products SET category = 'Other' WHERE category IS NULL OR category = '';
