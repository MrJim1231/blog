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

$images = [];
$uploadDir = __DIR__ . '/../uploads/';
$publicPath = 'uploads/';

// 1. Находим все base64 изображения в контенте
if (preg_match_all('/<img[^>]+src="data:image\/(jpeg|png);base64,([^"]+)"[^>]*>/i', $content, $matches, PREG_SET_ORDER)) {
    foreach ($matches as $index => $match) {
        $type = $match[1];
        $base64 = $match[2];
        $imgData = base64_decode($base64);
        $imageName = uniqid('img_', true) . '.webp';
        $filePath = $uploadDir . $imageName;
        $webPath = $publicPath . $imageName;

        // Создание изображения
        $img = imagecreatefromstring($imgData);
        if (!$img || !imagewebp($img, $filePath)) {
            echo json_encode(['message' => 'Ошибка при сохранении изображения']);
            exit;
        }
        imagedestroy($img);

        // Добавляем путь к изображению
        $images[] = $webPath;

        // Заменяем base64 в контенте
        $newImgTag = str_replace($match[0], '<img src="' . $webPath . '" alt="Uploaded Image">', $match[0]);
        $content = str_replace($match[0], $newImgTag, $content);
    }
}

try {
    $stmt = $pdo->prepare("INSERT INTO articles (title, content, images, created_at) VALUES (:title, :content, :images, :created_at)");
    $stmt->execute([
        'title' => $title,
        'content' => $content,
        'images' => json_encode($images),
        'created_at' => $createdAt,
    ]);
    echo json_encode(['message' => 'Статья успешно сохранена']);
} catch (PDOException $e) {
    echo json_encode(['message' => 'Ошибка при сохранении: ' . $e->getMessage()]);
}
