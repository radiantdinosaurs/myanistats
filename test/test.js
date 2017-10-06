let request = require('request');
let base_url = 'http://localhost:8085/';
var chai = require('chai');
var index_controller = require('../controllers/indexController');


describe("Index Test", function() {
    describe("GET /", function() {
        it("returns status code 200", function() {
            request.get(base_url, function(error, response, body) {
                assert.equal(200, response.statusCode);
                done();
            });
        });
    });
});