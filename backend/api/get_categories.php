<?php
// Заголовки для CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

// Подключаем базу данных
require_once __DIR__ . '/../includes/db.php'; 

// Получаем данные из базы с учетом id
$query = "SELECT id, name, image FROM categories"; // Добавили поле id
$result = $pdo->query($query);

// Если запрос успешен, возвращаем список категорий в JSON-формате
if ($result) {
    $categories = $result->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($categories); // Возвращаем id, name и image
} else {
    echo json_encode(['message' => 'Ошибка получения категорий']);
}
?>
