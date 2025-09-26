const service = require('../services/itemService');

// Create
const createItem = async (req, res) => {
  try {
    const item = await service.addItem(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

// Get All with pagination & search
const getItems = async (req, res) => {
  try {
    const { page, limit, search } = req.query;
    const result = await service.getItems({
      page: Number(page) || 1,
      limit: Number(limit) || 10,
      search: search || ''
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get One
const getItemById = async (req, res) => {
  try {
    const item = await service.getItemById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch {
    res.status(400).json({ message: 'Invalid ID format' });
  }
};

// Update
const updateItem = async (req, res) => {
  try {
    const item = await service.updateItem(req.params.id, req.body);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Soft delete
const softDeleteItem = async (req, res) => {
  try {
    const item = await service.softDeleteItem(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json({ message: 'Item soft deleted', item });
  } catch {
    res.status(400).json({ message: 'Invalid ID format' });
  }
};

// Restore
const restoreItem = async (req, res) => {
  try {
    const item = await service.restoreItem(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json({ message: 'Item restored', item });
  } catch {
    res.status(400).json({ message: 'Invalid ID format' });
  }
};

// Count
const countItems = async (req, res) => {
  try {
    const counts = await service.countItems();
    res.json(counts);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Filter by date
const getItemsByDate = async (req, res) => {
  try {
    const { start, end } = req.query;
    if (!start || !end) {
      return res.status(400).json({ message: 'Start and End dates are required' });
    }
    const items = await service.getItemsByDate(start, end);
    res.json(items);
  } catch {
    res.status(400).json({ message: 'Invalid date format' });
  }
};

module.exports = {
  createItem,
  getItems,
  getItemById,
  updateItem,
  softDeleteItem,
  restoreItem,
  countItems,
  getItemsByDate
};
