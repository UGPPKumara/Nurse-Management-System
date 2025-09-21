const express = require('express');
const router = express.Router();
const dailyLogController = require('../controllers/dailyLogController');

router.get('/', dailyLogController.getAllLogs);
router.post('/', dailyLogController.createLog);
router.delete('/:id', dailyLogController.deleteLog);

module.exports = router;