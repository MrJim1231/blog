<?php
// Заголовки для CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

// Обрабатываем preflight-запрос
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200); // Отвечаем на preflight-запрос
    exit;
}

// Подключаем базу данных
require_once __DIR__ . '/../includes/db.php'; // Убедись, что путь правильный

// Получаем данные из POST-запроса
$category = $_POST['category'] ?? '';
$image = $_FILES['image'] ?? null;

// Логирование данных, чтобы убедиться, что они приходят
error_log('Категория: ' . $category);
error_log('Файл изображения: ' . print_r($image, true));

if (empty($category)) {
    echo json_encode(['message' => 'Категория не передана']);
    exit;
}

// Проверяем, существует ли такая категория
$stmt = $pdo->prepare("SELECT COUNT(*) FROM categories WHERE name = :category");
$stmt->execute(['category' => $category]);
$count = $stmt->fetchColumn();

if ($count > 0) {
    echo json_encode(['message' => 'Такая категория уже существует']);
    exit;
}

// Обрабатываем изображение (если оно было загружено)
$imagePath = null;
if ($image && $image['error'] === UPLOAD_ERR_OK) {
    // Логируем информацию о типе файла
    error_log('Тип изображения: ' . $image['type']);
    
    // Проверяем MIME-тип изображения
    $imageType = mime_content_type($image['tmp_name']);
    error_log('MIME-тип изображения: ' . $imageType);

    $allowedTypes = ['image/jpeg', 'image/png'];
    if (!in_array($imageType, $allowedTypes)) {
        error_log('Неверный MIME-тип изображения: ' . $imageType);
        echo json_encode(['message' => 'Неверный тип изображения']);
        exit;
    }

    // Директория для загрузки изображений
    $uploadDir = __DIR__ . '/../uploads/';
    
    // Автогенерация имени файла (используем уникальный ID)
    $uniqueName = uniqid('img_', true) . '.webp';  // Генерируем уникальное имя файла
    $imagePath = 'uploads/' . $uniqueName; // Путь для базы данных будет относительным

    // Загружаем изображение с помощью GD библиотеки
    switch ($imageType) {
        case 'image/jpeg':
            $img = imagecreatefromjpeg($image['tmp_name']);
            break;
        case 'image/png':
            $img = imagecreatefrompng($image['tmp_name']);
            break;
        default:
            echo json_encode(['message' => 'Неверный формат изображения']);
            exit;
    }

    // Сохраняем изображение в формате WebP
    if (!imagewebp($img, $uploadDir . $uniqueName)) {
        echo json_encode(['message' => 'Ошибка при сохранении изображения в формате WebP']);
        exit;
    }

    // Освобождаем память
    imagedestroy($img);
}

// Вставляем новую категорию в базу данных
try {
    $stmt = $pdo->prepare("INSERT INTO categories (name, image) VALUES (:category, :image)");
    $stmt->execute(['category' => $category, 'image' => $imagePath]);
    echo json_encode(['message' => 'Категория успешно добавлена']);
} catch (PDOException $e) {
    echo json_encode(['message' => 'Ошибка при добавлении категории: ' . $e->getMessage()]);
}
?>
