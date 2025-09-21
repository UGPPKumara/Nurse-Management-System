const express = require('express');
const router = express.Router();
const nurseController = require('../controllers/nurseController');

// GET all nurses
router.get('/', nurseController.getAllNurses);
// POST a new nurse
router.post('/', nurseController.createNurse);
// PUT to update a nurse
router.put('/:id', nurseController.updateNurse);
// DELETE a nurse
router.delete('/:id', nurseController.deleteNurse);

module.exports = router;