const request = require('supertest');
const app = require('../src/app')

var created_identifier;
var created_shared_key;
var created_identifier_with_email;
var created_email_shared_key;

var shared_email = "test@example.com";
var shared_ip = "127.0.0.1";

test('Get Status', (done) => {
    request(app).get('/').then((response) => {
    	expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe("online");
        done();
    });
});

test('Create (email)', (done) => {
    request(app).post('/create').send({
    	"email": shared_email
    }).then((response) => {
    	expect(response.statusCode).toBe(200);
        expect(response.body.error).toBe(false)
		expect(response.body.identifier).toBeDefined()
		expect(response.body.shared_key).toBeDefined()
		expect(response.body.email).toBe(shared_email)

		created_identifier_with_email = response.body.identifier
		created_email_shared_key = response.body.shared_key

        done();
    });
});

test('Create (no email)', (done) => {
    request(app).post('/create').send().then((response) => {
    	expect(response.statusCode).toBe(200);
        expect(response.body.error).toBe(false)
		expect(response.body.identifier).toBeDefined()
		expect(response.body.shared_key).toBeDefined()
		expect(response.body.email).toBeUndefined()

		created_identifier = response.body.identifier
		created_shared_key = response.body.shared_key

        done();
    });
});

test('Create (fail on email taken)', (done) => {
    request(app).post('/create').send({
    	"email": shared_email
    }).then((response) => {
    	expect(response.statusCode).toBe(400);
        expect(response.body.error).toBe(true)
		expect(response.body.type).toBe("EMAIL_ALREADY_IN_USE")
        done();
    });
});


test("Test Checkload (identifier)", (done) => {
	request(app).post('/load').send({
		identifier: created_identifier
	}).then((response) => {
    	expect(response.statusCode).toBe(200);
    	expect(response.body.error).toBe(false)
		expect(response.body.identifier).toBe(created_identifier)
        done();
    });
})

test("Test Checkload (email)", (done) => {
	request(app).post('/checkload').send({
		identifier: shared_email
	}).then((response) => {
    	expect(response.statusCode).toBe(200);
    	expect(response.body.error).toBe(false)
		expect(response.body.identifier).toBe(created_identifier_with_email)
        done();
    });
})

test("Test Checkload (fail on no identifier)", (done) => {
	request(app).post('/checkload').send().then((response) => {
    	expect(response.statusCode).toBe(400);
    	expect(response.body.error).toBe(true)
		expect(response.body.type).toBe("IDENTIFIER_IS_REQUIRED")
        done();
    });
})

test("Test Load (identifier)", (done) => {
	request(app).post('/load').send({
		identifier: created_identifier
	}).then((response) => {
    	expect(response.statusCode).toBe(200);
    	expect(response.body.error).toBe(false)
		expect(response.body.identifier).toBe(created_identifier)
		expect(response.body.encrypted_data).toBeDefined()
        done();
    });
})

test("Test Load (email)", (done) => {
	request(app).post('/load').send({
		identifier: shared_email
	}).then((response) => {
    	expect(response.statusCode).toBe(200);
    	expect(response.body.error).toBe(false)
		expect(response.body.identifier).toBe(created_identifier_with_email)
		expect(response.body.encrypted_data).toBeDefined()
        done();
    });
})

test("Test Load (fail on no identifier)", (done) => {
	request(app).post('/load').send().then((response) => {
    	expect(response.statusCode).toBe(400);
    	expect(response.body.error).toBe(true)
		expect(response.body.type).toBe("IDENTIFIER_IS_REQUIRED")
		expect(response.body.encrypted_data).toBeUndefined()
        done();
    });
})

test("Test Update (identifier)", (done) => {
	request(app).post("/update").send({
		identifier: created_identifier,
		shared_key: created_shared_key,
		encrypted_data: "fake-encrypted-data"
	}).then((response) => {
    	expect(response.statusCode).toBe(200);
		expect(response.body.error).toBe(false)
		expect(response.body.identifier).toBe(created_identifier)
		done()
	})
})

test("Test Update (email)", (done) => {
	request(app).post("/update").send({
		identifier: shared_email,
		shared_key: created_email_shared_key,
		encrypted_data: "fake-encrypted-data"
	}).then((response) => {
    	expect(response.statusCode).toBe(200);
		expect(response.body.error).toBe(false)
		expect(response.body.identifier).toBe(created_identifier_with_email)
		done()
	})
})

test("Test Update (fail on no encrypted_data)", (done) => {
	request(app).post("/update").send({
		identifier: created_identifier,
		shared_key: created_shared_key
	}).then((response) => {
    	expect(response.statusCode).toBe(400);
		expect(response.body.error).toBe(true)
		expect(response.body.type).toBe("NO_ENCRYPTED_DATA")
		done()
	})
})

test("Test Update (fail on invalid shared_key)", (done) => {
	request(app).post("/update").send({
		identifier: created_identifier,
		shared_key: "wrong-shared-key",
		encrypted_data: "fake-encrypted-data"
	}).then((response) => {
    	expect(response.statusCode).toBe(400);
		expect(response.body.error).toBe(true)
		expect(response.body.type).toBe("INVALID_SHAREDKEY")
		done()
	})
})