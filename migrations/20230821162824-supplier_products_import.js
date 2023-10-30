module.exports = {
  async up(db, client) {
    const supplier_products = await db
      .collection("Supplier_Products")
      .find()
      .toArray();

    for (const product of supplier_products) {
      const inv_product = await db.collection('inventory').findOne({ product_code: product.product_code });
      if (inv_product) {
        const supps = [product.Supplier1, product.Supplier2, product.Supplier3, product.Supplier4]
        for (let i = 0; i < 4; i++) {
          const supplier = await db.collection('suppliers').findOne({ code: supps[i] })
          if (supplier) {
            const sup_prod = {
              product_id: inv_product._id,
              product_code: inv_product.product_code,
              name: inv_product.name,
              supplier: { _id: supplier._id, code: supplier.code, name: supplier.name },
              supplier_sku: '',
              cost: NaN,
              description: '',
              cas_number: ''
            }

            await db.collection('supplier_products').insertOne(sup_prod);
          }
        }

      } else {
        console.log('product not found: ' + product.product_code)
      }


    }
  },

  async down(db, client) {
    // await db.dropCollection('supplier_products');
  }
};
