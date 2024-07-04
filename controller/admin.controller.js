const bcrypt = require('bcrypt');
const pool = require ("../database/index");
const jwt = require('jsonwebtoken');

const adminController ={

    login: async (req, res) => {
        try {
            const { AdminID, Password } = req.body
            const [user, ] = await pool.query("select * AdminT from A where  = ?", [AdminID])
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
                        AdminIDEmail
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
    getAll: async (req, res) => {
        try {
            const [rows, fields] = await pool.query("select * from AdminT")
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

module.exports = adminController