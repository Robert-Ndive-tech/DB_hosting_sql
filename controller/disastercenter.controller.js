//Kizdarodino database hostings
const pool = require("../database/index")
const disasterController = {
    getAll: async (req, res) => {
        try {
            const [rows, fields] = await pool.query("select * from DisasterCenter")
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
            const { InfoID } = req.body
            const [rows, fields] = await pool.query("select * from DisasterCenter where InfoID = ?", [InfoID])
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
            const { InfoID,Name,Picture,Status,Description,Type, } = req.body
            const sql = "insert into DisasterCenter (InfoID, Name,Picture,Status,Description,Type) values (?, ?,?,?,?,?)"
            const [rows, fields] = await pool.query(sql, [title, content])
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
            const { InfoID,Name,Picture,Status,Description,Type, } = req.body
           
            const sql = "update DisasterCenter set Name= ?, Description =  ?, Picture = ? where InfoID = ?"
            const [rows, fields] = await pool.query(sql, [title, content, id])
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
    delete: async (req, res) => {
        try {
            const { Type } = req.body
            const [rows, fields] = await pool.query("delete from DisasterCenter where Type = ?", [Type])
            res.json({
                data: rows
            })
        } catch (error) {
            console.log(error)
            res.json({
                status: "error"
            })
        }
    }

}

module.exports = disasterController