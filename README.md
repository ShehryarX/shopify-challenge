# Shopify Internship Challenge

This is my code for the Shopify Winter 2020 Internship interview.

This code requires the following prerequisites to build:

- [Node.js](https://nodejs.org/en/)
- An [mLab](http://mlab.com/) account and database
- A [Cloudinary](https://cloudinary.com) developer account

To run the code, follow these steps:

1. `git clone https://github.com/ShehryarX/shopify-challenge` will copy the code here to your machine
2. `cd src/` will go into the directory where the code is stored
3. `npm i` will install all required dependencies
4. `npm start` will start the server locally!

Before it works, you'll need to specify the authentication required by MongoDB, as well as Passport and Cloudinary.
Create a file `src/config/keys.js` with the following contents:

```
const keys = {
  mongoURL: "mongodb://<username>:<pasword>@datacenter.mlab.com:33268/server_name",
  cloudinaryConfig: {
    apiKey: "XXXXXXXXXXXXXXX",
    apiSecret: "XXXXXXXXXXXXXXXXXXX"
  },
  secretOrKey: "random" // key used for authentication (make it strong!)
};

module.exports = keys;
```

This will begin an instance of the server on `http://localhost:5000/` by default. You can test the endpoint using [Postman](https://www.getpostman.com).

To run tests, run `npm run-script test`, and make sure you're in the `src` directory.

To access documentation, perform steps 1 through 4 and visit `http://localhost:5000/api-docs`.
