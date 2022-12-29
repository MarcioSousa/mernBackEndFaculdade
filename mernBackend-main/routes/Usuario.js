//cSpell:Ignore Usuario
const express = require('express')
const { check, validationResult } = require('express-validator')
const { restart } = require('nodemon')
const router = express.Router()
const Usuario = require('../model/Usuario')

/* URL Padrão: localhost:3000/usuario */

router.post('/',
[
  check('nome','Por favor informe o nome do usuário').not().isEmpty(),
  check('email','Informe um email válido').isEmail(),
  check('senha','Informe uma senha com no mínimo 6 caracteres').isLength({min: 6}),
  check('tipo','Informe um tipo de usuário válido!').isIn(['administrador','cliente','digitador'])  
],
async (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        })
    }

    const {nome, email, senha, avatar, tipo} = req.body
    try{
        let usuario = await Usuario.findOne({email})
        if(usuario){
            return res.status(400).json({
                mensagem: 'O e-mail informado já existe em outro usuário!'
            })
        }
        usuario = new Usuario({nome, email, senha, avatar, tipo})
        await usuario.save()
        return res.json({'mensagem':'usuário incluído com sucesso!'})

    } catch (err) {
        return res.json({'mensagem': 'erro'})
    }
    
}
)

module.exports = router