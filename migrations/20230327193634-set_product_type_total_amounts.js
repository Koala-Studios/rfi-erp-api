module.exports = {
    async up(db, client) {
    const product_types = await db.collection("product_types").find().toArray();

    for(p_type of product_types) {
        const latest_product = await db.collection("inventory").find({"product_type.name": p_type.name}).sort({_id:-1}).limit(1).toArray();
        const totalAmt = parseInt(latest_product[0].product_code.substring(p_type.code.length));
        await db.collection("product_types").updateOne({_id: p_type._id}, {$set: {'total': totalAmt}})
    }
    },

    async down(db, client) {
    }
}
