const router = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

router.post('/', async (req, res) => {
    const user = req.body
    if (!user)
    {
        return res.status(401).json({error: "User data is missing"})
    }
    const passHash = await bcrypt.hash(user.password, 10)
    const userToAdd = new User({
        username: user.username,
        name: user.name,
        passwordHash: passHash
    })

    const addedUser = await userToAdd.save()
    res.status(201).json(addedUser)
})

router.get('/', async (req, res) => {
    const allUsers = await User.find({})
    res.status(200).json(allUsers)
})


module.exports = router