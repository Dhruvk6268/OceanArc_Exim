<?php
header('Content-Type: application/json');
session_start();

if (!isset($_SESSION['admin_id'])) {
    echo json_encode(['success' => false, 'error' => 'Unauthorized']);
    exit;
}

if (!isset($_POST['id']) || !isset($_POST['assignee'])) {
    echo json_encode(['success' => false, 'error' => 'ID and assignee are required']);
    exit;
}

$host = 'localhost';
$dbname = 'oceanarcexim';
$username = 'oceanarcuser';
$password = 'strong_password';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $stmt = $pdo->prepare("UPDATE inquiries SET assigned_to = ? WHERE id = ?");
    $success = $stmt->execute([$_POST['assignee'], $_POST['id']]);
    
    echo json_encode(['success' => $success]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'error' => 'Database error: ' . $e->getMessage()]);
}
?>
