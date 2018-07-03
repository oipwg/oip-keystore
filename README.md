# OIP-Keystore

OIP-Keystore is a simple encrypted keystore server. By sharing a "shared_key" it will update the stored encrypted data.

## Table of Contents

- [Installation Instructions]()
- [Getting Started]()
  - [Running an OIP-Keystore server]()
  - [Running on a different port]()
- [API Methods]()
  - [Status]()
  - [Create]()
  - [Checkload]()
  - [Load]()
  - [Update]()
- [License]()

## Installation Instructions

To install on your server, clone this repo into a local folder.

```bash
$ git clone https://github.com/oipwg/oip-keystore.git
```

After you have cloned it, `cd` into the directory you installed it into and run

```bash
$ npm install
```

After the `npm install` finishes, you can continue onto the [Getting Started]() section.

## Getting Started

### Running an OIP-Keystore server

To run your keystore server, `cd` into the directory you cloned it, and then start it using the following command.

```bash
$ node src/index.js
```

After you run that command you should see it print out that it is running the server

```
Listening on http://127.0.0.1:9196
```

### Running on a different port

To run the OIP-Keystore server on a different port, edit the `config.js` file inside of your cloned `oip-keystore` folder.

## API Methods

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
    email: "email@example.com"
}
```

**Response:**

- Success (200):  

- ```json
  {
      error: false,
      identifier: "47cfbad-5f331638-6575c0a-d1d14e3",
      shared_key: "e712c556495c3918d9ddd0b80ac376ef30b0a55230fb26e3d24d8ef73d2604f712baeb8b4bb2f6e3dd14821c47cd3076",
      email: "email@example.com"
  }
  ```

- Error (400):

  ```json
  {
      error: true,
      type: "ERROR_TYPE",
      message: "More information about the error"
  }
  ```

### Check Load

**Description**: Check if a specific Identifier or Email exists on the server
**URL :** `/checkload`
**Method :** `POST`

**Data Params:** 

- `identifier`: Should be either the users email, or the identifier generated in `/create`

```json
{ 
    identifier: "email@example.com" || "47cfbad-5f331638-6575c0a-d1d14e3"
}
```

**Response:**

- Success (200):  

- ```json
  {
      error: false,
      identifier: "47cfbad-5f331638-6575c0a-d1d14e3",
      gauth_enabled: false,
      encryption_settings: {
          algo: "aes",
          iterations: 5
      }
  }
  ```

- Error (400):

  ```json
  {
      error: true,
      type: "ERROR_TYPE",
      message: "More information about the error"
  }
  ```

### Load

**Description**: Check if a specific Identifier or Email exists on the server
**URL :** `/load`
**Method :** `POST`

**Data Params:** 

- `identifier`: Should be either the users email, or the identifier generated in `/create`

```json
{ 
    identifier: "email@example.com" || "47cfbad-5f331638-6575c0a-d1d14e3"
}
```

**Response:**

- Success (200):  

- ```json
  {
      error: false,
      identifier: "47cfbad-5f331638-6575c0a-d1d14e3",
      encrypted_data: "encrypted-data-string"
  }
  ```

- Error (400):

  ```json
  {
      error: true,
      type: "ERROR_TYPE",
      message: "More information about the error"
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

  ```json
  { 
      identifier: "email@example.com" || "47cfbad-5f331638-6575c0a-d1d14e3",
      shared_key: "e712c556495c3918d9ddd0b80ac376ef30b0a55230fb26e3d24d8ef73d2604f712baeb8b4bb2f6e3dd14821c47cd3076",
      encrypted_data: "new-encrypted-data-string"
  }
  ```

  **Response:**

  - Success (200):  

  - ```json
    {
        error: false,
        identifier: "47cfbad-5f331638-6575c0a-d1d14e3"
    }
    ```

  - Error (400):

    ```json
    {
        error: true,
        type: "ERROR_TYPE",
        message: "More information about the error"
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