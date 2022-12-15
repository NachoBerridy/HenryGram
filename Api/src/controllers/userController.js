const UserSchema = require('../models/User');
const bycrypt = require('bcryptjs');
const transporter = require('../config/nodemailer');

const postUser = async (req, res) => {
    
    /*
       Controlador de la Ruta de registro de usuario

       Se le podría agregar:
        -validación con envío email
        -Validar que no exista un usuario con el mismo email (Aunque debería validarlo el front tambien)
        -Validar que no exista un usuario con el mismo nombre (Aunque debería validarlo el front tambien)
    */

    const {
        firstName,
        lastName,
        email,
        password,
        gender,
    } = req.body;

    const alreadyExist = await UserSchema.findOne({ email: email })

    if (alreadyExist) {
        /*
            Si el usuario ya existe, debería devolver un error
        */ 
        res.status(400).json({ msg: 'User already exists' });
    } 

    transporter.sendMail({
        from: process.env.EMAIL,
        to: email,
        subject: 'HenryGram - Validación de usuario',
        text: 'Hola, gracias por registrarte en HenryGram. Para validar tu usuario, por favor ingresa al siguiente link: http://localhost:3000/api/validateUser/' + email,
        html: '<h1>Hola, gracias por registrarte en HenryGram. Para validar tu usuario, por favor ingresa al siguiente link: <a href="http://localhost:3000/api/validateUser/' + email + '">Validar usuario</a></h1>',
    }, (err, info) => {
        if (err) {
            console.log(err);
        } else {
            console.log(info);
        }
    });


    bycrypt.genSalt(10, (err, salt) => {
        bycrypt.hash(password, salt, async (err, hash) => {

            /*
                Se realiza la encriptación de la contraseña
            */

            if (err) throw err;
            const user = UserSchema({
                firstName,
                lastName,
                email,
                gender,
                password: hash
            });
            
            try {
                await user.save()
                res.status(200).json(user);
            } catch (err) {
                console.log(err)
                res.status(500).json(err);
            }
        });
    });
}

const validateUser = async (req, res) => {

    /*
        Controlador de la ruta que valida los email de los usuarios

    */

    const { email } = req.params

    const user = undefined

    try {
        user = await UserSchema.findOne({ email: email})
    } catch (err) {
        res.status(500).json(err);
    }

    if (user) {
        user.active = true;
        try {
            await user.save()
            res.status(200).json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(404).json({ message: 'User not found' });
    }
}

const getUser = async (req, res) => {

    /*
        Controlador de la Ruta para obtener un usuario
    */

    const { id } = req.params

    const user = await UserSchema.findOne({ _id: id })
    if (user) {
        res.status(200).json(user);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
}

const getAllUsers = async (req, res) => {

    /*
        Controlador de la Ruta para obtener todos los usuarios
    */
    let users = [];

    try {
        users = await UserSchema.find();
        
    } catch (err) {
        res.status(500).json(err);
    }


    if (users) {
        res.status(200).json(users);
    } else {
        res.status(404).json({ message: 'Users not found' });
    }
}

const getUsersByName = async (req, res) => {

    /*
        Controlador de la Ruta para obtener todos los usuarios por nombre
    */

    const { name } = req.params

    
    //Se usa una regex para que no sea case sensitive
    let usersFirstName = [];
    let usersLastName = [];
    try {
        usersFirstName = await UserSchema.find({ firstName: { $regex : new RegExp('^'+ name + '$', "i") } });
        usersLastName = await UserSchema.find({ lastName: { $regex : new RegExp('^'+ name + '$', "i") } });
    } catch (err) {
        res.status(500).json(err);
    }

    const users = usersFirstName.concat(usersLastName)

    if (users) {
        res.status(200).json(users);
    } else {
        res.status(404).json({ message: 'Users not found' });
    }
}

const LogIn = async (req, res) => {
    
        /*
            Controlador de la Ruta para loguear un usuario
        */
    
        const { email, password } = req.body;
    
        const user = await UserSchema.findOne({
            email: email
        })
        try {
            if (user) {
                bycrypt.compare(password, user.password, (err, result) => {
                    if (result) {
                        res.status(200).json(user);
                        console.log('user logged in')
                    } else {
                        res.status(404).json({ message: 'wrong Password or invalid email' });
                        console.log('wrong Password or invalid email')
                    }
                });
            }
        } catch (error) {
            res.status(500).json(error);
            console.log('error')
        }
}

module.exports = {
    postUser,
    getUser,
    getAllUsers,
    getUsersByName,
    validateUser,
    LogIn
}