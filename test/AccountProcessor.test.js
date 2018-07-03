// Import lowdb for database handling
const low = require('lowdb')
// FileSync will provide us with a way to save our db to a file
const FileSync = require('lowdb/adapters/FileSync')

// Our AccountProcessor Module
var AccountProcessor = require("../src/AccountProcessor.js");

// Here we setup the db file
const adapter = new FileSync(__dirname + '/db.json')
// And again, finishing the db setup
const db = low(adapter);

// Setup database defaults
db.defaults({ accounts: [] }).write();

var created_identifier;
var created_shared_key;
var created_identifier_with_email;
var created_email_shared_key;

var shared_email = "test@example.com";
var shared_ip = "127.0.0.1";

test("Test Create (no email)", () => {
	var account = new AccountProcessor(db);

	var ip = shared_ip;

	var response = account.create(ip)

	created_identifier = response.identifier;
	created_shared_key = response.shared_key;

	expect(response.error).toBe(false)
	expect(response.identifier).toBeDefined()
	expect(response.shared_key).toBeDefined()
	expect(response.email).toBeUndefined()
})

test("Test Create (email)", () => {
	var account = new AccountProcessor(db);

	var email = shared_email;

	var ip = shared_ip;

	var response = account.create(ip, email)

	created_identifier_with_email = response.identifier;
	created_email_shared_key = response.shared_key;

	expect(response.error).toBe(false)
	expect(response.identifier).toBeDefined()
	expect(response.shared_key).toBeDefined()
	expect(response.email).toBe(shared_email)
})

test("Test Create (fail no IP)", () => {
	var account = new AccountProcessor(db);

	var email = shared_email;

	var ip = undefined;

	var response = account.create(ip, email)

	expect(response.error).toBe(true)
	expect(response.type).toBe("IP_ADDRESS_IS_REQUIRED")
})

test("Test Create (fail on duplicate email)", () => {
	var account = new AccountProcessor(db);

	var email = shared_email;

	var ip = shared_ip;

	var response = account.create(ip, email)

	expect(response.error).toBe(true)
	expect(response.type).toBe("EMAIL_ALREADY_IN_USE")
})

test("Test Checkload (identifier)", () => {
	var account = new AccountProcessor(db);

	var identifier = created_identifier;

	var response = account.checkload(identifier)

	expect(response.error).toBe(false)
	expect(response.identifier).toBe(created_identifier)
})

test("Test Checkload (email)", () => {
	var account = new AccountProcessor(db);

	var identifier = shared_email;

	var response = account.checkload(identifier)

	expect(response.error).toBe(false)
	expect(response.identifier).toBe(created_identifier_with_email)
})

test("Test Checkload (fail on no identifier)", () => {
	var account = new AccountProcessor(db);

	var response = account.checkload()

	expect(response.error).toBe(true)
	expect(response.type).toBe("IDENTIFIER_IS_REQUIRED")
})

test("Test Load (identifier)", () => {
	var account = new AccountProcessor(db);

	var identifier = created_identifier;

	var response = account.load(identifier)

	expect(response.error).toBe(false)
	expect(response.identifier).toBe(created_identifier)
	expect(response.encrypted_data).toBeDefined()
})

test("Test Load (email)", () => {
	var account = new AccountProcessor(db);

	var identifier = shared_email;

	var response = account.load(identifier)

	expect(response.error).toBe(false)
	expect(response.identifier).toBe(created_identifier_with_email)
	expect(response.encrypted_data).toBeDefined()
})

test("Test Load (fail on no identifier)", () => {
	var account = new AccountProcessor(db);

	var identifier = undefined;

	var response = account.load(identifier)

	expect(response.error).toBe(true)
	expect(response.type).toBe("IDENTIFIER_IS_REQUIRED")
	expect(response.encrypted_data).toBeUndefined()
})

test("Test Update (identifier)", () => {
	var account = new AccountProcessor(db);

	var identifier = created_identifier;
	var shared_key = created_shared_key;
	var ip = shared_ip;

	var encrypted_data = "fake-encrypted-data"

	var response = account.update(ip, identifier, encrypted_data, shared_key)

	expect(response.error).toBe(false)
	expect(response.identifier).toBe(identifier)
})

test("Test Update (email)", () => {
	var account = new AccountProcessor(db);

	var identifier = shared_email;
	var shared_key = created_email_shared_key;
	var ip = shared_ip;

	var encrypted_data = "fake-encrypted-data"

	var response = account.update(ip, identifier, encrypted_data, shared_key)

	expect(response.error).toBe(false)
	expect(response.identifier).toBe(created_identifier_with_email)
})

test("Test Update (fail on no encrypted_data)", () => {
	var account = new AccountProcessor(db);

	var identifier = shared_email;
	var shared_key = created_email_shared_key;
	var ip = shared_ip;

	var encrypted_data = undefined

	var response = account.update(ip, identifier, encrypted_data, shared_key)

	expect(response.error).toBe(true)
	expect(response.type).toBe("NO_ENCRYPTED_DATA")
})

test("Test Update (fail on invalid shared_key)", () => {
	var account = new AccountProcessor(db);

	var identifier = created_identifier;
	var shared_key = "wrong-shared-key";
	var ip = shared_ip;

	var encrypted_data = "fake-encrypted-data"

	var response = account.update(ip, identifier, encrypted_data, shared_key)

	expect(response.error).toBe(true)
	expect(response.type).toBe("INVALID_SHAREDKEY")
})