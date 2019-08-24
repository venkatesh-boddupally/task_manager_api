const request = require('supertest')
const app = require('../src/app')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('../src/models/user')

const testEmail = "test@gmail.com"
const testPassword = "test123"

const userId = mongoose.Types.ObjectId()
const user = {
    _id: userId,
    name: "test",
    email: testEmail,
    password: testPassword,
    tokens: [{
        token: jwt.sign({_id: userId}, process.env.JWT_SECRET)
    }]
}

beforeEach(async () => {
    await User.deleteMany()
    await new User(user).save()
})

test('should test a user signup', async () => {
    const response = await request(app).post('/users').send({
        name: "signup",
        email: "signup@gmail.com",
        password: "signup123"
    }).expect(201)

    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    expect(response.body).toMatchObject({
        user: {
            name: "signup",
            email: "signup@gmail.com"
        },
        token: user.tokens[0].token
    })

    expect(user.password).not.toBe('signup123')
})

test('should test a user login', async () => {
    const response = await request(app).post('/users/login').send({
        email: testEmail,
        password: testPassword
    }).expect(200)

    const user = await User.findById(userId)
    expect(response.body.token).toBe(user.tokens[0].token)
})

test('should test a user invalid credentials login', async () => {
    await request(app).post('/users/login').send({
        email: 'invalid@gmail.com',
        password: 'invalid123'
    }).expect(400)
})

test('Should get user profile', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${user.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should not get user profile with out authorization', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})

test('Should delete user profile if authenticated', async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${user.tokens[0].token}`)
        .send()
        .expect(200)

    const testUser = await User.findById(userId)
    expect(testUser).toBeNull()
})

test('Should not delete user profile if not authenticated', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})