const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        price: {
            type: Number,
            required: true
        },
        size: String,
        color: String
    }],
    shippingAddress: {
        fullName: String,
        phone: String,
        address: String,
        city: String,
        district: String,
        ward: String
    },
    paymentMethod: {
        type: String,
        enum: ['cod', 'momo', 'banking'],
        default: 'cod'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed'],
        default: 'pending'
    },
    orderStatus: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    totalAmount: {
        type: Number,
        required: true
    },
    shippingFee: {
        type: Number,
        default: 0
    },
    note: String,
    trackingNumber: String,
    deliveredAt: Date,
    cancelledAt: Date,
    reasonForCancellation: String,
    orderNumber: {
        type: String,
        unique: true
    }
}, {
    timestamps: true
});

// Tạo order number tự động
orderSchema.pre('save', async function(next) {
    if (!this.orderNumber) {
        const count = await mongoose.models.Order.countDocuments();
        this.orderNumber = `ORD${Date.now().toString().slice(-6)}${(count + 1).toString().padStart(4, '0')}`;
    }
    next();
});

module.exports = mongoose.model('Order', orderSchema);