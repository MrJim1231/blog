<?php
// Заголовки для CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

// Обрабатываем preflight-запрос
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Подключаем базу данных
require_once __DIR__ . '/../includes/db.php';

// Получаем данные из POST
$title = $_POST['title'] ?? '';
$content = $_POST['content'] ?? '';
$category_id = $_POST['category_id'] ?? null;
$image = $_FILES['image'] ?? null;

// Валидация
if (empty($title) || empty($content) || empty($category_id)) {
    echo json_encode(['message' => 'Все поля обязательны']);
    exit;
}

// Обработка изображения
$imagePath = null;
if ($image && $image['error'] === UPLOAD_ERR_OK) {
    $imageType = mime_content_type($image['tmp_name']);
    $allowedTypes = ['image/jpeg', 'image/png'];

    if (!in_array($imageType, $allowedTypes)) {
        echo json_encode(['message' => 'Неверный тип изображения']);
        exit;
    }

    $uploadDir = __DIR__ . '/../uploads/';
    $uniqueName = uniqid('article_', true) . '.webp';
    $imagePath = 'uploads/' . $uniqueName;

    switch ($imageType) {
        case 'image/jpeg':
            $img = imagecreatefromjpeg($image['tmp_name']);
            break;
        case 'image/png':
            $img = imagecreatefrompng($image['tmp_name']);
            break;
        default:
            echo json_encode(['message' => 'Формат изображения не поддерживается']);
            exit;
    }

    if (!imagewebp($img, $uploadDir . $uniqueName)) {
        echo json_encode(['message' => 'Ошибка при сохранении изображения']);
        exit;
    }

    imagedestroy($img);
}

// Добавление статьи в базу
try {
    $stmt = $pdo->prepare("
        INSERT INTO articles (title, content, category_id, image, created_at)
        VALUES (:title, :content, :category_id, :image, NOW())
    ");
    $stmt->execute([
        'title' => $title,
        'content' => $content,
        'category_id' => $category_id,
        'image' => $imagePath
    ]);

    echo json_encode(['message' => 'Статья успешно добавлена']);
} catch (PDOException $e) {
    echo json_encode(['message' => 'Ошибка при добавлении статьи: ' . $e->getMessage()]);
}
?>
