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

// Подключаем конфиг базы данных
require_once __DIR__ . '/../includes/db.php'; // Убедись, что путь правильный

// Подключение к базе данных через PDO
try {
    $pdo = new PDO(
        "mysql:host=" . DB_HOSTNAME . ";dbname=" . DB_DATABASE . ";charset=utf8",
        DB_USERNAME,
        DB_PASSWORD,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
        ]
    );
} catch (PDOException $e) {
    echo json_encode(['message' => 'Ошибка подключения к базе данных: ' . $e->getMessage()]);
    exit;
}

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
    // Директория для загрузки изображений
    $uploadDir = __DIR__ . '/../uploads/';
    $imageName = basename($image['name']);
    $imagePath = 'uploads/' . $imageName; // Путь для базы данных будет относительным

    // Проверяем тип файла (например, разрешаем только изображения PNG и JPG)
    $allowedTypes = ['image/jpeg', 'image/png'];
    if (!in_array($image['type'], $allowedTypes)) {
        echo json_encode(['message' => 'Неверный тип изображения']);
        exit;
    }

    // Ограничиваем размер файла (например, 2MB)
    if ($image['size'] > 2 * 1024 * 1024) {
        echo json_encode(['message' => 'Размер изображения слишком большой']);
        exit;
    }

    // Перемещаем файл в нужную папку
    if (!move_uploaded_file($image['tmp_name'], $uploadDir . $imageName)) {
        echo json_encode(['message' => 'Ошибка при загрузке изображения']);
        exit;
    }
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