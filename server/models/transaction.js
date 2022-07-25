const mongoose = require('mongoose');

const tagLabel = 'transactionModel';

const TransactionsSchema = new mongoose.Schema(
    {
        rapydId: {
            type: String,
            required: true
        },
        bankAccount: {},
        amount: {
            type: Number,
            required: true
        },
        currency: {
            type: String,
            maxLength: 3,
            required: true
        },
        createdAt: {
            type: Number,
            required: true
        },
        flight: {},
        type: {
            type: String
        },
        travelerName: {
            type: String,
            required: true,
            maxLength: 150,
        },
        travelerLastName: {
            type: String,
            required: true,
            maxLength: 150,
        },
        travelerDocumentType: {
            type: String,
            required: true,
        },
        travelerDocumentNumber: {
            type: String,
            required: true
        }
    }, { collection: 'transactions', timestamps: true });



module.exports = exports = mongoose.model('Transaction', TransactionsSchema);