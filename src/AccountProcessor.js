var crypto = require('crypto')

module.exports =
class AccountProcessor {
	constructor(db) {
		this.db_ = db;
	}

	create(ip_address, email){
		if (!ip_address)
			return {
				error: true,
				type: "IP_ADDRESS_IS_REQUIRED"
			}
		if (email) {
			var match = this.db_.get('accounts')
				.find({ email: email })
				.value();

			if (match){
				return {
					error: true,
					type: "EMAIL_ALREADY_IN_USE",
					errorText: "Please provide a unique email"
				}
			}
		}

		this.data = {
			identifier: this.generateIdentifier(),
			shared_key: crypto.randomBytes(48).toString('hex'),
			encrypted_data: "",
			created_at: this.getNow(),
			created_ip_address: ip_address,
			email: email
		}

		var response = this.save(ip_address)

		response.shared_key = this.data.shared_key
		response.email = this.data.email

		return response
	}

	checkload(identifier){
		var account = this.getAccount(identifier);

		if (account.error){
			return account
		}

		return {
			error: false,
			identifier: account.identifier,
			gauth_enabled: false,
			encryption_settings: ('encryption_settings' in account) ? account.encryption_settings : {algo: 'aes', iterations: 5},
		}
	}

	load(identifier){
		var account = this.getAccount(identifier);

		// If the error message is set, return the error
		if (account.error){
			return account;
		}

		return {
			error: false,
			identifier: account.identifier,
			encrypted_data: account.encrypted_data
		}
	}

	update(ip_address, identifier, encrypted_data, shared_key){
		var account = this.getAccount(identifier);

		// If the error message is set, return the error
		if (account.error){
			return account;
		}

		this.data = account;

		if (!encrypted_data){
			return {
				error: true,
				type: "NO_ENCRYPTED_DATA",
				message: "encrypted_data not supplied! Cannot save!"
			}
		}

		this.data.encrypted_data = encrypted_data;

		return this.save(ip_address, shared_key)
	}

	getAccount(identifier){
		if (!identifier){
			return {
				error: true,
				type: "IDENTIFIER_IS_REQUIRED",
				message: "You must submit an identifier to check!"
			}
		}

		var matchID = this.db_.get('accounts')
			.find({ identifier: identifier })
			.value();

		if (!matchID){
			var matchEmail = this.db_.get('accounts')
				.find({ email: identifier })
				.value();

			if (matchEmail){
				return matchEmail;
			} else {
				return {
					error: true,
					type: "WALLET_NOT_FOUND",
					message: "There is no wallet with that identifier"
				};
			}
		} else {
			return matchID;
		}
	}

	save(ip_address, shared_key){
		this.data.last_update = this.getNow();
		this.data.last_ip_address = ip_address;

		// Check if the account exists
		var exists = this.db_.get('accounts')
			.find({ identifier: this.data.identifier })
			.value();

		if (exists){
			if (exists.shared_key === shared_key){
				var match = this.db_.get('accounts')
					.find({ identifier: this.data.identifier, shared_key: this.data.shared_key })
					.assign(this.data)
					.write()

				return {
					error: false,
					identifier: this.data.identifier
				}

			} else {
				return {
					error: true,
					type: "INVALID_SHAREDKEY",
					message: "Fatal Error: Shared Key does not match wallet, update aborted"
				}
			}
		} else {
			var res = this.db_.get('accounts').push(this.data).write();
			
			return {
				error: false,
				identifier: this.data.identifier
			}
		}
	}

	generateIdentifier() {
		var bytes = crypto.randomBytes(16).toString('hex');

		return bytes.slice(0, 7) + "-" + bytes.slice(8, 16) + "-" + bytes.slice(17, 24) + "-" + bytes.slice(25, 32);
	}

	getNow(){
		return Math.floor(new Date() / 1000)
	}
}