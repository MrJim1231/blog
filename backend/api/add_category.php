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
$data = json_decode(file_get_contents("php://input"), true);
$category = trim($data['category'] ?? '');

if (empty($category)) {
    echo json_encode(['message' => 'Категория не может быть пустой']);
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

// Вставляем новую категорию в базу данных
try {
    $stmt = $pdo->prepare("INSERT INTO categories (name) VALUES (:category)");
    $stmt->execute(['category' => $category]);
    echo json_encode(['message' => 'Категория успешно добавлена']);
} catch (PDOException $e) {
    echo json_encode(['message' => 'Ошибка при добавлении категории: ' . $e->getMessage()]);
}
