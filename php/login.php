<?php
header('Content-Type: application/json');
session_start();

// Database configuration
$host = 'localhost';
$dbname = 'oceanarcexim';
$username = 'oceanarcuser';
$password = 'strong_password';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed']);
    exit;
}

$inputUsername = $_POST['username'] ?? 'admin';
$inputPassword = $_POST['password'] ?? 'admin123';

// Validate input
if (empty($inputUsername)) {
    echo json_encode(['success' => false, 'message' => 'Username is required']);
    exit;
}

if (empty($inputPassword)) {
    echo json_encode(['success' => false, 'message' => 'Password is required']);
    exit;
}

// Check admin credentials
$stmt = $pdo->prepare("SELECT * FROM admins WHERE username = ?");
$stmt->execute([$inputUsername]);
$admin = $stmt->fetch(PDO::FETCH_ASSOC);

if ($admin && password_verify($inputPassword, $admin['password'])) {
    $_SESSION['admin_id'] = $admin['id'];
    $_SESSION['admin_username'] = $admin['username'];
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid username or password']);
}
?>
