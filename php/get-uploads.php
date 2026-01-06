<?php
header('Content-Type: application/json');

$uploadDir = __DIR__ . '/../uploads/';
$filesList = [];

if (is_dir($uploadDir)) {
    foreach (array_diff(scandir($uploadDir), ['.', '..']) as $file) {
        $filePath = $uploadDir . $file;
        if (is_file($filePath)) {
            $filesList[] = [
                'name' => $file,
                'size' => filesize($filePath), // in bytes
                'date' => date("Y-m-d H:i:s", filemtime($filePath)),
                'time' => filemtime($filePath)
            ];
        }
    }
}

usort($filesList, function($a, $b) {
    return $b['time'] - $a['time'];
});

$filesList = array_map(function($file) {
    unset($file['time']);
    return $file;
}, $filesList);

echo json_encode($filesList);

