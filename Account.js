var crypto = require('crypto')

module.exports =
class Account {
	constructor(db, req) {
		this.db_ = db;
		this.req_ = req;
	}

	create(){
		var email = ('email' in this.req_.body) ? this.req_.body.email : null;

		if (email) {
			var match = this.db_.get('accounts')
				.find({ email: email })
				.value();

			if (match){
				return {
					error: true,
					errorText: "Please provide a unique email"
				}
			}
		}

		this.data = {
			identifier: this.generateIdentifier(),
			shared_key: crypto.randomBytes(48).toString('hex'),
			wallet_data: "",
			created_at: this.getNow(),
			created_ip_address: this.getIP(),
			email: email
		}

		this.save();

		return {
			identifier: this.data.identifier,
			shared_key: this.data.shared_key,
			error: false
		}
	}

	checkload(){
		var account = this.getAccount();

		if (!account){
			return {
				error: {
					type: "INVALID_PARAM",
					message: "Missing required get parameters, required: (identifier)"
				}
			}
		}

		return {
			identifier: account.identifier,
			gauth_enabled: false,
			encryption_settings: ('encryption_settings' in account) ? account.encryption_settings : {algo: 'aes', iterations: 5},
		}
	}

	load(){
		var account = this.getAccount();

		// If the error message is set, return the error
		if (account.error){
			return account;
		}

		return {
			error: false,
			wallet: account.wallet_data
		}
	}

	readaccount(){
		var account = this.getAccount();

		// If the error message is set, return the error
		if (account.error){
			return account;
		}

		return {
			error: false,
			data: {
				email: account.email
			}
		}
	}

	update(){
		var account = this.getAccount();

		// If the error message is set, return the error
		if (account.error){
			return account;
		}

		this.data = account;

		var wallet_data = ("wallet_data" in this.req_.body) ? this.req_.body.wallet_data : undefined;

		if (!wallet_data){
			return {
				error: true,
				message: "(wallet_data) not supplied!"
			}
		}

		this.data.wallet_data = wallet_data;

		var save = this.save();

		if (save.error){
			return save
		}

		return {
			error: false,
			message: "Successfully updated wallet"
		}
	}

	getAccount(){
		var identifier;

		if (this.req_.body && this.req_.body.identifier)
			identifier = this.req_.body.identifier

		if (!identifier && this.req_.params && this.req_.params.identifier)
			identifier = this.req_.params.identifier

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
					error: {
						type: "WALLET_NOT_FOUND",
						message: "There is no wallet with that identifier"
					}
				};
			}
		} else {
			return matchID;
		}
	}

	save(){
		this.data.last_update = this.getNow();
		this.data.last_ip_address = this.getIP()

		// Check if the account exists
		var exists = this.db_.get('accounts')
			.find({ identifier: this.data.identifier })
			.value();

		if (exists){
			if (exists.shared_key === this.data.shared_key){
				var match = this.db_.get('accounts')
					.find({ identifier: this.data.identifier, shared_key: this.data.shared_key })
					.assign(this.data)
					.write()
			} else {
				return {
					error: {
						type: "INVALID_SHAREDKEY",
						message: "Fatal Error: Shared Key does not match wallet, update aborted"
					}
				}
			}
		} else {
			this.db_.get('accounts')
				.push(this.data)
				.write();
		}

		return {
			error: false
		}
	}

	generateIdentifier() {
		var bytes = crypto.randomBytes(16).toString('hex');

		return bytes.slice(0, 7) + "-" + bytes.slice(8, 16) + "-" + bytes.slice(17, 24) + "-" + bytes.slice(25, 32);
	}

	getIP(){
		return this.req_.headers['x-forwarded-for'] || this.req_.connection.remoteAddress
	}

	getNow(){
		return Math.floor(new Date() / 1000)
	}
}