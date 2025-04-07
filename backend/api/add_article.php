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

$title = trim($input['title'] ?? '');
$content = $input['content'] ?? '';
$createdAt = $input['createdAt'] ?? date('Y-m-d H:i:s');
$categoryId = $input['category_id'] ?? '';
$categoryName = trim($input['category_name'] ?? '');

if (empty($title) || empty($content) || empty($categoryId) || empty($categoryName)) {
    echo json_encode(['message' => 'Заголовок, контент, категория и имя категории обязательны']);
    exit;
}

$images = [];
$uploadDir = __DIR__ . '/../uploads/'; // <-- ОСТАВЛЕНА папка uploads
$publicPath = 'uploads/'; // <-- Публичный путь для базы и контента

if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

if (preg_match_all('/<img[^>]+src="data:image\/(jpeg|png);base64,([^"]+)"[^>]*>/i', $content, $matches, PREG_SET_ORDER)) {
    foreach ($matches as $match) {
        $type = $match[1];
        $base64 = $match[2];
        $imgData = base64_decode($base64);
        $imageName = uniqid('img_', true) . '.webp';
        $filePath = $uploadDir . $imageName;
        $webPath = $publicPath . $imageName;

        $img = imagecreatefromstring($imgData);
        if (!$img || !imagewebp($img, $filePath)) {
            echo json_encode(['message' => 'Ошибка при сохранении изображения']);
            exit;
        }
        imagedestroy($img);

        $images[] = $webPath;

        // Заменяем base64 на путь к загруженному файлу
        $content = str_replace($match[0], '<img src="' . $webPath . '" alt="Uploaded Image">', $content);
    }
}

try {
    $stmt = $pdo->prepare("INSERT INTO articles (title, content, category_id, category_name, images, created_at) VALUES (:title, :content, :category_id, :category_name, :images, :created_at)");
    $stmt->execute([
        'title' => $title,
        'content' => $content, // <-- сюда идёт HTML с <img src="uploads/...">
        'category_id' => $categoryId,
        'category_name' => $categoryName,
        'images' => json_encode($images), // <-- и список всех путей отдельно
        'created_at' => $createdAt,
    ]);
    echo json_encode(['message' => 'Статья успешно сохранена']);
} catch (PDOException $e) {
    echo json_encode(['message' => 'Ошибка при сохранении: ' . $e->getMessage()]);
}
