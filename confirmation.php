<?php
require_once 'includes/db_config.php';

$order_id = isset($_GET['id']) ? intval($_GET['id']) : 0;
$order = null;

if ($order_id > 0) {
    try {
        $stmt = $pdo->prepare("SELECT * FROM orders WHERE id = :id");
        $stmt->bindParam(':id', $order_id, PDO::PARAM_INT);
        $stmt->execute();
        $order = $stmt->fetch(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        // Silently handle error or log it
    }
}

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmation | Brew Haven Café</title>
    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&family=Montserrat:wght@400;600&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary-color: #8B4513;
            --secondary-color: #FFF8DC;
            --text-color: #3E2723;
            --bg-light: #FFFBED;
        }
        body {
            font-family: 'Montserrat', sans-serif;
            background-color: var(--bg-light);
            color: var(--text-color);
            min-height: 100vh;
            display: flex;
            align-items: center;
            padding: 40px 0;
        }
        h1, h2, h3, .brand {
            font-family: 'Merriweather', serif;
        }
        .confirmation-card {
            background: white;
            border-radius: 20px;
            box-shadow: 0 15px 40px rgba(0,0,0,0.1);
            overflow: hidden;
            border: none;
        }
        .card-header {
            background-color: var(--primary-color);
            color: white;
            padding: 30px;
            text-align: center;
            border: none;
        }
        .success-icon {
            font-size: 4rem;
            margin-bottom: 15px;
            color: #d4a373;
        }
        .order-details {
            padding: 40px;
        }
        .detail-row {
            padding: 12px 0;
            border-bottom: 1px solid #f0f0f0;
            display: flex;
            justify-content: space-between;
        }
        .detail-label {
            font-weight: 600;
            color: var(--primary-color);
        }
        .detail-value {
            text-align: right;
        }
        .items-list {
            background: var(--bg-light);
            padding: 20px;
            border-radius: 10px;
            margin: 20px 0;
        }
        .btn-group-custom {
            display: flex;
            gap: 15px;
            margin-top: 30px;
        }
        .btn-home {
            background-color: var(--primary-color);
            color: white;
            border-radius: 50px;
            padding: 12px 30px;
            font-weight: 600;
            flex: 1;
        }
        .btn-home:hover {
            background-color: #5D2E0A;
            color: white;
        }
        .btn-status {
            border: 2px solid var(--primary-color);
            color: var(--primary-color);
            border-radius: 50px;
            padding: 12px 30px;
            font-weight: 600;
            flex: 1;
        }
        .btn-status:hover {
            background-color: var(--primary-color);
            color: white;
        }
        .error-container {
            text-align: center;
            padding: 60px;
        }
        .error-icon {
            font-size: 5rem;
            color: #dc3545;
            margin-bottom: 20px;
        }
    </style>
</head>
<body>

<div class="container">
    <div class="row justify-content-center">
        <div class="col-lg-8">
            <?php if ($order): ?>
                <div class="confirmation-card">
                    <div class="card-header">
                        <div class="success-icon animate__animated animate__zoomIn">
                            <i class="fas fa-check-circle"></i>
                        </div>
                        <h2 class="mb-0">Order Confirmed!</h2>
                        <p class="mb-0 opacity-75">Thank you, your order has been received.</p>
                    </div>
                    
                    <div class="order-details">
                        <h4 class="mb-4">Order Summary</h4>
                        
                        <div class="detail-row">
                            <span class="detail-label">Order ID</span>
                            <span class="detail-value text-muted font-monospace">#<?php echo $order['id']; ?></span>
                        </div>
                        
                        <div class="detail-row">
                            <span class="detail-label">Date</span>
                            <span class="detail-value"><?php echo date('M d, Y h:i A', strtotime($order['order_date'])); ?></span>
                        </div>
                        
                        <div class="detail-row">
                            <span class="detail-label">Status</span>
                            <span class="detail-value"><span class="badge bg-warning text-dark"><?php echo $order['order_status']; ?></span></span>
                        </div>

                        <hr class="my-4">

                        <h5 class="mb-3">Customer Information</h5>
                        <div class="detail-row">
                            <span class="detail-label">Name</span>
                            <span class="detail-value"><?php echo htmlspecialchars($order['customer_name']); ?></span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Email</span>
                            <span class="detail-value"><?php echo htmlspecialchars($order['email']); ?></span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Phone</span>
                            <span class="detail-value"><?php echo htmlspecialchars($order['phone']); ?></span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Address</span>
                            <span class="detail-value"><?php echo nl2br(htmlspecialchars($order['delivery_address'])); ?></span>
                        </div>

                        <hr class="my-4">

                        <h5 class="mb-3">Order Items</h5>
                        <div class="items-list">
                            <?php 
                            $items = json_decode($order['items'], true);
                            if ($items && is_array($items)) {
                                foreach ($items as $item) {
                                    echo '<div class="summary-item d-flex justify-content-between mb-2">';
                                    echo '<span>' . $item['quantity'] . 'x ' . htmlspecialchars($item['name']) . '</span>';
                                    echo '<span>$' . number_format($item['price'] * $item['quantity'], 2) . '</span>';
                                    echo '</div>';
                                }
                            } else {
                                echo '<p class="mb-0">' . htmlspecialchars($order['items']) . '</p>';
                            }
                            ?>
                            <div class="detail-row border-0 mt-3 pt-3 border-top border-secondary">
                                <span class="detail-label fs-5">Total Paid</span>
                                <span class="detail-value fs-5 fw-bold">$<?php echo number_format($order['total_amount'], 2); ?></span>
                            </div>
                        </div>

                        <div class="detail-row border-0">
                            <span class="detail-label">Payment Method</span>
                            <span class="detail-value"><?php echo $order['payment_method']; ?></span>
                        </div>

                        <div class="btn-group-custom">
                            <a href="index.html" class="btn btn-home text-decoration-none">
                                <i class="fas fa-home me-2"></i>Back to Home
                            </a>
                            <button class="btn btn-status" onclick="window.location.reload()">
                                <i class="fas fa-sync-alt me-2"></i>Check Status
                            </button>
                        </div>
                    </div>
                </div>
            <?php else: ?>
                <div class="confirmation-card">
                    <div class="error-container">
                        <div class="error-icon">
                            <i class="fas fa-exclamation-triangle"></i>
                        </div>
                        <h2 class="text-danger">Invalid Order ID</h2>
                        <p class="text-muted mb-4">We couldn't find the order you're looking for. Please check the ID or try again.</p>
                        <a href="index.html" class="btn btn-home text-decoration-none">
                            <i class="fas fa-home me-2"></i>Back to Home
                        </a>
                    </div>
                </div>
            <?php endif; ?>
        </div>
    </div>
</div>

<!-- Bootstrap 5 JS Bundle -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
