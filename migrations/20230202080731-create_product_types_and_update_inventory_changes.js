module.exports = {
  async up(db, client) {
        
    const inv_list = await db
    .collection("inventory").find().toArray()


    let product_types = [
      {
        name:"Flavor",
        code:"FL",
        is_raw:false,
        for_sale:true
      },{
        name:"Solution",
        code:"SM",
        is_raw:false,
        for_sale:false        
      },{
        name:"Flavor Key",
        code:"FK",
        is_raw:false,
        for_sale:false        
      },{
        name:"Raw Material",
        code:"RM",
        is_raw:true,
        for_sale:false        
      },
    ]
    await db.collection("product_types").insertMany(product_types);

    for ( const inventoryItem of inv_list) {
    const product_type = await db.collection("product_types").findOne({'code' : {$eq : (inventoryItem.product_code).slice(0,2) } })

      await db
    .collection("inventory").updateOne({_id: inventoryItem._id}, {$set: {'rating':null,'is_raw': ('RM' === (inventoryItem.product_code).slice(0,2)), 'product_type': {'name': product_type ? product_type.name : 'Not Found', '_id': product_type ? product_type._id : 'Not Found'}}});

    await db
    .collection("inventory").updateOne({_id: inventoryItem._id}, {$unset: {'is_raw_mat':""}});
    }




  },

  async down(db, client) {
    const inv_list = await db
    .collection("inventory").find().toArray();

    for ( const inventoryItem of inv_list) {
    await db
    .collection("inventory").updateOne({_id: inventoryItem._id}, {$set: {'is_raw_mat': ('RM' === (inventoryItem.product_code).slice(0,2))}});

    await db
    .collection("inventory").updateOne({_id: inventoryItem._id}, {$unset: {'is_raw':"", 'product_type':""}});

  }

  db.dropCollection("product_types");
  }
};
