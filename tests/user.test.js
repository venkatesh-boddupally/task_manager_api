const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const {
    userId,
    user, 
    userTwoId,
    userTwo,
    taskOne, 
    taskTwo,
    taskThree,
    setupDatabase
} = require('./fixtures/db')
const testEmail = "test@gmail.com"
const testPassword = "test123"


beforeEach(setupDatabase)

test('should test a user signup', async () => {
    const response = await request(app).post('/users').send({
        name: "signup",
        email: "signup@gmail.com",
        password: "signup123"
    }).expect(201)

    const testUser = await User.findById(response.body.user._id)
    expect(testUser).not.toBeNull()

    expect(response.body).toMatchObject({
        user: {
            name: "signup",
            email: "signup@gmail.com"
        },
        token: testUser.tokens[0].token
    })

    expect(testUser.password).not.toBe('signup123')
})

test('should test a user login', async () => {
    await request(app).post('/users/login').send({
        email: testEmail,
        password: testPassword
    }).expect(200)
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

test('Should upload avatar image', async () => {
    await request(app).post('/users/me/avatar')
        .set('Authorization', `Bearer ${user.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/test.png')
        .expect(200)
    const testUser = await User.findById(userId)
    expect(testUser.avatar).toEqual(expect.any(Buffer))
})

test('should update valid user data', async () => {
    await request(app).patch('/users/me')
        .set('Authorization', `Bearer ${user.tokens[0].token}`)
        .send({
            name: "test123"
        })
        .expect(200)

    const testUser = await User.findById(userId)
    expect(testUser.name).toEqual('test123')
})

test('should not update invalid user data', async () => {
    await request(app).patch('/users/me')
        .set('Authorization', `Bearer ${user.tokens[0].token}`)
        .send({
            location: "test123"
        })
        .expect(400)
})