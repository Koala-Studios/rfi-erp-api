module.exports = {
  async up(db, client) {
    await db
      .collection("OldInventory")
      .find()
      .forEach(async function (InventoryItem) {
        if (!InventoryItem.CODE.includes("FL")) {
          db.collection("inventory").insertOne({
            product_code: InventoryItem.CODE,
            name: InventoryItem.NAME,
            description: "",
            for_sale: false,
            is_raw: checkIfRaw(InventoryItem.CODE),
            is_solid: false,
            cost: parseFloat(InventoryItem.PRICE),
            stock: 
              {
                on_hand: 0,
                on_hold: 0,
                ordered: 0,
                quarantined: 0,
                allocated: 0,
                average_price: 0,
                reorder_amount:InventoryItem.REORDER_AMT ? parseFloat(InventoryItem.REORDER_AMT) : 0,
              }
            ,
            regulatory:
            {
              cpl_hazard: [],
              eu_status: null,
              ttb_status: null,
              fda_status: null,
              fema_number: null,
            },
            dietary:
            {
              kosher: true,
              vegan: false,
              organic: false,
              halal: false,
              non_gmo:false
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
