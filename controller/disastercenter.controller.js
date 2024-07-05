//Kizdarodino database hostings
const pool = require("../database/index")


// Set up multer for buffer storage
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
    recieve: async (req, res) => {
        try {
            const [rows, fields] = await pool.query("select * from photo")
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
    recievebyid: async (req, res) => {
        try {const {id}= req.params
            const [rows, fields] = await pool.query("select Imageurl from photo where id=?",[id])
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
sendimage : async (req, res) => {
        upload.single('picture')(req, res, async (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ status: 'error', message: 'File upload failed' });
            }
            try {
                const { InfoID, Name, Status, Description, Type } = req.body;
                const pictureBuffer = req.file ? req.file.buffer : null;
                const sql = "INSERT INTO DisasterCenter (InfoID, Name, Picture, Status, Description, Type) VALUES (?, ?, ?, ?, ?, ?)";
                const [rows, fields] = await pool.query(sql, [InfoID, Name, pictureBuffer, Status, Description, Type]);
    
                res.json({ data: rows });
            } catch (error) {
                console.log(error);
                res.json({ status: "error" });
            }
        });
    },

    send : async (req, res) => {

        if (!req.file) {
            console.log("No photo was sent");
            return res.status(400).send("No photo uploaded");
          }
            try {
               
         const imagePath = `"../Assets${req.file.filename}"`;
                const sql = `INSERT INTO photo (Name,Imageurl) VALUES ("Picture",?)`;
                const [rows, fields] = await pool.query(sql, [imagePath]);
    
                res.json({ data: rows });
            } catch (error) {
                console.log(error);
                res.json({  error: error.message });
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