<?php
// Заголовки для CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

// Подключаем базу данных
require_once __DIR__ . '/../includes/db.php'; 

// Получаем данные из базы
$query = "SELECT name, image FROM categories";
$result = $pdo->query($query);

// Если запрос успешен, возвращаем список категорий в JSON-формате
if ($result) {
    $categories = $result->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($categories);
} else {
    echo json_encode(['message' => 'Ошибка получения категорий']);
}
?>
