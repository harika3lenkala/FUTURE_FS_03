<?php
require_once 'includes/db_config.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Collect and sanitize input data
    $name = htmlspecialchars(strip_tags($_POST['name']));
    $email = htmlspecialchars(strip_tags($_POST['email']));
    $phone = htmlspecialchars(strip_tags($_POST['phone']));
    $address = htmlspecialchars(strip_tags($_POST['address']));
    $notes = htmlspecialchars(strip_tags($_POST['notes']));
    $items = $_POST['cart_items']; // JSON string from hidden input
    $total = $_POST['cart_total'];

    try {
        // Prepare SQL statement
        $sql = "INSERT INTO orders (customer_name, email, phone, delivery_address, special_instructions, items, total_amount) 
                VALUES (:name, :email, :phone, :address, :notes, :items, :total)";
        
        $stmt = $pdo->prepare($sql);
        
        // Bind parameters
        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':phone', $phone);
        $stmt->bindParam(':address', $address);
        $stmt->bindParam(':notes', $notes);
        $stmt->bindParam(':items', $items);
        $stmt->bindParam(':total', $total);
        
        // Execute the statement
        if ($stmt->execute()) {
            $last_id = $pdo->lastInsertId();
            // Redirect to confirmation page
            header("Location: confirmation.php?id=" . $last_id);
            exit();
        } else {
            echo "Oops! Something went wrong. Please try again later.";
        }
    } catch (PDOException $e) {
        die("Error: " . $e->getMessage());
    }
} else {
    // If not POST, redirect to home
    header("Location: index.html");
    exit();
}
?>
