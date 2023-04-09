const e = require("cors");

module.exports = {
  async up(db, client) {
        
    const inv_list = await db
    .collection("inventory").find().toArray()


    let product_types = [
      {
        name:"Flavor",
        code:"FL",
        is_raw:false,
        for_sale:true,
        avoid_recur: false,
      },{
        name:"Solution",
        code:"SM",
        is_raw:false,
        for_sale:false,
        avoid_recur: false,
      },{
        name:"Flavor Key",
        code:"FK",
        is_raw:false,
        for_sale:false,
        avoid_recur: true,
      },{
        name:"Raw Material",
        code:"RM",
        is_raw:true,
        for_sale:false,
        avoid_recur: false,
      },
    ]
    await db.collection("product_types").insertMany(product_types);

    for ( const inventoryItem of inv_list) {
    const product_type = await db.collection("product_types").findOne({'code' : {$eq : (inventoryItem.product_code).slice(0,2) } })
      if( product_type) {
        await db
        .collection("inventory").updateOne({_id: inventoryItem._id}, {$set: {'rating':null, 'avoid_recur': product_type.avoid_recur, 'is_raw': ('RM' === (inventoryItem.product_code).slice(0,2)), 'product_type': {'name': product_type ? product_type.name : 'Not Found', 'code': product_type ? product_type.code : 'Not Found', '_id': product_type ? product_type._id : 'Not Found'}}});
    
      } else { //removing products/materials that are not within our "product_types" as they are deprecated (such as WD for water, etc) 
        await db.collection("inventory").deleteOne({_id: inventoryItem._id})
      }

    await db //is being done 
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
