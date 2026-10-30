<?php
declare(strict_types=1);
require_once __DIR__ . '/../../backend/config/auth.php';
header('Cache-Control: no-store, private');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: no-referrer');
header("Content-Security-Policy: default-src 'self'; form-action 'self'; base-uri 'self'; frame-ancestors 'none'");
$flash = take_flash();
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#14422a">
  <title><?= e($pageTitle) ?> | NSBM Sports Hub</title>
  <link rel="stylesheet" href="portal.css">
  <script src="portal.js" defer></script>
</head>
<body>
  <header class="portal-header">
    <a class="brand" href="../index.html" aria-label="NSBM Sports Hub home">
      <span class="brand-mark" aria-hidden="true">N</span>
      <span>NSBM <strong>SPORTS HUB</strong></span>
    </a>
    <a class="home-link" href="../index.html">Back to home</a>
  </header>
  <main class="portal-shell">
    <aside class="welcome-panel">
      <span class="eyebrow">PLAY WITH PASSION</span>
      <h1>One team.<br>Many dreams.</h1>
      <p>Find your sport, join your community and make every season count.</p>
      <div class="sport-tags" aria-label="Popular sports">
        <span>Football</span><span>Cricket</span><span>Basketball</span><span>Volleyball</span>
      </div>
      <p class="welcome-foot"><span class="status-dot"></span> YOUR GAME. YOUR COMMUNITY.</p>
    </aside>
    <section class="form-panel">
      <span class="eyebrow">NSBM SPORTS HUB</span>
      <h2><?= e($pageTitle) ?></h2>
      <p class="intro"><?= e($pageDescription) ?></p>
      <?php if ($flash): ?>
        <div class="notice <?= e($flash['type'] === 'error' ? 'error' : 'success') ?>" role="status" aria-live="polite">
          <?= e((string) $flash['message']) ?>
        </div>
      <?php endif; ?>
