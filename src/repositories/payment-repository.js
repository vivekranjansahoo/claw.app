const { Payment } = require('../models')
const CrudRepository = require('./crud-repository');

class PaymentRepository extends CrudRepository {
    constructor() {
        super(Payment);
    }

    async updateByPaymentIntentId(paymentIntentId, data) {
        try {
            const updatedRecord = await this.model.findOneAndUpdate({ paymentIntentId }, data);
            return updatedRecord;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = PaymentRepository;