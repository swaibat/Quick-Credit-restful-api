"use strict";var express;module.link('express',{default(v){express=v}},0);var request;module.link('supertest',{default(v){request=v}},1);var loansRoute;module.link('../api/routes/loans.mjs',{default(v){loansRoute=v}},2);



const app = express();
app.use(express.json());

app.use('/api/v1/loans', loansRoute);


describe('GET /api/v1/loans', function() {
    it('responds with json', function(done) {
        request(app)
        .get('/api/v1/loan')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
});

