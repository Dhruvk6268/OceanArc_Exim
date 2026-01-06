<?php
header('Content-Type: application/json');

if (!isset($_POST['filename'])) {
    echo json_encode(['success' => false, 'error' => 'No filename specified']);
    exit;
}

$file = basename($_POST['filename']);
$filePath = __DIR__ . '/../uploads/' . $file;

if (file_exists($filePath)) {
    unlink($filePath);
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => 'File not found']);
}

