const db = require('../models');
const Record = db.Record;

async function getRecords(req, res) {
  try {
    // items
    let records = await Record.findAll({
      raw: true,
      where: { userId: req.user.id },
      order: [['date', 'DESC']],
    });

    // total
    let totalAmount = await Record.sum('amount', {
      where: { userId: req.user.id },
    });

    return res.render('index', { records, totalAmount });
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  getRecords,
};
