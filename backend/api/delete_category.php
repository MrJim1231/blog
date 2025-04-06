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
    echo json_encode(['message' => 'ID категории не передан']);
    exit;
}

try {
    // Получаем путь к изображению, которое связано с категорией
    $stmt = $pdo->prepare("SELECT image FROM categories WHERE id = :id");
    $stmt->execute(['id' => $id]);
    $category = $stmt->fetch(PDO::FETCH_ASSOC);

    // Если категория не найдена
    if (!$category) {
        echo json_encode(['message' => 'Категория не найдена']);
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

    // Проверяем, была ли удалена категория
    if ($stmt->rowCount() > 0) {
        echo json_encode(['message' => 'Категория и изображение успешно удалены']);
    } else {
        echo json_encode(['message' => 'Категория не найдена']);
    }
} catch (PDOException $e) {
    echo json_encode(['message' => 'Ошибка при удалении категории: ' . $e->getMessage()]);
}
?>
