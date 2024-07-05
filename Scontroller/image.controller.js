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
    getAllImages :async (req, res) => {
        try {
          const [rows] = await pool.query("SELECT id, name, image FROM Images");
          
          // Map the result to ensure we send the necessary fields
          const images = rows.map(row => ({
            id: row.id,
            name: row.name,
            image: row.image.toString('base64') // Convert binary image data to base64 string
          }));
      
          res.status(200).json({
            status: "success",
            data: images
          });
        } catch (error) {
          console.error('Error fetching images:', error);
          res.status(500).json({
            status: "error",
            message: "Internal Server Error"
          });
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
        const {Id} = req.body;
        const sql = 'SELECT image FROM Images WHERE id = ?';
        
        db.query(sql, [Id], (err, result) => {
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
    },

    send: (req, res) => {
        console.log("i am in")
        const image = req.file.buffer;
        const sql = 'INSERT INTO Images (name, image) VALUES (?, ?)';
        pool.query(sql, ['Example Image', image], (err, result) => {
          if (err) throw err;
          res.json({ message: 'Image uploaded successfully', id: result.insertId });
        });
      },
      
      // Endpoint to retrieve image by ID
      find:(req, res) => {
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
      }

}

module.exports =   imageController