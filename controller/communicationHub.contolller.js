//Kizdarodino database hostings
const pool = require("../database/index")
const  communicationController= {
    getAll: async (req, res) => {
        try {
            const [rows, fields] = await pool.query("select * from CommunicationHub")
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
            const { Type } = req.body
            const [rows, fields] = await pool.query("select * from CommunicationHub where Type = ?", [Type])
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
            const { Type, Time,Content,Picture } = req.body
            const sql = "insert into CommunicationHub (Type,Time, Content,Picture) values (?, ?,?,?,?)"
            const [rows, fields] = await pool.query(sql, [Type,Time, Content,EID,Picture])
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
            const { Type, Content,Picture } = req.body

            const sql = "update CommunicationHub set Picture = ?, Content = ? where Type= ?"
            const [rows, fields] = await pool.query(sql, [Type, Content,Picture])
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
            const { Type} = req.body
            const [rows, fields] = await pool.query("delete from posts where Type = ?", [Type])
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

module.exports = communicationController