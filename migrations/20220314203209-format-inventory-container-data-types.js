module.exports = {
  async up(db, client) {
    await db
      .collection("Inventory")
      .find()
      .forEach(async function (InventoryItem) {
          db.collection("inventories").insertOne({
            cpl_hazard: InventoryItem.cpl_hazard,
            eu_status:  InventoryItem.eu_status,
            fda_status: InventoryItem.fda_status,
            kosher: InventoryItem.kosher,
            name: InventoryItem.name,
            organic: InventoryItem.organic,
            price: parseFloat(InventoryItem.price),
            product_id:InventoryItem.product_id,
            quantity: parseFloat(InventoryItem.quantity),
            reorder_amount: parseFloat(InventoryItem.reorder_amount),
            stock: {
              on_hand: parseFloat(InventoryItem.stock.on_hand),
              supplier_id: parseFloat(InventoryItem.stock.supplier_id),
              batch_code: InventoryItem.stock.batch_code,
              price: parseFloat(InventoryItem.stock.price)
            },
            suppliers: parseFloat(InventoryItem.suppliers),
            ttb_status: InventoryItem.ttb_status,
            fema_number: InventoryItem.fema_number,
            inventory_value: parseFloat(InventoryItem.inventory_value),
            cas: InventoryItem.cas
          });
      });
  },

  async down(db, client) {
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  }
};
