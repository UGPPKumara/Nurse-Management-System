const DailyLog = require('../models/DailyLog');
const Nurse = require('../models/Nurse');
const Client = require('../models/Client');

exports.getAllLogs = async (req, res) => {
    try {
        const logs = await DailyLog.findAll({
            include: [
                { model: Nurse, attributes: ['name'] },
                { model: Client, attributes: ['name', 'address'] }
            ],
            order: [['date', 'DESC'], ['time', 'DESC']]
        });
        res.json(logs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createLog = async (req, res) => {
    try {
        const log = await DailyLog.create(req.body);
        res.status(201).json(log);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteLog = async (req, res) => {
    try {
        const deleted = await DailyLog.destroy({ where: { id: req.params.id } });
        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'Log not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};