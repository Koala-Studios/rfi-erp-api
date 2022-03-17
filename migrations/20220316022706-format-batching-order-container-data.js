module.exports = {
  async up(db, client) {
    await db
      .collection("Batching")
      .find()
      .forEach(async function (InventoryItem) {
          db.collection("batchings").insertOne({
            batch_code: InventoryItem.BATCH_CODE,
            date_created: new Date(InventoryItem.DATE_CREATED),
            product_code: InventoryItem.PRODUCT_CODE,
            quantity: parseFloat(InventoryItem.QTY),
            status: parseInt(InventoryItem.STATUS),
          });
      });

      await db
      .collection("products")
      .find()
      .forEach(function (Product) {
            db.collection("batchings").updateMany(
              { product_code: Product.product_code }, 
              { $set: { "product_id": Product._id } }
            );
      });
      
  },

  async down(db, client) {
    db.dropCollection("batchings");
  },
};
