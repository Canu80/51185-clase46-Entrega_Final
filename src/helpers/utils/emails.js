import nodemailer from "nodemailer";
import {options} from "../../config/config.js";

//creamos el transporter
const transporter = nodemailer.createTransport({
    service:"gmail",
    port:587,
    auth:{
        user: options.gmail.emailAdmin,
        pass:options.gmail.emailPass
    },
    secure:false,
    tls:{
        rejectUnauthorized:false
    }
});

//Funcion para el envio de correo electronico para recuperar la contraseña
export const sendRecoveryPass = async(userEmail,token)=>{
    const link = `http://localhost:8080/resetpassword?token=${token}`;
    await transporter.sendMail({
        from:options.gmail.emailAdmin,
        to:userEmail,
        subject:"Restablecer contraseña",
        html: `
        <div>
        <h2>Has solicitado un cambio de contraseña.</h2>
        <p>Da clic en el siguiente enlace para restableces la contraseña</p>
        <a href="${link}">
        <button> Restablecer contraseña </button>
        </a>        
        </div>
        `
    })
};

//Funcion para el envio de correo electronico de aviso de eliminación de cuenta
export const sendDeleteAccount = async(userEmail,token)=>{
    await transporter.sendMail({
        from:options.gmail.emailAdmin,
        to:userEmail,
        subject:"Eliminación de cuenta por inactividad",
        html: `
        <div>
        <h2>Tu cuenta ha sido eliminada debido a la inactividad.</h2>
        <p>Nos ponemos en contacto con usted para notificarle que su cuenta ha sido eliminada por haber transcurrido más de 48hs. de su última visita a nuestra plataforma.</p>
        <br>
        <p>Esperamos tenerlo muy pronto de regreso en nuestra plataforma.</p>
        <br>
        <br>
        <p>Muchas gracias.</p>
        </div>
        `
    })
};

//Funcion para el envio de correo electronico de aviso de eliminación de cuenta
export const deleteAccount = async(userEmail,token)=>{
    await transporter.sendMail({
        from:options.gmail.emailAdmin,
        to:userEmail,
        subject:"Eliminación de cuenta",
        html: `
        <div>
        <h2>Tu cuenta ha sido eliminada por el administrador.</h2>
        <p>Nos ponemos en contacto con usted para notificarle que su cuenta ha sido eliminada.</p>
        <p>Por favor, para mayor información, póngase en contacto con nuestro administrador.</p>
        <p>Para hacerlo, puede escribir un correo electrónico a: admin@pets.cl</p>
        <br>
        <br>
        <p>Muchas gracias.</p>
        </div>
        `
    })
};

//Funcion para el envio de correo electronico de aviso de eliminación de cuenta
export const sendDeleteProduct = async(userEmail,token)=>{
    await transporter.sendMail({
        from:options.gmail.emailAdmin,
        to:userEmail,
        subject:"Eliminación de productos",
        html: `
        <div>
        <h2>El administrador ha eliminado alguno de tus productos.</h2>
        </div>
        `
    })
};

// Función para enviar el correo electrónico desde el formulario de contacto
export const sendContactEmail = async (req, res, next) => {
        const { nombre, telefono, email, consulta } = req.body;
        const mailOptions = {
            from: email,
            to: options.gmail.emailAdmin,
            subject: "Consulta desde el sitio web",
            text: `Nombre: ${nombre}\nTeléfono: ${telefono}\nEmail: ${email}\nConsulta: ${consulta}`,
        };
        await transporter.sendMail(mailOptions);
        next();
};