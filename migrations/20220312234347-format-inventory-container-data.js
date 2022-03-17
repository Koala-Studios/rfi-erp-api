module.exports = {
  async up(db, client) {

    await db
      .collection("Inventory")
      .find()
      .forEach(async function (InventoryItem) {
          db.collection("inventories").insertOne({
            cpl_hazard: InventoryItem.CPL_HAZARD,
            eu_status:  InventoryItem.EU_STATUS,
            fda_status: InventoryItem.FDA_STATUS,
            kosher: InventoryItem.KOSHER,
            name: InventoryItem.NAME,
            organic: InventoryItem.ORGANIC,
            price: parseFloat(InventoryItem.PRICE),
            product_id:InventoryItem.CODE,
            quantity: parseFloat(InventoryItem.QTY),
            reorder_amount: parseFloat(InventoryItem.REORDER_AMT),
            stock:[ {
              on_hand: parseFloat(InventoryItem.QTY),
              supplier_id: parseInt(InventoryItem.SUPPLIERS),
              batch_code: "OLDSTOCK",
              price: parseFloat(InventoryItem.PRICE)
            }],
            suppliers: [parseInt(InventoryItem.SUPPLIERS)],
            ttb_status: InventoryItem.TTB_STATUS,
            fema_number: InventoryItem.FEMA_NUMBER,
            inventory_value: parseFloat(InventoryItem.INVENTORY_VALUE),
            cas: InventoryItem.CAS
          });
      });
  },

  async down(db, client) {
    db.collection("inventories").drop();
  }
};
