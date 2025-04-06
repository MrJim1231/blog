<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../includes/db.php';

// Получаем данные из запроса
$input = json_decode(file_get_contents("php://input"), true);
$articleId = $input['id'] ?? null;

if (!$articleId) {
    echo json_encode(['message' => 'ID статьи не передан']);
    exit;
}

try {
    // Получаем информацию о статье, чтобы получить пути к изображениям
    $stmt = $pdo->prepare("SELECT images FROM articles WHERE id = :id");
    $stmt->execute(['id' => $articleId]);
    $article = $stmt->fetch(PDO::FETCH_ASSOC);

    // Если статья не найдена
    if (!$article) {
        echo json_encode(['message' => 'Статья не найдена']);
        exit;
    }

    // Декодируем пути к изображениям
    $images = json_decode($article['images'], true);

    // Удаляем изображения с сервера
    if ($images && is_array($images)) {
        foreach ($images as $imagePath) {
            $fullImagePath = __DIR__ . '/../' . $imagePath;
            if (file_exists($fullImagePath)) {
                unlink($fullImagePath); // Удаляем изображение
            }
        }
    }

    // Удаляем статью из базы данных
    $stmt = $pdo->prepare("DELETE FROM articles WHERE id = :id");
    $stmt->execute(['id' => $articleId]);

    if ($stmt->rowCount() > 0) {
        echo json_encode(['message' => 'Статья успешно удалена']);
    } else {
        echo json_encode(['message' => 'Ошибка при удалении статьи']);
    }
} catch (PDOException $e) {
    echo json_encode(['message' => 'Ошибка при удалении статьи: ' . $e->getMessage()]);
}
?>
