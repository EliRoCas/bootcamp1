const mongoose = require('mongoose');

//Creando el modelo de Houses
const HouseSchema = new mongoose.Schema({
    adress: {
        type: String,
        require: true,
        unique: true
    },
    state: {
        type: String,
        required: true,
        validate: {
            validator: async function (state) {
                // Validacion del departamento
                var response = await fetch('https://api-colombia.com/api/v1/Department');
                var departments = await response.json()
                return departments.some(department => department.name.toUpperCase().includes(state.toUpperCase()));
            },
            message: props => `${props.value} no es un Departamento de Colombia!`
        }
    },
    city: {
        type: String,
        required: true,
        validate: {
            validator: async function (city) {
                // Validacion del departamento
                var response = await fetch('https://api-colombia.com/api/v1/City');
                var cities = await response.json()
                return cities.some(object => object.name.toUpperCase().includes(city.toUpperCase()));
            },
            message: props => `${props.value} no es una Ciudad de Colombia!`
        }
    },
    size: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        require: true
    },
    zipCode: {
        type: Number,
        required: true,
        validate: {
            validator: function (zipCode) {
                return /^[0-9]{6}$/.test(zipCode);
            },
            message: props => `${props.value} no es un código postal válido`
        }
    },
    room: {
        type: Number,
        required: true
    },
    bathrooms: {
        type: Number,
        required: true
    },
    parking: {
        type: Number,
        required: false
    },
    price: {
        type: Number,
        required: true
    },
    code: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    },
})