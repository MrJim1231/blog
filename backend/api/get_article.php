<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

require_once __DIR__ . '/../includes/db.php';

$articleId = $_GET['id'] ?? null;

if ($articleId) {
    try {
        // Запрос с измененным полем images
        $stmt = $pdo->prepare("SELECT a.id, a.title, a.content, a.category_id, a.images, a.created_at, c.name AS category_name
                               FROM articles a
                               JOIN categories c ON a.category_id = c.id
                               WHERE a.id = :id");
        $stmt->execute(['id' => $articleId]);
        $article = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($article) {
            // Обрабатываем поле images (если оно есть)
            $article['images'] = json_decode($article['images'], true);
            if ($article['images']) {
                foreach ($article['images'] as &$image) {
                    $image = 'http://localhost/blog/backend/' . $image; // Добавляем полный путь
                }
            }

            // Экранируем контент для безопасного отображения в HTML
            $article['content'] = htmlspecialchars($article['content']);

            // Отправляем статью в формате JSON
            echo json_encode($article);
        } else {
            echo json_encode(['message' => 'Статья не найдена']);
        }
    } catch (PDOException $e) {
        echo json_encode(['message' => 'Ошибка при получении статьи: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['message' => 'Не указан ID статьи']);
}
?>
