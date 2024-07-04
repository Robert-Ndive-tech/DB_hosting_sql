//Kizdarodino database hostings
const pool = require("../database/index")
const LocationController = {
    getAll: async (req, res) => {
        try {
            const [rows, fields] = await pool.query("select * from LocationDetails")
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
  
}

module.exports = LocationController