[![](https://travis-ci.org/oipwg/oip-keystore.svg?branch=master)](https://travis-ci.org/oipwg/oip-keystore)
[![](https://img.shields.io/npm/v/oip-keystore.svg)](https://www.npmjs.com/package/oip-keystore)
# OIP Keystore

OIP Keystore is a simple encrypted keystore server. By sharing a "shared_key" it will update the stored encrypted data.

## Table of Contents

- [Installation Instructions](https://github.com/oipwg/oip-keystore#installation-instructions)
  - [Install Locally](https://github.com/oipwg/oip-keystore#install-locally)
  - [Install Programmatically](https://github.com/oipwg/oip-keystore#install-programmatically)
- [Getting Started](https://github.com/oipwg/oip-keystore#getting-started)
  - [Running an OIP-Keystore server](https://github.com/oipwg/oip-keystore#running-an-oip-keystore-server)
  - [Running on a different port](https://github.com/oipwg/oip-keystore#running-on-a-different-port)
  - [Using OIP Keystore Programmatically](https://github.com/oipwg/oip-keystore#using-oip-keystore-programmatically)
- [API Methods](https://github.com/oipwg/oip-keystore#api-methods)
  - [Status](https://github.com/oipwg/oip-keystore#status)
  - [Create](https://github.com/oipwg/oip-keystore#create)
  - [Checkload](https://github.com/oipwg/oip-keystore#check-load)
  - [Load](https://github.com/oipwg/oip-keystore#load)
  - [Update](https://github.com/oipwg/oip-keystore#update)
- [License](https://github.com/oipwg/oip-keystore#license)

## Installation Instructions

There are two different ways to install and run an OIP Keystore server. You can either use it programmatically, or clone it to run a server without including it in your own code.

### Install Locally

To install on your server, clone this repo into a local folder.

```bash
$ git clone https://github.com/oipwg/oip-keystore.git
```

After you have cloned it, `cd` into the directory you installed it into and run

```bash
$ npm install
```

After the `npm install` finishes, you can continue onto the [Running an OIP Keystore server](https://github.com/oipwg/oip-keystore#running-an-oip-keystore-server) section under Getting Started.

### Install Programmatically

To spawn an OIP Keystore server inside of your own app, first install the module via NPM.
```bash
$ npm install oip-keystore --save
```

After you have installed it, continue on to [Using OIP Keystore Programmatically](https://github.com/oipwg/oip-keystore#using-oip-keystore-programmatically)

## Getting Started

### Running an OIP Keystore server

To run your keystore server, `cd` into the directory you cloned it, and then start it using the following command.

```bash
$ node src/server.js
```

After you run that command you should see it print out that it is running the server

```
Listening on http://127.0.0.1:9196
```

### Running on a different port

To run the OIP Keystore server on a different port, edit the `config.js` file inside of your cloned `oip-keystore` folder.

### Using OIP Keystore Programmatically

To run an OIP Keystore server inside of your app, first make sure you have installed `oip-keystore` via npm/yarn.

After making sure it is installed, you can import it and startup the server using the following code.

```javascript
import Keystore from `oip-keystore`

var port = 9196

var startupCallback = function(){
	console.log("Server started on port: " + port)
}

var server = Keystore.listen(port, startupCallback)
```

After you have run that code, it should startup an OIP Keystore server on your selected port.

To close/kill the server programmatically, you can reference the return value of `Keystore.listen(port, startupCallback)` (in the example above, this would be the server variable) and run the `.close()` function to shutdown the server.

```javascript
server.close()
```

## API Methods
There are several API Methods available after you are running the OIP Keystore server. Read through each to understand fully what it does.

### Status

**Description**: Get the current status of the OIP-Keystore server

**URL :** `/`

**Method :** `GET`

**Response:**

 - Success (200):  `{status: "online"}`

### Create

**Description**: Check if a specific Identifier or Email exists on the server

**URL :** `/create`

**Method :** `POST`

**Data Params:** 

- `email` (Optional): The users email that they wish to attach 

```json
{ 
    "email": "email@example.com"
}
```

**Response:**

- Success (200):  

```json
{
    "error": false,
    "identifier": "47cfbad-5f331638-6575c0a-d1d14e3",
    "shared_key": "e712c556495c3918d9ddd0b80ac376ef30b0a55230fb26e3d24d8ef73d2604f712baeb8b4bb2f6e3dd14821c47cd3076",
    "email": "email@example.com"
}
```

- Error (400):

```json
{
    "error": true,
    "type": "ERROR_TYPE",
    "message": "More information about the error"
}
```

### Check Load

**Description**: Check if a specific Identifier or Email exists on the server

**URL :** `/checkload`

**Method :** `POST`

**Data Params:** 

- `identifier`: Should be either the users email, or the identifier generated in `/create`

```javascript
{ 
    "identifier": "email@example.com" || "47cfbad-5f331638-6575c0a-d1d14e3"
}
```

**Response:**

- Success (200):  

```json
{
    "error": false,
    "identifier": "47cfbad-5f331638-6575c0a-d1d14e3",
    "gauth_enabled": false,
    "encryption_settings": {
        "algo": "aes",
        "iterations": 5
    }
}
```

- Error (400):

```json
{
    "error": true,
    "type": "ERROR_TYPE",
    "message": "More information about the error"
}
```

### Load

**Description**: Check if a specific Identifier or Email exists on the server

**URL :** `/load`

**Method :** `POST`

**Data Params:** 

- `identifier`: Should be either the users email, or the identifier generated in `/create`

```javascript
{ 
    "identifier": "email@example.com" || "47cfbad-5f331638-6575c0a-d1d14e3"
}
```

**Response:**

- Success (200):  

```json
{
    "error": false,
    "identifier": "47cfbad-5f331638-6575c0a-d1d14e3",
    "encrypted_data": "encrypted-data-string"
}
  ```

- Error (400):

```json
{
    "error": true,
    "type": "ERROR_TYPE",
    "message": "More information about the error"
}
```

### Update

**Description**: Check if a specific Identifier or Email exists on the server

**URL :** `/update`

**Method :** `POST`

**Data Params:** 

- `identifier`: Should be either the users email, or the identifier generated in `/create`
- `shared_key`: The key generated in `/create` that should be inside the decrypted version of the encrypted_data.
- `encrypted_data`: The Encrypted data you wish to save to the keystore server

```javascript
{ 
    "identifier": "email@example.com" || "47cfbad-5f331638-6575c0a-d1d14e3",
    "shared_key": "e712c556495c3918d9ddd0b80ac376ef30b0a55230fb26e3d24d8ef73d2604f712baeb8b4bb2f6e3dd14821c47cd3076",
    "encrypted_data": "new-encrypted-data-string"
}
```

**Response:**

- Success (200):  

```json
{
    "error": false,
    "identifier": "47cfbad-5f331638-6575c0a-d1d14e3"
}
```

- Error (400):

```json
{
    "error": true,
    "type": "ERROR_TYPE",
    "message": "More information about the error"
}
```

## License
MIT License

Copyright (c) 2018 Open Index Protocol Working Group

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.