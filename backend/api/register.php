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

$input = json_decode(file_get_contents("php://input"), true);
$username = trim($input['username'] ?? '');
$email = trim($input['email'] ?? '');
$password = $input['password'] ?? '';
$role = $input['role'] ?? 'user';

if (empty($username) || empty($email) || empty($password)) {
    echo json_encode(['message' => 'Все поля обязательны']);
    exit;
}

if (!in_array($role, ['admin', 'user'])) {
    $role = 'user';
}

$hashedPassword = password_hash($password, PASSWORD_BCRYPT);

try {
    $stmt = $pdo->prepare("INSERT INTO users (username, email, password, role) VALUES (:username, :email, :password, :role)");
    $stmt->execute([
        'username' => $username,
        'email' => $email,
        'password' => $hashedPassword,
        'role' => $role
    ]);
    echo json_encode(['message' => 'Регистрация успешна']);
} catch (PDOException $e) {
    echo json_encode(['message' => 'Ошибка регистрации: ' . $e->getMessage()]);
}
