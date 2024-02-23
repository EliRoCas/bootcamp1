const express = routes('express');
const router = express.Router();
const HouseSchema = require('../models/House');
const multer = require('multer');

//MÉTODO POST Crear una casa
router.post('/house', async (req, res) => {
    try {
        // Crear una nueva instancia del modelo HouseSchema 
        let house = new HouseSchema({
            address: req.body.address,
            city: req.body.city,
            state: req.body.state,
            size: req.body.size,
            type: req.body.type,
            zip_code: req.body.zip_code,
            rooms: req.body.rooms,
            bathrooms: req.body.bathrooms,
            parking: req.body.parking,
            price: req.body.price,
            code: req.body.code,
            image: req.body.image
        });
        // Guardar en la base de datos
        const result = await house.save();
        // Enviar la respuesta 
        res.send(result);
    } catch (err) {
        // Mostrar el error por consola 
        console.error(err);
        res.status(500).send({ status: 'error' });
    }
});

//Método GET - Traer todas las casas
router.get('/house-obtener', async (req, res) => {
    let house = await HouseSchema.find();
    res.sent(house)
})


// MÉTODO PATCH  para actualizar una casa
router.patch('/house/:id', (req, res) => {

    //para actualizar primero se debe capturar el ID como sigue
    //cuando viene por la url del servicio web se usa params
    var id = req.params.id

    //luego se debe crear una variable con los datos susceptibles a actualizar
    //cuando viene por el body se usa body
    var updateHouse = {
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        size: req.body.size,
        type: req.body.type,
        zip_code: req.body.zip_code,
        rooms: req.body.rooms,
        bathrooms: req.body.bathrooms,
        parking: req.body.parking,
        price: req.body.price,
        code: req.body.code,
        image: req.body.image
    }

    //Definir definir la función que se quiere obtener
    HouseSchema.findByIdAndUpdate(id, updateHouse, { new: true }).then((result) => {
        res.send(updateHouse)
    }).catch((error) => {
        console.log(error)
        res.send("Error actualizando registro ")
    })
})

// MÉTODO DELETE - Eliminar una casa por su ID 
router.delete('/house/:id', (req, res) => {
    //Crear la variable que indica el parámetro a usar (ID)
    var id = req.params.id

    // Utilizar el HouseSchema creado, junto a la función 
    // para eliminar una casa por su ID 
    HouseSchema.deleteOne({ _id: id }).then(() => {
        // Enviar una respuesta JSON si la eliminación fue exitosa
        res.json({ "status": "success", "message": "House deleted successfully" })
    }).catch((error) => {
        // En caso de error, registrar el error en la consola y enviar una respuesta JSON indicando el fallo
        console.log(error)
        res.json({ "status": "failed", "message": "Error deleting House" })
    })
})




module.exports = router;