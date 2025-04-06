<?php
// Заголовки для CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

// Подключаем базу данных
require_once __DIR__ . '/../includes/db.php'; 

// Получаем id категории из GET-запроса
$id = $_GET['id'] ?? null; 

// Проверяем, был ли передан id
if (!$id) {
    http_response_code(400); // Если ID не передан, отправляем ошибку 400
    exit;
}

try {
    // Получаем путь к изображению, которое связано с категорией
    $stmt = $pdo->prepare("SELECT image FROM categories WHERE id = :id");
    $stmt->execute(['id' => $id]);
    $category = $stmt->fetch(PDO::FETCH_ASSOC);

    // Если категория не найдена
    if (!$category) {
        http_response_code(404); // Если категория не найдена, отправляем ошибку 404
        exit;
    }

    // Проверяем, существует ли изображение и удаляем его
    if (!empty($category['image'])) {
        $imagePath = __DIR__ . '/../' . $category['image'];
        if (file_exists($imagePath)) {
            unlink($imagePath); // Удаляем изображение
        }
    }

    // Удаляем категорию из базы данных
    $stmt = $pdo->prepare("DELETE FROM categories WHERE id = :id");
    $stmt->execute(['id' => $id]);

    // После удаления категории, просто завершаем запрос, не отправляем сообщений
} catch (PDOException $e) {
    http_response_code(500); // Ошибка при удалении
    exit;
}
?>
