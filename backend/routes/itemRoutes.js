const express = require('express');
const router = express.Router();

const controller = require('../controllers/itemController');
const { validateItem } = require('../validators/itemValidator');

// CRUD
router.post('/', validateItem, controller.createItem);
router.get('/', controller.getItems);
router.get('/:id', controller.getItemById);
router.put('/:id', validateItem, controller.updateItem);

// Extra logic
router.delete('/:id', controller.softDeleteItem);
router.patch('/:id/restore', controller.restoreItem);
router.get('/count/all', controller.countItems);
router.get('/filter/date', controller.getItemsByDate);

module.exports = router;
