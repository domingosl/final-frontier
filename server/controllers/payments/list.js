const mongoose = require('mongoose');
const Transactions = mongoose.model('Transaction');

new utilities.express.Service('paymentList')
    .respondsAt('/payments')
    .isGet()
    .controller(async (req, res) => {

        const transactions = await Transactions.find().lean();

        res.resolve(transactions);

    });