<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

// Обрабатываем preflight-запрос
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../includes/db.php';

$id = $_POST['id'] ?? null;
$name = $_POST['name'] ?? null;
$image = $_FILES['image'] ?? null;

if (!$id || !$name) {
    echo json_encode(['message' => 'ID и имя обязательны']);
    exit;
}

$imagePath = null;

// Получаем текущее изображение категории
try {
    $stmt = $pdo->prepare("SELECT image FROM categories WHERE id = :id");
    $stmt->execute(['id' => $id]);
    $category = $stmt->fetch(PDO::FETCH_ASSOC);

    // Если категория не найдена
    if (!$category) {
        echo json_encode(['message' => 'Категория не найдена']);
        exit;
    }

    // Удаляем старое изображение, если есть новое изображение
    if ($image && $image['error'] === UPLOAD_ERR_OK) {
        // Удаляем старое изображение, если оно есть
        if (!empty($category['image'])) {
            $oldImagePath = __DIR__ . '/../' . $category['image'];
            if (file_exists($oldImagePath)) {
                unlink($oldImagePath); // Удаляем старое изображение
            }
        }
    }
} catch (PDOException $e) {
    echo json_encode(['message' => 'Ошибка при получении категории: ' . $e->getMessage()]);
    exit;
}

if ($image && $image['error'] === UPLOAD_ERR_OK) {
    $imageType = mime_content_type($image['tmp_name']);
    $allowedTypes = ['image/jpeg', 'image/png'];

    if (!in_array($imageType, $allowedTypes)) {
        echo json_encode(['message' => 'Недопустимый тип изображения']);
        exit;
    }

    // Директория для загрузки изображений
    $uploadDir = __DIR__ . '/../uploads/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    // Генерация уникального имени файла
    $uniqueName = uniqid('img_', true) . '.webp';
    $imagePath = 'uploads/' . $uniqueName;

    // Сохранение нового изображения в формате WebP
    switch ($imageType) {
        case 'image/jpeg':
            $img = imagecreatefromjpeg($image['tmp_name']);
            break;
        case 'image/png':
            $img = imagecreatefrompng($image['tmp_name']);
            break;
    }

    if (!imagewebp($img, $uploadDir . $uniqueName)) {
        echo json_encode(['message' => 'Ошибка при сохранении WebP']);
        exit;
    }

    imagedestroy($img);
}

try {
    // Обновление данных категории в базе
    $query = "UPDATE categories SET name = :name";
    $params = ['name' => $name, 'id' => $id];

    if ($imagePath) {
        $query .= ", image = :image";
        $params['image'] = $imagePath;
    }

    $query .= " WHERE id = :id";

    $stmt = $pdo->prepare($query);
    $stmt->execute($params);

    echo json_encode(['message' => 'Категория обновлена', 'image' => $imagePath]);

} catch (PDOException $e) {
    echo json_encode(['message' => 'Ошибка: ' . $e->getMessage()]);
}
?>
