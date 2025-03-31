-- Add phone column
ALTER TABLE users
ADD COLUMN phone VARCHAR(20) NULL;

-- Add address fields
ALTER TABLE users
ADD COLUMN street VARCHAR(255) NULL,
ADD COLUMN city VARCHAR(100) NULL,
ADD COLUMN state VARCHAR(100) NULL,
ADD COLUMN zip_code VARCHAR(20) NULL;

-- Update current users to have empty values (optional)
UPDATE users
SET phone = '', street = '', city = '', state = '', zip_code = ''
WHERE phone IS NULL; 