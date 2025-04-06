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

// Получаем данные
$articleId = $input['id'] ?? null;
$title = trim($input['title'] ?? '');
$content = $input['content'] ?? '';
$categoryId = $input['category_id'] ?? '';
$categoryName = trim($input['category_name'] ?? '');
$images = $input['images'] ?? []; // Массив изображений (можно оставить пустым, если нет новых изображений)
$createdAt = $input['created_at'] ?? null;

if (empty($articleId) || empty($title) || empty($content) || empty($categoryId) || empty($categoryName)) {
    echo json_encode(['message' => 'ID статьи, заголовок, контент, категория и имя категории обязательны']);
    exit;
}

$uploadDir = __DIR__ . '/../uploads/';
$publicPath = 'uploads/';

// Если есть base64 изображения, нужно их обработать
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
        $content = str_replace($match[0], '<img src="' . $webPath . '" alt="Uploaded Image">', $content);
    }
}

try {
    // Подготовка SQL запроса для обновления статьи
    $stmt = $pdo->prepare("UPDATE articles SET title = :title, content = :content, category_id = :category_id, category_name = :category_name, images = :images, created_at = :created_at WHERE id = :id");
    $stmt->execute([
        'id' => $articleId,
        'title' => $title,
        'content' => $content,
        'category_id' => $categoryId,
        'category_name' => $categoryName,
        'images' => json_encode($images),
        'created_at' => $createdAt,
    ]);
    
    if ($stmt->rowCount() > 0) {
        echo json_encode(['message' => 'Статья успешно обновлена']);
    } else {
        echo json_encode(['message' => 'Ничего не изменено']);
    }
} catch (PDOException $e) {
    echo json_encode(['message' => 'Ошибка при обновлении: ' . $e->getMessage()]);
}
?>
