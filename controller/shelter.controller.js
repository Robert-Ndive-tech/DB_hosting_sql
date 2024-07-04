//Kizdarodino database hostings
const pool = require("../database/index")
const shelterController = {
    getAll: async (req, res) => {
        try {
            const [rows, fields] = await pool.query("select * from Shelter")
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
            const { ShelterID } = req.body
            const [rows, fields] = await pool.query("select * from Shelter where ShelterID= ?", [ShelterID])
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
            const { Name,Picture,Status,Description } = req.body
            const sql = "insert into Shelter (Name,Picture,Status,Description) values (?, ?,?,?)"
            const [rows, fields] = await pool.query(sql, [Name,Picture,Status,Description])
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
           
            const sql = "update Shelter set Longitude = ?, Latitude = ? where UserID = ?"
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
  
}

module.exports = shelterController