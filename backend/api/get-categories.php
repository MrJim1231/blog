<?php
require_once __DIR__ . '/../includes/db.php';
header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json');

$stmt = $pdo->query("SELECT id, name FROM categories ORDER BY id ASC");
$categories = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($categories);
