module.exports = {
  async up(db, client) {
    //!UNCOMMENT THIS ON FIRST RUN
    // await db
    //   .renameCollection("Inventory", "OldInventory");

    await db
      .collection("OldInventory")
      .find()
      .forEach(async function (InventoryItem) {
          if(!(InventoryItem.CODE).includes('FL')) {
            db.collection("inventory").insertOne({
              product_code:InventoryItem.CODE,
              name: InventoryItem.NAME,
              is_raw_mat: checkIfRaw(InventoryItem.CODE),
              for_sale: false,
              cost: parseFloat(InventoryItem.PRICE),
              stock:[ {
                on_hand: parseFloat(InventoryItem.QTY),
                supplier_id: parseInt(InventoryItem.SUPPLIERS),
                batch_code: "OLDSTOCK",
                cost: parseFloat(InventoryItem.PRICE)
              }],
              reorder_amount: parseFloat(InventoryItem.REORDER_AMT),
              suppliers: [parseInt(InventoryItem.SUPPLIERS)],
              regulatory:
              {
                cpl_hazard: InventoryItem.CPL_HAZARD,
                eu_status:  InventoryItem.EU_STATUS,
                fda_status: InventoryItem.FDA_STATUS,
                kosher: InventoryItem.KOSHER,
                organic: InventoryItem.ORGANIC,
                ttb_status: InventoryItem.TTB_STATUS,
                fema_number: InventoryItem.FEMA_NUMBER,
              },
              cas_number: InventoryItem.CAS
            });
          }
          
      });
  
      function checkIfRaw(code) {
        return code.includes('RM') ? true : false;
      }
  
    },
  async down(db, client) {
    db.collection("inventory").drop();
  }
};
