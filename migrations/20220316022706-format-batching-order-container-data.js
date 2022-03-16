module.exports = {
  async up(db, client) {
    await db
      .collection("Batching")
      .find()
      .forEach(async function (InventoryItem) {
          db.collection("batchings").insertOne({
            batch_code: InventoryItem.batch_code,
            date_created: new Date(InventoryItem.date_created),
            product_code: InventoryItem.product_code,
            quantity: parseFloat(InventoryItem.quantity),
            status: parseInt(InventoryItem.status),
          });
      });
  },

  async down(db, client) {
    db.dropCollection("batchings");
  }
};
