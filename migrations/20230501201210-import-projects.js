module.exports = {
  async up(db, client) {
    // TODO write your migration here.
    const project_list = await db
    .collection("temp_projects").find().toArray();
  },

  async down(db, client) {
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  }
};
