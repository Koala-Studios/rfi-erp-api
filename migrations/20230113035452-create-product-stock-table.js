const ObjectId = require('mongodb').ObjectId;
module.exports = {
  async up(db, client) {

    const location_id = new ObjectId();
    const location1 = await db.collection('location').insertOne({
      _id: location_id, name: "Waiting Bay", code: "WB", description: "Containers without a home go here", total_containers: 0, created_date: new Date()
    })
    await db.collection('location').insertOne({
      _id: new ObjectId(), name: "Quarantine Zone", code: "QZ", description: "Quarantined containers", total_containers: 0, created_date: new Date()
    })
    await db.collection('location').insertOne({
      _id: new ObjectId(), name: "Shipping & Packing", code: "SP", description: "Shipping and Packing", total_containers: 0, created_date: new Date()
    })
    await db.collection('location').insertOne({
      _id: new ObjectId(), name: "Fulfillment Area", code: "FA", description: "Fulfillment Area", total_containers: 0, created_date: new Date()
    })

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
      const supplier = await db.collection("suppliers").findOne({ "code": getSupplier(InvStockItem.supplier_code) })

      if (inv_product) {
        db.collection("inventory_stock").insertOne({
          product_id: inv_product ? inv_product._id : 'ERROR',
          product_code: InvStockItem.product_code,
          name: inv_product ? inv_product.name : InvStockItem.product_name,
          unit_cost: Math.random() * Math.random() * (10 / Math.random()), //!!!! REMOVE THIS LATER, JUST FOR TESTING PURPOSES
          lot_number: InvStockItem.lot_number,
          sample: Math.round(Math.random(0, 1)), //TODO: CHANGE THIS TO NOT BE RANDOM LOL.
          is_open: Math.round(Math.random(0, 1)), //TODO: CHANGE THIS TO NOT BE RANDOM LOL.
          is_solid: Math.round(Math.random(0, 1)),//TODO: CHANGE THIS TO NOT BE RANDOM LOL.
          location: { _id: location_id.toHexString(), code: 'WB' },
          container_size: InvStockItem.qty_per_cont || 10,
          received_amount: InvStockItem.Rec_qty || ((InvStockItem.qty_per_cont * InvStockItem.cont_num) || 100),
          remaining_amount: InvStockItem.Rec_qty || ((InvStockItem.qty_per_cont * InvStockItem.cont_num) || 100),
          allocated_amount: 0,
          quarantined: false,
          received_date: InvStockItem.received_date,
          expiry_date: InvStockItem.exp_date,
          supplier_code: InvStockItem.supplier,
          supplier_id: supplier ? supplier._id : "ERROR",
          supplier_sku: InvStockItem.s_product_code ? InvStockItem.s_product_code : "ERROR",
          notes: InvStockItem.notes ? InvStockItem.notes : "",
          extensions: ext_list,
          qc_tests: []
        });


        await db.collection("inventory").updateOne({ _id: inv_product._id }, { $inc: { 'stock.on_hand': InvStockItem.Rec_qty || ((InvStockItem.qty_per_cont * InvStockItem.cont_num) || 100) } })

      }
    };

  },
  async down(db, client) {
    db.collection("inventory_stock").drop();
    db.collection("location").drop();
  },

};


const getSupplier = (code) => {
  switch (code) {
    case 'MIRITZ':
      return 'MCI';

    case 'VIGON':
    case "Vigon":
      return 'VIG';

    case 'FMI':
      return 'FMI';

    case 'EXLLENTIA':
    case "EXELLENTIA":
      return 'EXC';

    // case x:
    //   return 'REA';

    case "VENTOS":
      return 'VEN';

    case "Bedoukian":
      return 'BED';

    // case x:
    //   return 'MU1';

    case 'PENTA':
      return 'PEN';

    case "ADVANCEDBIOTECH":
      return 'ADB';
    default:
      return 'ERROR';
  }
}