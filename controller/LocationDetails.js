//Kizdarodino database hostings
const pool = require("../database/index")
const LocationController = {
    getAll: async (req, res) => {
        try {
            const [rows, fields] = await pool.query("select * from LocationDetails ")
            res.json({
                data: rows
            })
        } catch (error) {
            console.log(error)
            res.json({
                status: "error"
            })
        }
    },

    getById: async (req, res) => {
        try {
            const { UserID } = req.body
            const [rows, fields] = await pool.query("select * from LocationDetails where UserID = ?", [UserID])
            res.json({
                data: rows
            })
        } catch (error) {
            console.log(error)
            res.json({
                status: "error"
            })
        }
    },
    getById: async (req, res) => {
        try {
            const { LocationID } = req.body
            const [rows, fields] = await pool.query("select * from LocationDetails where LocationID = ?", [LocationID])
            res.json({
                data: rows
            })
        } catch (error) {
            console.log(error)
            res.json({
                status: "error"
            })
        }
    },
  
    create: async (req, res) => {
        try {
            const { Longitude,Latitude } = req.body
            const sql = "insert into LocationDetails (Longitude, Latitude) values (?, ?)"
            const [rows, fields] = await pool.query(sql, [Longitude, Latitude])
            res.json({
                data: rows
            })
        } catch (error) {
            console.log(error)
            res.json({
                status: "error"
            })
        }
    },
    update: async (req, res) => {
        try {
            const { UserID,Longitude, Latitude } = req.body
           
            const sql = "update LocationDetails set Longitude = ?, Latitude = ? where UserID = ?"
            const [rows, fields] = await pool.query(sql, [Longitude, Latitude, UserID])
            res.json({
                data: rows
            })
        } catch (error) {
            console.log(error)
            res.json({
                status: "error"
            })
        }
    }, 

 send: (req, res) => {
        const imagePath = `/uploads/${req.file.filename}`;
        const query = 'INSERT INTO images (image_path) VALUES (?)';
      
        pool.query(query, [imagePath], (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).send('Database error');
                return;
            }
            res.send('Image uploaded and path saved to database');
        });
      },
    fetch: (req, res) => {
        const query = 'SELECT image_path FROM images WHERE id = ?';
        pool.query(query, [req.params.id], (err, result) => {
            if (err || result.length === 0) {
                res.status(404).send('Image not found');
                return;
            }
            res.sendFile(result[0].image_path, { root: '.' });
        });
      }
  
}

module.exports = LocationController