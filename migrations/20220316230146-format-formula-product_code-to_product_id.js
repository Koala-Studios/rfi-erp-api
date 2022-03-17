module.exports = {
  async up(db, client) {
    const inserted_codes = [];
    await db
    .collection("products")
    .find()
    .forEach(function (Product) {
          db.collection("formulas").updateMany(
            { product_code: Product.product_code }, 
            { $set: { "product_id": Product._id } }
          );
    });
  },

  async down(db, client) {
    db
    .collection("formulas")
    .updateMany({},{ $unset: {product_id: ""  } });
  }
};
