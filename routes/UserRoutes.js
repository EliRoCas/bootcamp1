const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const UserSchema = require('../models/User.js');
const MessageSchema = require('../models/Message.js');
const UserController = require('../controllers/UserController.js'); // Importando el controlador
const multer = require('multer');

const userController = new UserController(); //creando una instancia de ese controlador

//GET METHOD 
router.get('/user', userController.validateToken, async (req, res) => {
    //traer todos los usuarios 
    let users = await UserSchema.find();
    res.send(users)
})


router.get('/user/:id', async (req, res) => {
    //traer un usuario específico pasando el ID
    var id = req.params.id
    let user = await UserSchema.findById(id)
    res.send(user)
})
//Traer un usuario por email 
//const query = UserSchema.where({email: email});
//const user = await query.findOne()

// METODO POST - Crear - en este caso un usuario 
// Con encriptación de contraseña  
router.post('/user', async (req, res) => {

    const hashedPassword = await bcrypt.hash(req.body.password, 10)

    let user = UserSchema({
        name: req.body.name,
        lastname: req.body.lastname,
        email: req.body.email,
        id: req.body.id,
        password: hashedPassword
    })

    user.save().then((result) => {
        res.send(result)
    }).catch((err) => {
        if (err.code == 11000) {
            res.send({
                "status": "error",
                "message": "El correo ya fue registrado"
            })
        } else {
            res.send({
                "status": "error",
                "message": err.message

            })
        }
    })
})


//METODO PATCH - Actualizar - en este caso un usuario
router.patch('/user/:id', userController.validateToken, (req, res) => {

    //para actualizar primero se debe capturar el ID como sigue
    //cuando viene por la url del servicio web se usa params
    var id = req.params.id

    //luego se debe crear una variable con los datos susceptibles a actualizar
    //cuando viene por el body se usa body
    var updateUser = {
        name: req.body.name,
        lastname: req.body.lastname,
        email: req.body.email,
        id: req.body.id
    }
    //Definir definir la función que se quiere obtener
    UserSchema.findByIdAndUpdate(id, updateUser, { new: true }).then((result) => {
        res.send(updateUser)
        // otra forma para hacer que regrese el objeto actualizado es: 
        //UserSchema.findByIdAndUpdate(id, updateUser, {new:true}).then((result) => {
        //res.send(result)
    }).catch((error) => {
        console.log(error)
        res.send("Error actualizando registro ")
    })
})



//METODO DELETE - Eliminar - En este caso un usuario
//Al igual que en el PATCH se le debe dar un id (en este caso user/:id)
router.delete('/user/:id', userController.validateToken, (req, res) => {
    // se crea una variable que indica el parámetro que se usará
    var id = req.params.id

    //Usar el esquema creado y una función ya predeterminada
    // deleteOne permite establecer cualquier parámetro 
    UserSchema.deleteOne({ _id: id }).then(() => {
        res.json({
            "status": "success", "message": "User deleted succesfully"
        })
    }).catch((error) => {
        console.log(error)
        res.json({ "status": "failed", "message": "Error deleting user" })
    })
})

// MÉTODO DELETE - Para eliminar varios elementos
// router.delete('/user/:name/:email?', (req, res) => {
//     var name = req.params.name
//     var email = req.params.email
//     var query;
//     if (email != null) {
//         query = { name: name, email: email }
//     } else {
//         query = { name: name }
//     }

//     UserSchema.deleteOne(query).then(() => {
//         res.jason({ "status": "success", "message": "User deleted successfully" })
//     }).catch((error) => {
//         console.log(error)
//         res.jason({ "status": "failed", "message": "Error deleting user" })
//     })
// })


//MÉTODO POST para login y html
router.post('./login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    userController.login(email, password).then((result) => {
        send.send(result)
    })
})

router.post('/test', (req, res) => {
    res.send('Hola Mundo')
})

// Configuración de la librería multer 
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/') // este callback indica a qué carpeta destino se deberán subir los archivos
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname)
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true)
    } else {
        cb(new Error('El archivo no es una imagen'))
    }
}

const upload = multer({ storage: storage, fileFilter: fileFilter }) //Setteando la librería 

// Servicio web para el almacenamiento de archivos por ID y usuario 

router.post('/upload/:id/user', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send({
            'status': 'error', 'message': 'No se proporcionó ningún archivo'
        })
    }
    var id = req.params.id

    var updateUser = {
        avatar: req.file.path
    }

    console.log(id)

    UserSchema.findByIdAndUpdate(id, updateUser, { new: true }).then((result) => {
        res.send({ 'status': 'success', 'message': 'Archivo subido correctamente' })
    }).catch((error) => {
        console.log(error)
        res.send({ 'status': 'success', 'message': 'Error actualizando el registro' })
    })
})

module.exports = router

