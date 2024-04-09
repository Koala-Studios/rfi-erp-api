module.exports = {
  async up(db, client) {

    await db.createCollection('customer_products');
    await db.createCollection('sales');
  },

  async down(db, client) {
    // TODO write the statements to rollback your migration (if possible)
    // Example:

    await db.dropCollection('sales');
    await db.dropCollection('customer_products');
  }
};
