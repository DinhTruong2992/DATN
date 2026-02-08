const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Tạo đơn hàng
exports.createOrder = async (req, res) => {
    try {
        console.log('=== START CREATE ORDER ===');
        console.log('User ID:', req.user ? req.user.id : 'No user');
        console.log('Session user:', req.session.user);
        console.log('Request body:', req.body);

        // Kiểm tra đăng nhập
        if (!req.session.user && !req.user) {
            console.log('User not logged in');
            return res.status(401).json({ 
                success: false, 
                message: 'Vui lòng đăng nhập để đặt hàng' 
            });
        }

        const userId = req.user ? req.user.id : req.session.user._id;
        const { shippingAddress, paymentMethod, note } = req.body;

        console.log('User ID for order:', userId);
        console.log('Shipping address:', shippingAddress);

        // Lấy giỏ hàng của user
        const cart = await Cart.findOne({ user: userId }).populate('items.product');
        console.log('Found cart:', cart ? 'Yes' : 'No');
        
        if (!cart || cart.items.length === 0) {
            console.log('Cart is empty');
            return res.status(400).json({ 
                success: false, 
                message: 'Giỏ hàng trống' 
            });
        }

        console.log('Cart items:', cart.items.length);

        // Kiểm tra số lượng tồn kho
        for (const item of cart.items) {
            const product = await Product.findById(item.product._id);
            if (!product) {
                return res.status(400).json({
                    success: false,
                    message: `Sản phẩm ${item.product.name} không tồn tại`
                });
            }
            
            if (product.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Sản phẩm ${item.product.name} chỉ còn ${product.stock} sản phẩm trong kho`
                });
            }
        }

        // Tính tổng tiền
        let totalAmount = 0;
        const orderItems = cart.items.map(item => {
            const itemTotal = item.product.price * item.quantity;
            totalAmount += itemTotal;
            
            console.log(`Item: ${item.product.name}, Quantity: ${item.quantity}, Price: ${item.product.price}, Total: ${itemTotal}`);
            
            return {
                product: item.product._id,
                quantity: item.quantity,
                price: item.product.price,
                size: item.size || '',
                color: item.color || ''
            };
        });

        // Tính phí vận chuyển
        const shippingFee = totalAmount >= 1000000 ? 0 : 30000;
        const finalTotal = totalAmount + shippingFee;

        console.log('Total amount:', totalAmount);
        console.log('Shipping fee:', shippingFee);
        console.log('Final total:', finalTotal);

        // Tạo đơn hàng
        const order = new Order({
            user: userId,
            items: orderItems,
            shippingAddress: {
                fullName: shippingAddress.fullName || '',
                phone: shippingAddress.phone || '',
                address: shippingAddress.address || '',
                city: shippingAddress.city || '',
                district: shippingAddress.district || '',
                ward: shippingAddress.ward || ''
            },
            paymentMethod: paymentMethod || 'cod',
            paymentStatus: 'pending',
            orderStatus: 'pending',
            totalAmount: finalTotal,
            shippingFee: shippingFee,
            note: note || ''
        });

        console.log('Order to save:', order);

        // Lưu đơn hàng
        await order.save();
        console.log('Order saved successfully. Order ID:', order._id);

        // Cập nhật số lượng tồn kho
        for (const item of cart.items) {
            await Product.findByIdAndUpdate(
                item.product._id,
                { $inc: { stock: -item.quantity } }
            );
        }

        // Xóa giỏ hàng sau khi tạo đơn hàng
        cart.items = [];
        await cart.save();
        console.log('Cart cleared');

        console.log('=== END CREATE ORDER ===');

        res.status(201).json({
            success: true,
            order: {
                _id: order._id,
                orderNumber: order.orderNumber,
                totalAmount: order.totalAmount,
                items: order.items,
                shippingAddress: order.shippingAddress,
                createdAt: order.createdAt
            },
            message: 'Đơn hàng đã được tạo thành công'
        });

    } catch (error) {
        console.error('=== ERROR CREATE ORDER ===');
        console.error('Error:', error);
        console.error('Error stack:', error.stack);
        
        // Log lỗi chi tiết
        if (error.name === 'ValidationError') {
            const errors = {};
            for (const field in error.errors) {
                errors[field] = error.errors[field].message;
            }
            console.error('Validation errors:', errors);
        }
        
        res.status(500).json({ 
            success: false, 
            message: 'Lỗi server: ' + error.message,
            error: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

// Lấy tất cả đơn hàng của user
exports.getUserOrders = async (req, res) => {
    try {
        console.log('=== GET USER ORDERS ===');
        console.log('User ID:', req.user ? req.user.id : req.session.user._id);

        const userId = req.user ? req.user.id : req.session.user._id;
        const orders = await Order.find({ user: userId })
            .populate('items.product')
            .sort({ createdAt: -1 });

        console.log('Found orders:', orders.length);

        res.json({ 
            success: true, 
            orders: orders.map(order => ({
                _id: order._id,
                orderNumber: order.orderNumber,
                items: order.items,
                totalAmount: order.totalAmount,
                orderStatus: order.orderStatus,
                paymentMethod: order.paymentMethod,
                createdAt: order.createdAt,
                itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0)
            }))
        });
    } catch (error) {
        console.error('Error getting user orders:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Lỗi server' 
        });
    }
};

// Lấy chi tiết đơn hàng
exports.getOrderDetail = async (req, res) => {
    try {
        console.log('=== GET ORDER DETAIL ===');
        console.log('Order ID:', req.params.id);
        console.log('User ID:', req.user ? req.user.id : req.session.user._id);

        const orderId = req.params.id;
        const userId = req.user ? req.user.id : req.session.user._id;

        const order = await Order.findOne({ 
            _id: orderId, 
            user: userId 
        })
        .populate('items.product')
        .populate('user', 'name email phone');

        if (!order) {
            console.log('Order not found');
            return res.status(404).json({ 
                success: false, 
                message: 'Không tìm thấy đơn hàng' 
            });
        }

        console.log('Order found:', order.orderNumber);

        res.json({ 
            success: true, 
            order: {
                _id: order._id,
                orderNumber: order.orderNumber,
                items: order.items,
                shippingAddress: order.shippingAddress,
                paymentMethod: order.paymentMethod,
                paymentStatus: order.paymentStatus,
                orderStatus: order.orderStatus,
                totalAmount: order.totalAmount,
                shippingFee: order.shippingFee,
                note: order.note,
                trackingNumber: order.trackingNumber,
                createdAt: order.createdAt,
                deliveredAt: order.deliveredAt,
                cancelledAt: order.cancelledAt
            }
        });
    } catch (error) {
        console.error('Error getting order detail:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Lỗi server' 
        });
    }
};

// Hủy đơn hàng
exports.cancelOrder = async (req, res) => {
    try {
        console.log('=== CANCEL ORDER ===');
        console.log('Order ID:', req.params.id);
        console.log('Reason:', req.body.reason);

        const orderId = req.params.id;
        const userId = req.user ? req.user.id : req.session.user._id;
        const { reason } = req.body;

        const order = await Order.findOne({ _id: orderId, user: userId });

        if (!order) {
            return res.status(404).json({ 
                success: false, 
                message: 'Không tìm thấy đơn hàng' 
            });
        }

        // Chỉ cho phép hủy khi đơn hàng đang ở trạng thái pending
        if (order.orderStatus !== 'pending') {
            return res.status(400).json({ 
                success: false, 
                message: 'Không thể hủy đơn hàng ở trạng thái hiện tại' 
            });
        }

        // Hoàn trả số lượng tồn kho
        for (const item of order.items) {
            await Product.findByIdAndUpdate(
                item.product,
                { $inc: { stock: item.quantity } }
            );
        }

        order.orderStatus = 'cancelled';
        order.reasonForCancellation = reason;
        order.cancelledAt = new Date();
        await order.save();

        console.log('Order cancelled successfully');

        res.json({ 
            success: true, 
            message: 'Đã hủy đơn hàng thành công' 
        });
    } catch (error) {
        console.error('Error cancelling order:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Lỗi server' 
        });
    }
};

// Admin: Lấy tất cả đơn hàng
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user', 'name email')
            .populate('items.product')
            .sort({ createdAt: -1 });

        res.json({ 
            success: true, 
            orders,
            total: orders.length
        });
    } catch (error) {
        console.error('Error getting all orders:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Lỗi server' 
        });
    }
};

// Admin: Cập nhật trạng thái đơn hàng
exports.updateOrderStatus = async (req, res) => {
    try {
        const orderId = req.params.id;
        const { orderStatus, trackingNumber } = req.body;

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ 
                success: false, 
                message: 'Không tìm thấy đơn hàng' 
            });
        }

        order.orderStatus = orderStatus;
        if (trackingNumber) order.trackingNumber = trackingNumber;
        
        if (orderStatus === 'delivered') {
            order.deliveredAt = new Date();
            order.paymentStatus = 'paid'; // Tự động đánh dấu đã thanh toán khi giao hàng thành công
        }

        await order.save();

        res.json({ 
            success: true, 
            message: 'Cập nhật trạng thái thành công' 
        });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Lỗi server' 
        });
    }
};