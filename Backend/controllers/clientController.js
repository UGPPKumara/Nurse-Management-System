const Client = require('../models/Client');

exports.getAllClients = async (req, res) => {
    try {
        const clients = await Client.findAll();
        res.json(clients);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createClient = async (req, res) => {
    try {
        const client = await Client.create(req.body);
        res.status(201).json(client);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.updateClient = async (req, res) => {
    try {
        const [updated] = await Client.update(req.body, { where: { id: req.params.id } });
        if (updated) {
            const updatedClient = await Client.findByPk(req.params.id);
            res.status(200).json(updatedClient);
        } else {
            res.status(404).json({ message: 'Client not found' });
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteClient = async (req, res) => {
    try {
        const deleted = await Client.destroy({ where: { id: req.params.id } });
        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'Client not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};