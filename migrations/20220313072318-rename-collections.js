module.exports = {
  async up(db, client) {
    // TODO write your migration here.
    // await db.collection("products").drop();
    // await db.collection("batchings").drop();
    // await db.renameCollection("Batching", "batchings");
    // await db.collection("Product").copyTo("products");
    // await db.Batching.copyTo("batchings");
  },

  async down(db, client) {
    // await db.renameCollection("batchings", "Batching");
    // await db.renameCollection("products", "Product");
  },
};
