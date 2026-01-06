<?php
header('Content-Type: application/json');

// Database configuration
$host = 'localhost';
$dbname = 'oceanarcexim';
$username = 'oceanarcuser';
$password = 'strong_password';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Get form data
    $country = $_POST['country'] ?? '';
    $name = $_POST['name'] ?? '';
    $company = $_POST['company'] ?? '';
    $email = $_POST['email'] ?? '';
    $phone = $_POST['phone'] ?? '';
    $designation = $_POST['designation'] ?? '';
    $message = $_POST['message'] ?? '';
    
    // Validate required fields
    if (empty($country) || empty($name) || empty($company) || empty($email) || empty($phone) || empty($message)) {
        echo json_encode(['success' => false, 'message' => 'All required fields must be filled']);
        exit;
    }
    
    // Insert into database
    $stmt = $pdo->prepare("INSERT INTO inquiries (country, name, company, email, phone, designation, message) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $success = $stmt->execute([$country, $name, $company, $email, $phone, $designation, $message]);
    
    if ($success) {
        echo json_encode(['success' => true, 'message' => ' Thank you! Your inquiry has been submitted successfully. Well get back to you ASAP. ']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error submitting your inquiry']);
    }
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
