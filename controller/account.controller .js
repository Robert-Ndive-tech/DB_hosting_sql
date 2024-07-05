const bcrypt = require('bcrypt');
const pool = require ("../database/index");
const jwt = require('jsonwebtoken');
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
            const [rows, fields] = await pool.query("select * from Citizen ")
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
            const { Email } = req.body
            const [rows, fields] = await pool.query("select * from Citizen where Email = ?", [Email])
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
    },
    login: async (req, res) => {
        try {
            const { Email, Password } = req.body
            const [user, ] = await pool.query("select * from Citizen where Email = ?", [Email])
            if (!user[0]) return res.json({ error: "Invalid email!" })
            const { Password: hash, id, Name } = user[0]
            const check = await bcrypt.compare(Password, hash)
            if (check) {
                const accessToken = jwt.sign({ userId: id }, '3812932sjad34&*@', { expiresIn: '1h' });
                return res.json({ 
                    accessToken,
                    data: { 
                        id: id,
                        Name,
                        Email
                    }
                 })

            }
            return res.json({ error: "Wrong password" })   
        } catch (error) {
            console.log(error)
            res.json({
                error: "The is an error"
            })
        }
    },

    register: async (req, res) => {

        try {
            const { Name, Password, Email, Phonenumber,Age, Address, CStatus }  = req.body
            const [user, ] = await pool.query("select * from Citizen where Email = ?", [Email])
            
            if (user[0]) return res.json({ error: "Email already exists!" }).console.log("Email already exist")
           const saltRounds = 10;
    const hash = await bcrypt.hash(Password, saltRounds);
    console.log("Password hash is", hash);
        
            const sql = 'INSERT INTO Citizen (Name, Password, Email, Phonenumber, Age,Address, CStatus) VALUES (?, ?, ?, ?,?, ?, ?)';
            const [rows, fields] = await pool.query(sql, [ Name, hash, Email, Phonenumber,Age, Address, CStatus])
            if (rows.affectedRows) {
                return res.json({ message: "Succesully registered" })
            } else {
                return res.json({ error: "Error" })
            }
        } catch (error) {
            console.log(error)
            res.json({
                error: error.message
            })
        }
    },

   




}

module.exports =  accountController