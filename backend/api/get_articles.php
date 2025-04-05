<?php
// Заголовки для CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

// Подключаем базу данных
require_once __DIR__ . '/../includes/db.php';

// Получаем ID категории из GET-запроса
$categoryId = $_GET['category'] ?? null;

if ($categoryId) {
    // Запрос для получения статей по категории
    try {
        $stmt = $pdo->prepare("SELECT a.id, a.title, a.content, a.category_id, a.image, a.created_at, c.name AS category_name
                               FROM articles a
                               JOIN categories c ON a.category_id = c.id
                               WHERE a.category_id = :category_id
                               ORDER BY a.created_at DESC");
        $stmt->execute(['category_id' => $categoryId]);
        $articles = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Если статьи найдены, отправляем их в формате JSON
        if ($articles) {
            echo json_encode($articles);
        } else {
            echo json_encode(['message' => 'Статьи в этой категории не найдены']);
        }
    } catch (PDOException $e) {
        // В случае ошибки возвращаем сообщение об ошибке
        echo json_encode(['message' => 'Ошибка при получении статей: ' . $e->getMessage()]);
    }
} else {
    // Если категория не передана
    echo json_encode(['message' => 'Не указана категория']);
}
?>
