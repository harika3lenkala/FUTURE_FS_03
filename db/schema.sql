CREATE DATABASE IF NOT EXISTS brew_haven;
USE brew_haven;

CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    delivery_address TEXT NOT NULL,
    special_instructions TEXT,
    items TEXT NOT NULL, -- JSON string or comma-separated list
    total_amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50) DEFAULT 'Cash on Delivery',
    order_status ENUM('Pending', 'Preparing', 'Ready', 'Delivered', 'Cancelled') DEFAULT 'Pending',
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
