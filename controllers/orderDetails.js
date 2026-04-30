const models = require('../models');
const { OrderDetail, Product, Order } = models;

const detailInclude = [
  { model: Product, as: 'product', required: false },
  { model: Order, as: 'order', required: false },
];

function serializeDetail(row) {
  const plain = row.get({ plain: true });
  const out = { ...plain };
  out.createdDate = plain.createdAt;
  if (plain.product) {
    out.product = plain.product;
  }
  if (plain.order) {
    out.order = plain.order;
  }
  return out;
}

exports.list = async function (req, res, next) {
  try {
    const rows = await OrderDetail.findAll({
      include: detailInclude,
      order: [['createdAt', 'DESC']],
    });
    res.json(rows.map(serializeDetail));
  } catch (err) {
    next(err);
  }
};

exports.create = async function (req, res, next) {
  console.log(req.body);
  console.log(req.body.orderId);
  try {
    const b = req.body || {};
    const price = Number(b.price != null ? b.price : b.currentPrice) || 0;
    const created = await OrderDetail.create({
      orderId: Number(b.orderId),
      productId: Number(b.productId),
      quantity: Number(b.quantity) || 0,
      discount: Number(b.discount) || 0,
      totalPrice: Number(b.totalPrice) || 0,
      price,
    });

    console.log(created);

    const full = await OrderDetail.findByPk(created.id, { include: detailInclude });
    console.log(full);
    res.json(serializeDetail(full));
  } catch (err) {
    console.log(err);
    next(err);
  }
};
