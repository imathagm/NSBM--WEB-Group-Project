# NSBM--WEB-Group-Project
 NSBM web Group -28  ,-----"sports hub management system"

## Forgot / Reset Password Feature

### What was added
- Forgot password page: user enters their email, and a reset link is sent to it
- Reset password page: user opens the link from the email and sets a new password
- Email sending with PHPMailer (installed via Composer), using Gmail SMTP
- Database: nsbm_sportshub (reset token handling)

### Files
- backend/api/forgot-password.php: handles the reset request and sends the email
- backend/config/mail-config.php: SMTP settings (NOT pushed to GitHub)
- backend/composer.json and composer.lock: PHPMailer dependency (v6.12.0)
- backend/vendor/: installed packages (NOT pushed to GitHub)

### Setup for this feature
1. Run composer install inside the backend folder
2. Create backend/config/mail-config.php with your own Gmail address and
   App Password (the file is in .gitignore)
3. Make sure Apache and MySQL are running in XAMPP
4. Test at http://localhost/NSBM--WEB-Group-Project/frontend/pages/

### Notes
- mail-config.php and vendor/ are ignored by Git, so every member must set them up locally
- A separate project-only Gmail account is used for sending emails
