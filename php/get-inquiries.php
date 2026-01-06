<?php
header('Content-Type: application/json');
$host = 'localhost';
$dbname = 'oceanarcexim';
$username = 'oceanarcuser';
$password = 'strong_password';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $filter = $_GET['filter'] ?? ''; // today, yesterday, custom
    $start = $_GET['start'] ?? '';
    $end = $_GET['end'] ?? '';
    $status = $_GET['status'] ?? ''; // new, in_progress, resolved

    $query = "SELECT * FROM inquiries WHERE 1=1";
    $params = [];

    // Date filters
    if ($filter === 'today') {
        $query .= " AND DATE(created_at) = CURDATE()";
    } elseif ($filter === 'yesterday') {
        $query .= " AND DATE(created_at) = DATE_SUB(CURDATE(), INTERVAL 1 DAY)";
    } elseif ($filter === 'custom' && $start && $end) {
        $query .= " AND DATE(created_at) BETWEEN :start AND :end";
        $params[':start'] = $start;
        $params[':end'] = $end;
    }

    // Status filter
    if (!empty($status)) {
        $query .= " AND status = :status";
        $params[':status'] = $status;
    }

    $query .= " ORDER BY created_at DESC";
    $stmt = $pdo->prepare($query);
    $stmt->execute($params);

    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    if (empty($results)) {
        echo json_encode(['message' => 'No inquiries found with these filters']);
    } else {
        echo json_encode($results);
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>

