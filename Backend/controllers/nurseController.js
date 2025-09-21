const Nurse = require('../models/Nurse');

// Get all nurses
exports.getAllNurses = async (req, res) => {
    try {
        const nurses = await Nurse.findAll();
        res.json(nurses);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Create a new nurse
exports.createNurse = async (req, res) => {
    try {
        const nurse = await Nurse.create(req.body);
        res.status(201).json(nurse);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Update a nurse
exports.updateNurse = async (req, res) => {
    try {
        const [updated] = await Nurse.update(req.body, {
            where: { id: req.params.id }
        });
        if (updated) {
            const updatedNurse = await Nurse.findByPk(req.params.id);
            res.status(200).json(updatedNurse);
        } else {
            res.status(404).json({ message: 'Nurse not found' });
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete a nurse
exports.deleteNurse = async (req, res) => {
    try {
        const deleted = await Nurse.destroy({
            where: { id: req.params.id }
        });
        if (deleted) {
            res.status(204).send(); // No Content
        } else {
            res.status(404).json({ message: 'Nurse not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};