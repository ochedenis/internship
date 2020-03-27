const request = require('supertest');
const chai = require('chai');

const server = require('../../src/server/server');

const { expect } = chai;

let accessToken = '';
let refreshToken = '';

describe('AminComponent -> controller', () => {

    it('/v2/login -> POST -> invalid email', (done) => {
        request(server)
            .post('/v2/login')
            .send({
                email: 'nosuchemail@',
                password: '123456',
            })
            .set('Accept', 'application/json')
            .expect(422, done);
    });

    it('/v2/login -> POST -> wrong admin', (done) => {
        request(server)
            .post('/v2/login')
            .send({
                email: 'nosuchemail@mila.net',
                password: '123456',
            })
            .set('Accept', 'application/json')
            .expect(400, 'Inavalid password or email address!', done);
    });

    it('/v2/register -> POST -> miss info', (done) => {
        request(server)
            .post('/v2/register')
            .send({
                email: 'nosuchemail@mila.net',
                password: '123456',
            })
            .set('Accept', 'application/json')
            .expect(422, done);
    });

    it('/v2/register -> POST -> inavalid email', (done) => {
        request(server)
            .post('/v2/register')
            .send({
                name: 'Adminus',
                email: 'nosuchemail@',
                password: '123456',
            })
            .set('Accept', 'application/json')
            .expect(422, done);
    });

    it('/v2/register -> POST -> registration', (done) => {
        request(server)
            .post('/v2/register')
            .send({
                name: 'Adminus',
                email: 'nosuchemail@mila.net',
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
                name: 'Adminus',
                email: 'nosuchemail@mila.net',
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
                email: 'nosuchemail@mila.net',
            })
            .set('Accept', 'application/json')
            .expect(200, done);
    });

    it('/v2/login -> POST -> login', (done) => {
        request(server)
            .post('/v2/login')
            .send({
                email: 'nosuchemail@mila.net',
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
                email: 'nosuchemail@mila.net',
                password: '123456',
            })
            .set('Accept', 'application/json')
            .expect(400, 'Admin with this email has already logged in!', done);
    });

});
