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

module.exports = {
  getRecords,
};
