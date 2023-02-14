module.exports = {
  async up(db, client) {
    //!UNCOMMENT THIS ON FIRST RUN
    // await db.renameCollection("Inventory", "OldInventory");

    await db
      .collection("OldInventory")
      .find()
      .forEach(async function (InventoryItem) {
        if (!InventoryItem.CODE.includes("FL")) {
          db.collection("inventory").insertOne({
            product_code: InventoryItem.CODE,
            name: InventoryItem.NAME,
            for_sale: false,
            is_raw: checkIfRaw(InventoryItem.CODE),
            cost: parseFloat(InventoryItem.PRICE),
            stock: 
              {
                on_hand: parseFloat(InventoryItem.QTY),
                on_hold: 0,
                on_order: 0,
                quarantined: 0,
                allocated: 0,
                average_price: 0,
                reorder_amount:InventoryItem.REORDER_AMT ? parseFloat(InventoryItem.REORDER_AMT) : 0,
              }
            ,
            suppliers: [parseInt(InventoryItem.SUPPLIERS)],
            regulatory: {
              cpl_hazard: InventoryItem.CPL_HAZARD ? [InventoryItem.CPL_HAZARD] : [],
              eu_status: InventoryItem.EU_STATUS,
              fda_status: InventoryItem.FDA_STATUS,
              kosher: true,
              organic: false,
              ttb_status: InventoryItem.TTB_STATUS,
              fema_number: InventoryItem.FEMA_NUMBER,
            },
            cas_number: InventoryItem.CAS,
          });
        }
      });

    function checkIfRaw(code) {
      return code.includes("RM") ? true : false;
    }
  },
  async down(db, client) {
    db.collection("inventory").drop();
  },
};
