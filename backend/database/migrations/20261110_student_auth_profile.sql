USE nsbm_sportshub;

ALTER TABLE sportshub_users
  ADD COLUMN full_name VARCHAR(120) NULL AFTER user_id,
  ADD COLUMN student_id VARCHAR(24) NULL UNIQUE AFTER full_name,
  ADD COLUMN contact_number VARCHAR(24) NULL AFTER email,
  ADD COLUMN sport_of_interest VARCHAR(40) NULL AFTER contact_number;
