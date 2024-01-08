const { Client } = require('../models')
const CrudRepository = require('./crud-repository');

class ClientRepository extends CrudRepository {
    constructor() {
        super(Client);
    }

    async getClientById(id) {
        try {
            const client = await Client.findById(id).exec();
            return client;
        } catch (error) {
            throw error;
        }
    }

    async getClientByEmail(email) {
        try {
            const client = await Client.findOne({ email });
            return client;
        } catch (error) {
            throw error;
        }
    }

    async getClientByUsername(username) {
        try {
            const user = await Client.findOne({ username });
            return user;
        } catch (error) {
            throw error;
        }
    }

}

module.exports = ClientRepository;