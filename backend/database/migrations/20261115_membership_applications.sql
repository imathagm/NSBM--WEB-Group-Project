USE nsbm_sportshub;

ALTER TABLE sportshub_membership_applications
  ADD COLUMN user_id BIGINT UNSIGNED NULL AFTER id,
  ADD COLUMN club_id CHAR(36) NULL AFTER user_id,
  ADD COLUMN reviewed_by BIGINT UNSIGNED NULL AFTER notes,
  ADD COLUMN reviewed_at DATETIME NULL AFTER reviewed_by;

UPDATE sportshub_membership_applications AS application
JOIN sportshub_users AS student
  ON student.student_id = application.student_id
JOIN sportshub_clubs AS club
  ON club.name = application.club
SET application.user_id = student.user_id,
    application.club_id = club.id
WHERE application.user_id IS NULL
  AND application.club_id IS NULL
  AND NOT EXISTS (
    SELECT 1
    FROM sportshub_membership_applications AS duplicate
    WHERE duplicate.student_id = application.student_id
      AND duplicate.club = application.club
      AND duplicate.id <> application.id
  );

ALTER TABLE sportshub_membership_applications
  ADD UNIQUE KEY uq_membership_account_club (user_id, club_id),
  ADD CONSTRAINT fk_membership_application_user
    FOREIGN KEY (user_id)
    REFERENCES sportshub_users(user_id)
    ON DELETE SET NULL,
  ADD CONSTRAINT fk_membership_application_club
    FOREIGN KEY (club_id)
    REFERENCES sportshub_clubs(id)
    ON DELETE SET NULL,
  ADD CONSTRAINT fk_membership_application_reviewer
    FOREIGN KEY (reviewed_by)
    REFERENCES administrators(admin_id)
    ON DELETE SET NULL;
