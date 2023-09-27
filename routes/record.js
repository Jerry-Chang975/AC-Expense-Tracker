const express = require('express');
const router = express.Router();

const recordController = require('../controllers/record');

router.get('/', recordController.getRecords);

router.get('/create', recordController.getCreatePage);

router.post('/', recordController.createRecord);

router.put('/:id', recordController.updateRecord);

router.delete('/:id', recordController.deleteRecord);

module.exports = router;
