"use strict";

const RegistrModel = require('./models/registr.model');
const UsersModel   = require('./models/users.model');
const _            = require('lodash');
const config       = require('./config');
const bcrypt       = require('bcryptjs');
const passport     = require('passport');
const jwt          = require('jsonwebtoken');

function checkAuth(req, res, next) {
    passport.authenticate('jwt', {session: false}, (err, decryptToken, jwtError) => {
        if(jwtError != void(0) || err != void(0)) {
            return res.render('index.html', { error: err || jwtError });
        }

        req.user = decryptToken;
        req.session.username = req.user.username;
        next();
        })(req, res, next);
    }

function createToken(body) {
        return  jwt.sign( body, config.jwt.secretOrKey, {expiresIn: config.expiresIn});
    }
    
module.exports = app => {

    app.get('/', checkAuth,(req, res) => {
        res.render('index.html', { username: req.user.username });
    });

    app.post('/login',async (req, res) => {
        try{
            let user = await UsersModel.findOne( {username:{$regex: _.escapeRegExp(req.body.username),$options: "i"}}).lean().exec();

            if(user !== null && bcrypt.compareSync(req.body.password, user.password)){
                req.session.username = user.username;
                const token = createToken({id: user._id,username: user.username});
                res.cookie('token', token, {httpOnly: true});
                res.status(200).send({message:"User login success"});
            } else {
                res.status(400).send({message: "User not exist or password not correct"});
            }
        } catch(e) {
            console.error("E, login", e);
            res.status(500).send({message: "some error"});
        }
    });

    app.post('/register', async(req, res) => {
        try{
            let user = await UsersModel.findOne({username:{$regex: _.escapeRegExp(req.body.username), $options: "i"}}).lean().exec();
            if(user != null) return res.status(400).send({message: "User already exist "});
            user = await UsersModel.create({username: req.body.username, password: req.body.password});
            req.session.username = user.username;
            const token = createToken({id: user._id, username: user.username});
            res.cookie('token', token, {httpOnly: true});
            res.status(200).send({message: "User created"});
        } catch(e) {
            console.error("E, register", e);
            res.status(500).send({message: "some error"});
        }
    });

    app.post('/logout', (req, res) => {
        res.clearCookie('token');
        res.status(200).send({message: "Logout success"});
    });

    app.post('/add', async (req, res) => {
        req.body.username = req.session.username;
        RegistrModel.create(req.body, err => { if(err) return console.error("RegistrModel", err);});
        res.status(200).send({message: "Operation added"});
    });

    app.post('/getdata', async (req, res) => {
        RegistrModel.find({
            currency: req.body.currency,
            username: req.session.username,
            date: {$gte: req.body.dateFrom, $lte: req.body.dateTo }
        }).sort({date: 1}).lean().exec((err, data)=>{
            if(!err){
                res.status(200).send({message: "Error", data: data});
            }
        });
    });

    app.post('/getbalance', async (req, res) => {
        let filter = {username: req.session.username};

        RegistrModel.aggregate([
            {$match: filter},
            {$group:
                { _id: { 'currency': '$currency', 'operationType': '$operationType'},
                    total: {$sum: "$sum"}
                }
            }
        ],(err, data) => {
            //console.log(data);
            if(!err) res.status(200).send({message: "Error", data: data});
        });
    });
};