<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(204);
    exit();
}

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "chat";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$requestMethod = $_SERVER["REQUEST_METHOD"];

switch ($requestMethod) {
    case 'GET':
        getMessages($conn);
        break;
    case 'POST':
        saveMessage($conn);
        break;
    case 'DELETE':
        deleteMessages($conn);
        break;
    default:
        http_response_code(405);
        echo json_encode(["status" => "error", "message" => "Method not allowed"]);
        break;
}

function getMessages($conn) {
    $sql = "SELECT * FROM messages ORDER BY created_at ASC";
    $result = $conn->query($sql);

    $messages = [];
    while($row = $result->fetch_assoc()) {
        $messages[] = $row;
    }

    echo json_encode($messages);
}

function saveMessage($conn) {
    $data = json_decode(file_get_contents("php://input"), true);

    if (isset($data['text']) && isset($data['sender'])) {
        $text = $conn->real_escape_string($data['text']);
        $sender = $conn->real_escape_string($data['sender']);

        $sql = "INSERT INTO messages (text, sender) VALUES ('$text', '$sender')";
        
        if ($conn->query($sql) === TRUE) {
            echo json_encode(["status" => "success"]);
        } else {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Error: " . $sql . "<br>" . $conn->error]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Invalid input"]);
    }
}

function deleteMessages($conn) {
    $sql = "DELETE FROM messages";
    
    if ($conn->query($sql) === TRUE) {
        echo json_encode(["status" => "success"]);
    } else {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Error: " . $sql . "<br>" . $conn->error]);
    }
}

$conn->close();
?>
