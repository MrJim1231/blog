<?php
// Подключаем конфиг с данными для подключения
require_once __DIR__ . '/../config.php'; // Подключаем конфиг

// Создаем подключение с использованием данных из конфига
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
?>
