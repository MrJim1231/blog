<?php
// Заголовки для CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

// Подключаем базу данных
require_once __DIR__ . '/../includes/db.php';

// Получаем категорию из GET-запроса
$categoryId = $_GET['category'] ?? '';

if (empty($categoryId)) {
    echo json_encode(['message' => 'Категория не передана']);
    exit;
}

// Логируем параметр категории
error_log('Получена категория ID: ' . $categoryId);

// Запрос к базе данных для получения статьи по category_id
$stmt = $pdo->prepare("SELECT * FROM articles WHERE category_id = :category_id LIMIT 1");
$stmt->execute(['category_id' => $categoryId]);  // Передаем правильное значение параметра
$article = $stmt->fetch(PDO::FETCH_ASSOC);

// Логируем результат запроса
if ($article) {
    echo json_encode($article); // Если статья найдена, возвращаем ее
} else {
    echo json_encode(['message' => 'Статья не найдена']); // Если статьи нет
}
?>
