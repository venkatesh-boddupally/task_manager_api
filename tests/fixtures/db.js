const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('../../src/models/user')
const Task = require('../../src/models/task')

const testEmail = "test@gmail.com"
const testPassword = "test123"


const userId = new mongoose.Types.ObjectId()
const user = {
    _id: userId,
    name: "test",
    email: testEmail,
    password: testPassword,
    tokens: [{
        token: jwt.sign({_id: userId}, process.env.JWT_SECRET)
    }]
}

const userTwoId = new mongoose.Types.ObjectId()
const userTwo = {
    _id: userTwoId,
    name: "test2",
    email: "test23@gmail.com",
    password: 'test2123',
    tokens: [{
        token: jwt.sign({_id: userTwoId}, process.env.JWT_SECRET)
    }]
}

const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: 'First Task',
    completed: false,
    owner: user._id
}

const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: 'seconf Task',
    completed: true,
    owner: user._id
}

const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description: 'third Task',
    completed: true,
    owner: userTwo._id
}


const setupDatabase = async () => {
    await User.deleteMany()
    await Task.deleteMany()

    await new User(user).save()
    await new User(userTwo).save()

    await new Task(taskOne).save()
    await new Task(taskTwo).save()
    await new Task(taskThree).save()
}
module.exports = {
    userId,
    user, 
    userTwoId,
    userTwo,
    taskOne, 
    taskTwo,
    taskThree,
    setupDatabase
}