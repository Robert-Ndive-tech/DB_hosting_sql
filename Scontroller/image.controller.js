//Kizdarodino database hostings
const pool = require("../database/index")
const imageController = {
    getAll: async (req, res) => {
        try {
            const [rows, fields] = await pool.query("select * from Images")
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
            const sql = "insert into Images (title, content) values (?, ?)"
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
  

   Retrive:(req, res) => {
        const imageId = req.params.id;
        const sql = 'SELECT image FROM Images WHERE id = ?';
        
        db.query(sql, [imageId], (err, result) => {
          if (err) throw err;
      
          if (result.length > 0) {
            res.writeHead(200, {
              'Content-Type': 'image/jpeg',
              'Content-Length': result[0].image.length
            });
            res.end(result[0].image);
          } else {
            res.status(404).send('Image not found');
          }
        });
      },
    delete: async (req, res) => {
        try {
            const { id } = req.params
            const [rows, fields] = await pool.query("delete from Images where id = ?", [id])
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

module.exports =   imageController