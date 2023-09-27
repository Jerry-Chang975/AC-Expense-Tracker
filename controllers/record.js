const db = require('../models');
const Record = db.Record;
const Category = db.Category;
const sequelize = require('sequelize');
const helpers = require('../utils/helpers');

async function getRecords(req, res) {
  try {
    // items
    const records = await Record.findAll({
      raw: true,
      attributes: [
        'id',
        'name',
        'date',
        'amount',
        'memo',
        [sequelize.col('Category.name'), 'categoryName'],
        [sequelize.col('Category.iconUrl'), 'categoryIconUrl'],
      ],
      where: { userId: req.user.id },
      order: [['date', 'DESC']],
      include: {
        model: Category,
        attributes: [],
      },
    });

    // convert date format (yyyy-mm-dd)
    records.forEach((record) => {
      record.date = helpers.dateConvert(record.date);
    });

    // categories
    const categories = await Category.findAll({
      raw: true,
      attributes: ['id', 'name'],
    });

    // total
    const totalAmount = await Record.sum('amount', {
      where: { userId: req.user.id },
    });

    return res.render('index', {
      records,
      totalAmount,
      categories,
      user: req.user,
    });
  } catch (err) {
    console.log(err);
  }
}

async function getCreatePage(req, res) {
  // categories
  const categories = await Category.findAll({
    raw: true,
    attributes: ['id', 'name'],
  });

  return res.render('create', {
    user: req.user,
    today: new Date().toISOString().slice(0, 10),
    categories,
  });
}

async function createRecord(req, res) {
  const { name, date, categoryId, amount } = req.body;
  console.log(req.body);
  try {
    Record.create({
      name,
      date,
      amount,
      categoryId,
      userId: req.user.id,
    });
    return res.redirect('/');
  } catch (err) {
    console.log(err);
    return res.redirect('/records/create');
  }
}

async function updateRecord(req, res) {}

async function deleteRecord(req, res) {}

module.exports = {
  getRecords,
  getCreatePage,
  createRecord,
  updateRecord,
  deleteRecord,
};
