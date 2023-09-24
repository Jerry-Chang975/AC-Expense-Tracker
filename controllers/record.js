const db = require('../models');
const Record = db.Record;
const helpers = require('../utils/helpers');

async function getRecords(req, res) {
  try {
    // items
    let records = await Record.findAll({
      raw: true,
      where: { userId: req.user.id },
      order: [['date', 'DESC']],
    });

    // convert date format (yyyy-mm-dd)
    records.forEach((record) => {
      record.date = helpers.dateConvert(record.date);
    });

    // total
    let totalAmount = await Record.sum('amount', {
      where: { userId: req.user.id },
    });

    return res.render('index', { records, totalAmount, user: req.user });
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  getRecords,
};
