const Item = require('../models/Item');

// Create
const addItem = async (data) => {
  const item = new Item(data);
  return await item.save();
};

// Read All with Pagination + Search
const getItems = async ({ page = 1, limit = 10, search = '' }) => {
  const query = {
    isDeleted: false,
    ...(search && { title: new RegExp(search, 'i') })
  };

  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    Item.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Item.countDocuments(query)
  ]);

  return {
    items,
    total,
    page,
    totalPages: Math.ceil(total / limit)
  };
};

// Read One
const getItemById = async (id) => {
  return await Item.findOne({ _id: id, isDeleted: false });
};

// Update
const updateItem = async (id, data) => {
  return await Item.findOneAndUpdate(
    { _id: id, isDeleted: false },
    data,
    { new: true, runValidators: true }
  );
};

// Soft Delete
const softDeleteItem = async (id) => {
  return await Item.findByIdAndUpdate(
    id,
    { isDeleted: true, deletedAt: new Date() },
    { new: true }
  );
};

// Restore
const restoreItem = async (id) => {
  return await Item.findByIdAndUpdate(
    id,
    { isDeleted: false, deletedAt: null },
    { new: true }
  );
};

// Count items (active vs deleted)
const countItems = async () => {
  const [active, deleted] = await Promise.all([
    Item.countDocuments({ isDeleted: false }),
    Item.countDocuments({ isDeleted: true })
  ]);
  return { active, deleted };
};

// Filter by creation date
const getItemsByDate = async (start, end) => {
  return await Item.find({
    isDeleted: false,
    createdAt: { $gte: new Date(start), $lte: new Date(end) }
  }).sort({ createdAt: -1 });
};

module.exports = {
  addItem,
  getItems,
  getItemById,
  updateItem,
  softDeleteItem,
  restoreItem,
  countItems,
  getItemsByDate
};
