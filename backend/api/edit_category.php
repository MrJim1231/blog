<?php
// Заголовки для CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

// Подключаем базу данных
require_once __DIR__ . '/../includes/db.php';

// Получаем "сырое" тело запроса
$data = json_decode(file_get_contents("php://input"), true);

// Проверка, что пришли все необходимые данные
if (isset($data['id'], $data['name'], $data['image'])) {
    $id = $data['id'];
    $name = $data['name'];
    $image = $data['image'];

    // Подготовка и выполнение запроса
    $query = "UPDATE categories SET name = :name, image = :image WHERE id = :id";
    $stmt = $pdo->prepare($query);

    if ($stmt->execute(['name' => $name, 'image' => $image, 'id' => $id])) {
        echo json_encode(['message' => 'Категория успешно обновлена']);
    } else {
        echo json_encode(['message' => 'Ошибка при обновлении категории']);
    }
} else {
    echo json_encode(['message' => 'Недостаточно данных для обновления']);
}
?>
