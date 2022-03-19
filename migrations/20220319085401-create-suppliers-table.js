module.exports = {
  async up(db, client) {
    let suppliers = [
      {
        name:"Miritz Citrus Intercontinental LLC",
        code:"MCI",
        contact_name:"Pia Henzi",
        address_one:"28 Railroad Ave",
        address_two:"Warwick, NY 10990",
        phone:"845-988-9920",
        email: null,
        lead_time: null,
      },      {
        name:"Vigon",
        code:"VIG",
        contact_name:"Kelly Hanway",
        address_one:"127 Airport Road",
        address_two:"East Stroudsburg, PA 18301",
        phone:"570-422-6077",
        email:null,
        lead_time: null,
      },      {
        name:"FMI",
        code: "FMI",
        contact_name: "Marianela Molina",
        address_one: "10 Engelhard Ave",
        address_two: "Avenel, NJ 07001",
        phone:"+151 732-499-9700",
        email:null,
        lead_time: null,
      },      {
        name:"Excellentia",
        code:"EXC",
        contact_name:"Jeffrey Buco",
        address_one:"30 Stewart Pl",
        address_two:"Fairfield, NJ 07004 USA",
        phone:"732-749-8930",
        email: null,
        lead_time: null
      },      {
        name:"Red Arrow",
        code:"REA",
        contact_name:"Greg Stewart",
        address_one:"Kimberly Deathrage-Veleke",
        address_two:"",
        phone:"647-782-6932",
        email: null,
        lead_time: null
      },      {
        name:"Ventos",
        code:"VEN",
        contact_name:"Pol Esquivel",
        address_one:"08960 SANT JUST DESVERN",
        address_two:"Barcelone, ESPANA",
        phone:"00-34-681-277-470",
        email: null,
        lead_time: null
      },      {
        name:"Bedoukian",
        code:"BED",
        contact_name:"",
        address_one:"6 commerce drive",
        address_two:"Danbury, CT 06810",
        phone:"203-830-4000",
        email: null,
        lead_time: null
      },      {
        name:"M&U",
        code:"MU1",
        contact_name:"Konnie Mak",
        address_one:"31 Readington Road",
        address_two:"Branchburg, NJ 08876",
        phone:"732-491-1960",
        email: null,
        lead_time: null
      },      {
        name:"Penta",
        code:"PEN",
        contact_name:"",
        address_one:"50 OKNER PARKWAY",
        address_two:"LIVINGSTON, NJ O7039",
        phone:"973-740-2300",
        email: null,
        lead_time: null
      },      {
        name:"Advanced Biotech",
        code:"ADB",
        contact_name:"Diana Robinson",
        address_one:"10 Taft Road",
        address_two:"TOTOWA, NJ 07512",
        phone:"201-663-1850",
        email: null,
        lead_time: null
      },
    ]
    db.collection("suppliers").insertMany(suppliers);
  },

  async down(db, client) {
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  }
};
