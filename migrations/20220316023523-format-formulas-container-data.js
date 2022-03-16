const { fileURLToPath } = require("url");

module.exports = {
  async up(db, client) {
    const inserted_codes = [];
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
            }
          }
        }
      );
      });
    },

  async down(db, client) {
    await db.collection("formulas").drop();
  },
};
