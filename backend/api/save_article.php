<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../includes/db.php';

$input = json_decode(file_get_contents("php://input"), true);

$title = $input['title'] ?? '';
$content = $input['content'] ?? '';
$createdAt = $input['createdAt'] ?? date('Y-m-d H:i:s');

if (empty($title) || empty($content)) {
    echo json_encode(['message' => 'Заголовок и контент обязательны']);
    exit;
}

try {
    $stmt = $pdo->prepare("INSERT INTO articles (title, content, created_at) VALUES (:title, :content, :created_at)");
    $stmt->execute([
        'title' => $title,
        'content' => $content,
        'created_at' => $createdAt,
    ]);
    echo json_encode(['message' => 'Статья успешно сохранена']);
} catch (PDOException $e) {
    echo json_encode(['message' => 'Ошибка при сохранении: ' . $e->getMessage()]);
}
