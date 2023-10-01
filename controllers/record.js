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
  } catch (error) {
    console.log(error);
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
  if (!name || !date || !categoryId || !amount) {
    req.flash('error', 'All column must be filled');
    return res.redirect('/records/create');
  }
  if (amount > 99999999) {
    req.flash('error', 'Amount must be less than 99999999');
    return res.redirect('/records/create');
  }
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
  } catch (error) {
    console.log(error);
    return res.redirect('/records/create');
  }
}

async function getEditPage(req, res) {
  const { id } = req.params;
  const record = await Record.findOne({
    where: { id, userId: req.user.id },
  });
  if (!record) {
    console.log('item not found');
    req.flash('error', 'item not found');
    return res.redirect('/records');
  }
  // categories
  const categories = await Category.findAll({
    raw: true,
    attributes: ['id', 'name'],
  });
  return res.render('edit', {
    id,
    user: req.user,
    name: record.name,
    date: helpers.dateConvert(record.date),
    amount: record.amount,
    selectedCategory: categories.find((e) => e.id === record.categoryId),
    categories,
  });
}

async function updateRecord(req, res) {
  const { id } = req.params;
  const { name, date, categoryId, amount } = req.body;
  if (!name || !date || !categoryId || !amount) {
    req.flash('error', 'All column must be filled');
    return res.redirect('/records/create');
  }
  if (amount > 99999999) {
    req.flash('error', 'Amount must be less than 99999999');
    return res.redirect('/records/create');
  }
  try {
    await Record.update(
      {
        name,
        date,
        categoryId,
        amount,
      },
      {
        where: { id, userId: req.user.id },
      }
    );
    return res.redirect('/');
  } catch (error) {
    console.log(error);
    return res.redirect(`/records/edit/${id}`);
  }
}

async function deleteRecord(req, res) {
  const { id } = req.params;
  try {
    await Record.destroy({
      where: { id, userId: req.user.id },
    });
    return res.redirect('/');
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  getRecords,
  getCreatePage,
  createRecord,
  getEditPage,
  updateRecord,
  deleteRecord,
};
