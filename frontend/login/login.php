<?php
declare(strict_types=1);
require_once __DIR__ . '/../../backend/config/auth.php';
$pageTitle = 'Student Login';
$pageDescription = 'Welcome back. Sign in to your NSBM Sports Hub account.';
require __DIR__ . '/layout-start.php';
$view = isset($_GET['view']) && $_GET['view'] === 'register' ? 'register' : 'login';
?>
      <div class="view-tabs" role="tablist" aria-label="Student account options">
        <button type="button" class="view-tab <?= $view === 'login' ? 'active' : '' ?>" data-view="login" role="tab" aria-selected="<?= $view === 'login' ? 'true' : 'false' ?>">Sign in</button>
        <button type="button" class="view-tab <?= $view === 'register' ? 'active' : '' ?>" data-view="register" role="tab" aria-selected="<?= $view === 'register' ? 'true' : 'false' ?>">Create account</button>
      </div>

      <form class="portal-form" method="post" action="actions.php" data-form-view="login" <?= $view !== 'login' ? 'hidden' : '' ?>>
        <input type="hidden" name="csrf_token" value="<?= e(csrf_token()) ?>">
        <input type="hidden" name="action" value="student_login">
        <label class="field">Student ID or email
          <input name="identity" type="text" autocomplete="username" maxlength="254" placeholder="e.g. 22012345 or name@email.com" required>
        </label>
        <label class="field">Password
          <span class="password-field">
            <input name="password" type="password" maxlength="72" autocomplete="current-password" required>
            <button type="button" class="password-toggle" aria-label="Show password">Show</button>
          </span>
        </label>
        <div class="form-options">
          <label class="remember"><input type="checkbox" name="remember" value="1"> Remember me</label>
          <a class="text-link" href="forgot-password.php">Forgot password?</a>
        </div>
        <button class="submit-button" type="submit">Sign in <span aria-hidden="true">→</span></button>
        <p class="form-foot">New to the club? <button type="button" class="inline-button" data-view="register">Create a student account</button></p>
      </form>

      <form class="portal-form" method="post" action="actions.php" data-form-view="register" <?= $view !== 'register' ? 'hidden' : '' ?>>
        <input type="hidden" name="csrf_token" value="<?= e(csrf_token()) ?>">
        <input type="hidden" name="action" value="register">
        <label class="field">Full name
          <input name="full_name" type="text" autocomplete="name" maxlength="120" required>
        </label>
        <label class="field">Student ID
          <input name="student_id" type="text" maxlength="40" autocomplete="off" required>
        </label>
        <label class="field">Email address
          <input name="email" type="email" autocomplete="email" maxlength="254" required>
        </label>
        <label class="field">Contact number
          <input name="contact_number" type="tel" autocomplete="tel" maxlength="30" required>
        </label>
        <label class="field">Sport of interest
          <select name="sport_of_interest" required>
            <option value="">Choose your sport</option>
            <option>Football</option><option>Cricket</option><option>Basketball</option>
            <option>Volleyball</option><option>Badminton</option><option>Swimming</option>
            <option>Athletics</option><option>Other</option>
          </select>
        </label>
        <label class="field">Password
          <span class="password-field">
            <input name="password" type="password" minlength="8" maxlength="72" autocomplete="new-password" required>
            <button type="button" class="password-toggle" aria-label="Show password">Show</button>
          </span>
          <small>Use at least 8 characters (maximum 72 bytes).</small>
        </label>
        <label class="field">Confirm password
          <input name="confirm_password" type="password" minlength="8" maxlength="72" autocomplete="new-password" required>
        </label>
        <button class="submit-button" type="submit">Create account <span aria-hidden="true">→</span></button>
        <p class="form-foot">Already registered? <button type="button" class="inline-button" data-view="login">Sign in</button></p>
      </form>
    </section>
  </main>
  <?php require __DIR__ . '/layout-end.php'; ?>
