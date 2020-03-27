const request = require('supertest');
const chai = require('chai');

const server = require('../../src/server/server');

const { expect } = chai;

let accessToken = '';
let refreshToken = '';
let userId = '';

describe('AminComponent -> controller', () => {

    ///////////////////////   TESTS ADMIN ROUTES

    it('/v2/login -> POST -> invalid email', (done) => {
        request(server)
            .post('/v2/login')
            .send({
                email: 'bagovMnogo9Odin@',
                password: '123456',
            })
            .set('Accept', 'application/json')
            .expect(422, done);
    });

    it('/v2/login -> POST -> wrong admin', (done) => {
        request(server)
            .post('/v2/login')
            .send({
                email: 'bagovMnogo9Odin@kostili.com',
                password: '123456',
            })
            .set('Accept', 'application/json')
            .expect(400, 'Inavalid password or email address!', done);
    });

    it('/v2/register -> POST -> miss info', (done) => {
        request(server)
            .post('/v2/register')
            .send({
                email: 'bagovMnogo9Odin@kostili.com',
                password: '123456',
            })
            .set('Accept', 'application/json')
            .expect(422, done);
    });

    it('/v2/register -> POST -> inavalid email', (done) => {
        request(server)
            .post('/v2/register')
            .send({
                name: 'Tester Ot Boga',
                email: 'bagovMnogo9Odin@',
                password: '123456',
            })
            .set('Accept', 'application/json')
            .expect(422, done);
    });

    it('/v2/register -> POST -> registration', (done) => {
        request(server)
            .post('/v2/register')
            .send({
                name: 'Tester Ot Boga',
                email: 'bagovMnogo9Odin@kostili.com',
                password: '123456',
            })
            .set('Accept', 'application/json')
            .expect(200)
            .then(({ body }) => {
                const expectBody = expect(body);

                expectBody.to.have.property('accessToken').and.to.be.a('string');
                expectBody.to.have.property('refreshToken').and.to.be.a('string');

                accessToken = body.accessToken;
                refreshToken = body.refreshToken;

                done();
            })
            .catch((err) => done(err));
    });

    it('/v2/register -> POST -> re-registration', (done) => {
        request(server)
            .post('/v2/register')
            .send({
                name: 'Tester Ot Boga',
                email: 'bagovMnogo9Odin@kostili.com',
                password: '123456',
            })
            .set('Accept', 'application/json')
            .expect(500, done);
    });

    it('/v2/token -> GET -> no token field at body', (done) => {
        request(server)
            .get('/v2/token')
            .send({ })
            .set('Accept', 'application/json')
            .expect(422, done);
    });

    it('/v2/token -> GET -> send invalid token', (done) => {
        request(server)
            .get('/v2/token')
            .send({
                token: '342t7gf9342hv5',
            })
            .set('Accept', 'application/json')
            .expect(400, 'Inavalid token!', done);
    });

    it('/v2/token -> GET -> get token', (done) => {
        request(server)
            .get('/v2/token')
            .send({
                token: refreshToken,
            })
            .set('Accept', 'application/json')
            .expect(200)
            .then(({ body }) => {
                const expectBody = expect(body);

                expectBody.to.have.property('accessToken').and.to.be.a('string');
                expectBody.to.have.property('refreshToken').and.to.be.a('string');

                accessToken = body.accessToken;
                refreshToken = body.refreshToken;

                done();
            })
            .catch((err) => done(err));
    });

    it('/v2/logout -> DELETE -> send invalid email', (done) => {
        request(server)
            .delete('/v2/logout')
            .send({
                email: '342t7gf9342hv5',
            })
            .set('Accept', 'application/json')
            .expect(422, done);
    });

    it('/v2/logout -> DELETE -> send wrong email', (done) => {
        request(server)
            .delete('/v2/logout')
            .send({
                email: 'blabla@mila.net',
            })
            .set('Accept', 'application/json')
            .expect(400, 'No login with this email!', done);
    });

    it('/v2/logout -> DELETE -> logout', (done) => {
        request(server)
            .delete('/v2/logout')
            .send({
                email: 'bagovMnogo9Odin@kostili.com',
            })
            .set('Accept', 'application/json')
            .expect(200, done);
    });

    it('/v2/login -> POST -> login', (done) => {
        request(server)
            .post('/v2/login')
            .send({
                email: 'bagovMnogo9Odin@kostili.com',
                password: '123456',
            })
            .set('Accept', 'application/json')
            .expect(200)
            .then(({ body }) => {
                const expectBody = expect(body);

                expectBody.to.have.property('accessToken').and.to.be.a('string');
                expectBody.to.have.property('refreshToken').and.to.be.a('string');

                accessToken = body.accessToken;
                refreshToken = body.refreshToken;

                done();
            })
            .catch((err) => done(err));
    });

    it('/v2/login -> POST -> re-login', (done) => {
        request(server)
            .post('/v2/login')
            .send({
                email: 'bagovMnogo9Odin@kostili.com',
                password: '123456',
            })
            .set('Accept', 'application/json')
            .expect(400, 'Admin with this email has already logged in!', done);
    });

    ///////////////////////   TESTS USERS ROUTES

    it('/v2/users -> GET -> no token', (done) => {
        request(server)
            .get('/v2/users')
            .set('Accept', 'application/json')
            .expect(401, 'Access denied!', done);
    });

    it('/v2/users -> GET -> invalid token', (done) => {
        request(server)
            .get('/v2/users')
            .set('Accept', 'application/json')
            .set('access-token', '349873y7890y05ebb')
            .expect(403, 'Invalid token!', done);
    });

    it('/v2/users -> GET', (done) => {
        request(server)
            .get('/v2/users')
            .set('Accept', 'application/json')
            .set('access-token', accessToken)
            .expect('Content-Type', /json/)
            .expect(200)
            .then(({ body }) => {
                const expectBody = expect(body);

                expectBody.to.have.property('data').and.to.be.a('array');

                done();
            })
            .catch((err) => done(err));
    });

    it('/v2/users -> POST -> invalid token', (done) => {
        request(server)
            .post('/v2/users')
            .set('Accept', 'application/json')
            .set('access-token', '349873y7890y05ebb')
            .expect(403, 'Invalid token!', done);
    });

    it('/v2/users -> POST -> invalid data', (done) => {
        request(server)
            .post('/v2/users')
            .send({
                email: 'incognito@',
                fullName: 'Gad9 Petrovich Hrenova',
            })
            .set('Accept', 'application/json')
            .set('access-token', accessToken)
            .expect('Content-Type', /json/)
            .expect(422, done);
    });

    it('/v2/users -> POST', (done) => {
        request(server)
            .post('/v2/users')
            .send({
                email: 'incognito@jizni.net',
                fullName: 'Gad9 Petrovich Hrenova',
            })
            .set('Accept', 'application/json')
            .set('access-token', accessToken)
            .expect('Content-Type', /json/)
            .expect(200)
            .then(({ body }) => {
                const expectBody = expect(body);

                expectBody.to.have.property('data').and.to.be.a('object');

                userId = body.data._id;

                done();
            })
            .catch((err) => done(err));
    });

    it('/v2/users -> PUT -> invalid token', (done) => {
        request(server)
            .put('/v2/users')
            .set('Accept', 'application/json')
            .set('access-token', '349873y7890y05ebb')
            .expect(403, 'Invalid token!', done);
    });

    it('/v2/users -> PUT -> invalid data', (done) => {
        request(server)
            .put('/v2/users')
            .send({
                email: 'incognito@',
                fullName: 'Gad9 Petrovich Hrenova',
            })
            .set('Accept', 'application/json')
            .set('access-token', accessToken)
            .expect('Content-Type', /json/)
            .expect(422, done);
    });

    it('/v2/users -> PUT', (done) => {
        request(server)
            .put('/v2/users')
            .send({
                id: userId,
                email: 'incognito@jizni.net',
                fullName: 'Gad9 Petrovich Normalno',
            })
            .set('Accept', 'application/json')
            .set('access-token', accessToken)
            .expect('Content-Type', /json/)
            .expect(200)
            .then(({ body }) => {
                expect(body);
                expect(body.data.nModified).to.be.equal(1);

                done();
            })
            .catch((err) => done(err));
    });

    it('/v2/users -> DELETE -> invalid token', (done) => {
        request(server)
            .delete('/v2/users')
            .set('Accept', 'application/json')
            .set('access-token', '349873y7890y05ebb')
            .expect(403, 'Invalid token!', done);
    });

    it('/v2/users -> DELETE -> invalid data', (done) => {
        request(server)
            .delete('/v2/users')
            .send({
                blabla: 'whiskas',
            })
            .set('Accept', 'application/json')
            .set('access-token', accessToken)
            .expect('Content-Type', /json/)
            .expect(422, done);
    });

    it('/v2/users -> DELETE', (done) => {
        request(server)
            .delete('/v2/users')
            .send({
                id: userId,
            })
            .set('Accept', 'application/json')
            .set('access-token', accessToken)
            .expect('Content-Type', /json/)
            .expect(200)
            .then(({ body }) => {
                expect(body);
                expect(body.data.deletedCount).to.be.equal(1);

                done();
            })
            .catch((err) => done(err));
    });
});
