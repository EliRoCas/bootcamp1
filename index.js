const express = require('express'); //importa la librería
const app = express(); // inicializa la variable 
const router = express.Router(); // Enruta los servicios web
const port = 3000; // Puerto de escucha de la ejecución

require('dotenv').config() //Con esto le estoy diciendo que me traiga la configuración del archivo .env

//WebSocket 
const socket = require('socket.io') // Importamos la librería socket
const http = require('http').Server(app) // Creamos nuestro Servidor 
const io = socket(http) // Asigno la librería de socket a un servidor http

const DB_URL = process.env.DB_URL || ''; //el process.env.DB_URL llama al DB_URL que está en el archivo .env

const mongoose = require('mongoose'); // importa la librería 
mongoose.connect(DB_URL) // Se crea la cadena de conexión   

//Importación de rutas 
const userRoutes = require('./routes/UserRoutes.js');
const houseRoutes = require('./routes/HouseRoutes');
const messageRoutes = require('./routes/MessageRoutes');




//GET METHOD servicio [/]
router.get('/', (req, res) => {
    res.send("Hello World")
})

//Verificar la conexión al WebSocket 
io.on('connect', (socket) => {
    console.log("connected")
    //Escuchando eventos desde el servidor
    socket.on('message', (data) => {
        /** Almacenando el mensaje en la BD */
        var payload = JSON.parse(data)
        console.log(payload)
        MessageSchema(payload).save().then((result) => {
            socket.emit('message-receipt', { "message": "Mensaje almacenado" })
        }).catch((err) => {
            console.log({ "status": "error", "message": err.message })
        })
    })

    socket.on('disconnect', (socket) => {
        console.log("disconnect")
    })
})

//Establece los middlewere para json - Express
app.use(express.urlencoded({ extended: true })) // Acceder a la información de las URLS
app.use(express.json()) // Analizar la información en formato JSON 

//Establece una conexión entre el WebSocket creado y Express
// para poder utilizarlo 
app.use((req, res, next) => {
    res.io = io
    next()
})

//Se Ejecuta el Servidor
app.use(router)
app.use('/uploads', express.static('uploads'))
app.use('/', userRoutes)
app.use('/', houseRoutes)
app.use('/', messageRoutes)

http.listen(port, () => {
    console.log('Listen on' + port)
})
