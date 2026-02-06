<?php
// Database configuration
$host = 'localhost';
$dbname = 'brew_haven';
$username = 'root'; // Change this according to your MySQL settings
$password = '';     // Change this according to your MySQL settings (default for XAMPP is empty)

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    // Set PDO to throw exceptions on error
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    // Use prepared statements for security
    $pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
} catch (PDOException $e) {
    die("Error: Could not connect to the database. " . $e->getMessage());
}
?>
