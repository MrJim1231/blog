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

$id = $input['id'] ?? null;
$title = trim($input['title'] ?? '');
$content = $input['content'] ?? '';
$categoryId = $input['category_id'] ?? '';
$categoryName = trim($input['category_name'] ?? '');

if (!$id || empty($title) || empty($content) || empty($categoryId) || empty($categoryName)) {
    echo json_encode(['message' => 'ID, заголовок, контент, категория и имя категории обязательны']);
    exit;
}

$uploadDir = __DIR__ . '/../uploads/';
$publicPath = 'uploads/';
$images = [];

// Получаем старые изображения
$oldImages = [];
$stmt = $pdo->prepare("SELECT images FROM articles WHERE id = :id");
$stmt->execute(['id' => $id]);
$row = $stmt->fetch(PDO::FETCH_ASSOC);
if ($row && !empty($row['images'])) {
    $oldImages = json_decode($row['images'], true);
}

// Обрабатываем новые base64 изображения
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

// Собираем все изображения, которые остались в content
if (preg_match_all('/<img[^>]+src="(uploads\/[^"]+)"[^>]*>/i', $content, $existingMatches)) {
    $images = array_unique(array_merge($images, $existingMatches[1]));
}

// Удаляем изображения, которых больше нет
$imagesToDelete = array_diff($oldImages, $images);
foreach ($imagesToDelete as $imgPath) {
    $fileToDelete = __DIR__ . '/../' . $imgPath;
    if (file_exists($fileToDelete)) {
        unlink($fileToDelete);
    }
}

// Обновляем статью
try {
    $stmt = $pdo->prepare("UPDATE articles SET title = :title, content = :content, category_id = :category_id, category_name = :category_name, images = :images WHERE id = :id");
    $stmt->execute([
        'id' => $id,
        'title' => $title,
        'content' => $content,
        'category_id' => $categoryId,
        'category_name' => $categoryName,
        'images' => json_encode($images)
    ]);

    echo json_encode(['message' => 'Статья успешно обновлена']);
} catch (PDOException $e) {
    echo json_encode(['message' => 'Ошибка при обновлении: ' . $e->getMessage()]);
}
