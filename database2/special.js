
const pool = require("../database/index")

const specialContoller ={

  //app.post("/upload", upload.single("photo"),  
  
  send:async (req, res) => {
    if (!req.file) {
      console.log("No photo was sent");
      return res.status(400).send("No photo uploaded");
    }

    const imagePath = `"../Assets${req.file.filename}"`; // Adjust path based on your storage location
  
    // Prepare SQL query to insert data
    const sql = `INSERT INTO photo (Name,Imageurl) VALUES ("Picture",?)`;
    let query = pool.query(sql, [imagePath], (err, result) => {
      if (err) throw err;
      res.send(result);
      console.log(result);
    });
  },
getall:(req, res) => {
    let sql = "SELECT * FROM  photo";
    let query = pool.query(sql, (err, results) => {
      if (err) throw err;
      console.log(results);
      res.send(results);
    });
  }
}
  //DATABASE SENDING PHOTOS
  module.exports = specialContoller