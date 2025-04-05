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

if ($image && $image['error'] === UPLOAD_ERR_OK) {
    $imageType = mime_content_type($image['tmp_name']);

    $allowedTypes = ['image/jpeg', 'image/png'];
    if (!in_array($imageType, $allowedTypes)) {
        echo json_encode(['message' => 'Недопустимый тип изображения']);
        exit;
    }

    $uploadDir = __DIR__ . '/../uploads/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    $uniqueName = uniqid('img_', true) . '.webp';
    $imagePath = 'uploads/' . $uniqueName;

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
