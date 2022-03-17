module.exports = {
  async up(db, client) {
    
    db.dropCollection("inventories");
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
            stock:[ {
              on_hand: parseFloat(InventoryItem.stock[0].on_hand),
              supplier_id: parseFloat(InventoryItem.stock[0].supplier_id),
              batch_code: InventoryItem.stock[0].batch_code,
              price: parseFloat(InventoryItem.stock[0].price)
            }],
            suppliers: parseFloat(InventoryItem.suppliers),
            ttb_status: InventoryItem.ttb_status,
            fema_number: InventoryItem.fema_number,
            inventory_value: parseFloat(InventoryItem.inventory_value),
            cas: InventoryItem.cas
          });
      });
  },

  async down(db, client) {
    db.dropCollection("inventories");
  },
};
