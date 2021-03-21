const userService = require('../services/user_service')
const Role = require('../helpers/role');
const express = require('express');
const router = express.Router();
const authorize = require('../helpers/authorize')

router.post('/',registerUser) 
router.post('/login', login)
router.get('/',authorize(Role.Admin), getUsers)
router.get('/:currentUserId/:userId',authorize(Role.Admin), getUserById)
router.post('/upgrade/:currentUserId/:userId', authorize(Role.Admin), upgradeUser)

module.exports = router;

function login(req,res,next){
    userService.login(req.body.name,req.body.password)
    .then(result=> {
        res.json(result)
    })
    .catch(err => next(err))
}

function registerUser(req, res, next){
    let role = req.body.role ? req.body.role : Role.User
    userService.registerUser(req.body.name,req.body.password, role)
    .then(user => res.json(user))
    .catch(err => next(err))
}

function getUsers (req, res, next){
    userService.getUsers()
        .then(users => res.json(users))
        .catch(err => next(err))
}

async function getUserById (req, res, next) {
    userService.getById(req.params.currentUserId)
        .then(user => {
            userService.getById(req.params.userId)
            .then(user =>  res.json(user))
            .catch(err => next(err))
        })  
        .catch(err => next(err))
}

async function upgradeUser (req, res, next){
    userService.getById(req.params.currentUserId)
        .then(user => {
            userService.getById(req.params.userId)
            .then(user =>  {
                userService.upgradeToManager(user.id)
                .then(user => res.json(user))
                .catch(err => next(err))
            })
            .catch(err => next(err))
        })  
        .catch(err => next(err))
}



