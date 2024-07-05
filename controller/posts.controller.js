//Kizdarodino database hostings
const pool = require("../database/index")
const postsController = {
    getAll: async (req, res) => {
        try {
            const [rows, fields] = await pool.query("select * from posts")
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
            const [rows, fields] = await pool.query("select * from posts where id = ?", [id])
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
            const { title, content } = req.body
            const sql = "insert into posts (title, content) values (?, ?)"
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
            const { title, content } = req.body
            const { id } = req.params
            const sql = "update posts set title = ?, content = ? where id = ?"
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
            const { id } = req.params
            const [rows, fields] = await pool.query("delete from posts where id = ?", [id])
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
,
storeimage: (req, res) => {
      const  image = req.file.buffer.toString('base64')
      const  name = req.body.product
     const   sql = "INSERT INTO ImageTable VALUES(?,?)"
        pool.query(sql, [name,image], (err, rows, fields) => {
          
            res.json(rows).send("Image loaded with success")
           console.log("Image has been sent successfully")})
    }
, getImage: (req, res) => {
        const { id } = req.params; // Assuming you're retrieving the image by product name
        const sql = "SELECT name, image FROM ImageTable WHERE id = ?";
        pool.query(sql, [id], (err, rows, fields) => {
          if (err) {
            console.error(err);
            return res.status(500).send('Error retrieving image');
          }
          if (rows.length === 0) {
            return res.status(404).send('Image not found');
          }
          const image = rows[0].image;
          const productName = rows[0].name; 
          // Return the image and name as a JSON response
          res.status(200).json({ name: productName, image });
        });
      }

}

module.exports = postsController