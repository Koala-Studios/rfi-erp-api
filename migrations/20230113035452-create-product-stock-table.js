module.exports = {
  async up(db, client) {

    const results = await db
      .collection("Inventory_Stock")
      .find().toArray();
    // .forEach(async function (InvStockItem) {
    for (const InvStockItem of results) {
      const temp_list = [InvStockItem.ext_one, InvStockItem.ext_two, InvStockItem.ext_three,
      InvStockItem.ext_four, InvStockItem.ext_five, InvStockItem.ext_six, InvStockItem.ext_seven,]
      let ext_list = temp_list.map(item => {
        if (item != undefined) {
          return { extension_date: item, passed: true };
        }
      }).filter(n => n)
      const inv_product = await db.collection("inventory").findOne({ "product_code": InvStockItem.product_code })
      const supplier = await db.collection("suppliers").findOne({ "code": InvStockItem.supplier_code })

      if (inv_product) {
        db.collection("inventory_stock").insertOne({
          product_id: inv_product ? inv_product._id : 'ERROR',
          product_code: InvStockItem.product_code,
          name: inv_product ? inv_product.name : InvStockItem.product_name,
          unit_cost: Math.random() * Math.random() * (10 / Math.random()), //!!!! REMOVE THIS LATER, JUST FOR TESTING PURPOSES
          lot_number: InvStockItem.lot_number,
          container_size: InvStockItem.qty_per_cont || 0,
          received_amount: InvStockItem.Rec_qty || ((InvStockItem.qty_per_cont * InvStockItem.cont_num) || 0),
          remaining_amount: InvStockItem.Rec_qty || ((InvStockItem.qty_per_cont * InvStockItem.cont_num) || 0),
          allocated_amount: 0,
          quarantined_containers: 0,
          received_date: InvStockItem.received_date,
          expiry_date: InvStockItem.exp_date,
          supplier_code: InvStockItem.supplier,
          supplier_id: supplier ? ObjectId(supplier._id) : "ERROR",
          supplier_sku: InvStockItem.s_product_code ? InvStockItem.s_product_code : "ERROR",
          notes: InvStockItem.notes ? InvStockItem.notes : "",
          extensions: ext_list,
          qc_tests: []
        });


        await db.collection("inventory").updateOne({ _id: inv_product._id }, { $inc: { 'stock.on_hand': (InvStockItem.Rec_qty || ((InvStockItem.qty_per_cont * InvStockItem.cont_num) || 0) - InvStockItem.used_qty || 0) } })

      }
    };

  },
  async down(db, client) {
    db.collection("inventory_stock").drop();
  },
};
