module.exports = {
  async up(db, client) {
    const inserted_codes = [];

    await db
    .collection("inventories")
    .find()
    .forEach(function (Material) {
          db.collection("Development").updateMany(
            { MATERIAL_CODE: Material.product_id }, 
            { $set: { "material_id": Material._id } }
          );
    });

    await db
      .collection("Development")
      .find()
      .forEach(function (formula) {
        if(!inserted_codes.some(e => e[0] === formula.PRODUCT_CODE && e[1] === formula.VERSION))
        {

          db.collection("formulas").insertOne({
            product_code: formula.PRODUCT_CODE,
            version: parseInt(formula.VERSION),
            date_created: new Date()
          });

          inserted_codes.push([formula.PRODUCT_CODE, formula.VERSION]);
        }
      });

      await db
      .collection("Development")
      .find()
      .forEach(function (formula) {
      db.collection("formulas").updateOne(
        { product_code: formula.PRODUCT_CODE, version : parseInt(formula.VERSION) },
        {
          $push: {
            formula_items: {
              material_code: formula.MATERIAL_CODE,
              amount: parseFloat(formula.QTY),
              notes: formula.NOTES,
              material_id: formula.material_id
            }
          }
        });
    });

    await db
    .collection("products")
    .find()
    .forEach(function (Product) {
          db.collection("formulas").updateMany(
            { product_code: Product.product_code }, 
            { $set: { "product_id": Product._id } }
            //{ $unset: { product_code } }
          );
    });
  },

  async down(db, client) {
    await db.collection("formulas").drop();
    db
    .collection("Development")
    .updateMany({},{ $unset: {material_id: ""  } });
  },
};
