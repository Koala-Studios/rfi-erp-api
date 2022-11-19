module.exports = {
  async up(db, client) {
    const inserted_codes = [];
    await db
    .collection("inventory")
    .find()
    .forEach(function (Inventory) {
          db.collection("formulas").updateMany(
            { product_code: Inventory.product_code }, 
            { $set: { "product_id": Inventory._id } }
          );
    });
  },

  async down(db, client) {
    db
    .collection("formulas")
    .updateMany({},{ $unset: {product_id: ""  } });
  }
};
