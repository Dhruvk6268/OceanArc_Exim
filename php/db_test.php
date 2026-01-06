<?php
try {
    $db = new PDO('mysql:host=localhost;dbname=oceanarcexim', 'oceanarcuser', 'strong_password');
    echo "Database connection successful!";
    $db = null;
} catch (PDOException $e) {
    die("Connection failed: " . $e->getMessage());
}
?>
