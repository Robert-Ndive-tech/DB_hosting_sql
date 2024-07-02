const pool = require ("../database/index")
const accountController ={
    create: async (req, res) => {
        try {
            const { Name, Password, Email, Phonenumber,Age, Address, CStatus }  = req.body
            const sql = 'INSERT INTO Citizen (Name, Password, Email, Phonenumber, Age,Address, CStatus) VALUES (?, ?, ?, ?,?, ?, ?)';
            const [rows, fields] = await pool.query(sql, [ Name, Password, Email, Phonenumber,Age, Address, CStatus])
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
    getAll: async (req, res) => {
        try {
            const [rows, fields] = await pool.query("select * from Citizen")
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
            const { Name,Email, Password, Phonenumber,Age, Address, CStatus }  = req.body
            const { id } = req.params
            const sql = "update Citizen set Name = ?, Password = ? , Phonenumber = ? , Age= ? CStatus , Address = ? where Email = ?"
            const [rows, fields] = await pool.query(sql, [ Name, Password, Email, Phonenumber,Age, Address, CStatus])
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
            const { id } = req.params
            const [rows, fields] = await pool.query("select * from Citizen where id = ?", [id])
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
            const { id } = req.params
            const [rows, fields] = await pool.query("delete from Citizen where id = ?", [id])
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

module.exports =  accountController