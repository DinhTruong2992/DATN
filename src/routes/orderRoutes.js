const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Middleware kiểm tra đăng nhập
const requireAuth = (req, res, next) => {
    console.log('=== CHECKING AUTH FOR ORDER ===');
    console.log('Session:', req.session);
    console.log('Session user:', req.session.user);
    console.log('Request user:', req.user);
    
    if (!req.session.user && !req.user) {
        console.log('User not authenticated');
        return res.status(401).json({ 
            success: false, 
            message: 'Vui lòng đăng nhập' 
        });
    }
    console.log('User authenticated');
    next();
};

// Tạo đơn hàng mới
router.post('/', requireAuth, orderController.createOrder);

// Lấy tất cả đơn hàng của user
router.get('/', requireAuth, orderController.getUserOrders);

// Lấy chi tiết đơn hàng
router.get('/:id', requireAuth, orderController.getOrderDetail);

// Hủy đơn hàng
router.put('/:id/cancel', requireAuth, orderController.cancelOrder);

// Admin: Lấy tất cả đơn hàng (cần middleware admin)
router.get('/admin/all', requireAuth, orderController.getAllOrders);

// Admin: Cập nhật trạng thái đơn hàng
router.put('/admin/:id/status', requireAuth, orderController.updateOrderStatus);

module.exports = router;