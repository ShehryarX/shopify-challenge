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
  mongoURL: "mongodb://<username>:<password>@datacenter.mlab.com:33268/server1_name",
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

To access documentation, perform steps 1 through 4 and visit `http://localhost:5000/api-docs` which was generated through `express-swagger-generator`.

Here's a brief description of the scope of this project:

## Scope

- This is a secure photo storage application for users
- Users can upload one photo at a time
- Users can delete one photo at a time
- Users can get a list of all their photos
- Users can filter the list of their photos by passing in a query parameter

As we can see, there are two classes we can use to model this project:

1. User

```
name: String
email: String
password: String
date: Date
```

- the password will be salted and hashed using `bcrypt` when stored in the database
- the date is a `Date` that will be auto-generated upon account recreation

2. Photo

```
user: User
name: String
url: String
date: Date
```

- the user field represents the User that this photo belongs to
- name is the filename of the uploaded photo
- url is the URL that the photo can be accessed from
- date is an auto-generated `Date` that will be assigned when the photo is uploaded

## User Flow

- Users can register using the `POST /api/users/register` endpoint, which will return a `User` object if successfully registered
- Users can then login using the `POST /api/users/login` endpoint, which will return a `JWT`, which will encode the user ID as well as an expiry timestamp, upon successful login
- Now that the user is logged in, they must pass their `JWT` as a header with key `Authorization` to access all private endpoints; this ensures that users can mutate photos that exist only on their account
- Users can upload a photo by hitting `POST /api/photos` with a photo blob and required metadata, and will get a `Photo` object upon completion; noting that by design, duplicate filenames are not allowed, but would be a one-liner to implement
- Users can delete any photo by hitting `DELETE /api/photos` passing in the photo ID; they will recieve a success message with a 200 code if the photo is successfully deleted
- Users can list all their images by hitting `GET /api/photos`, and this will be sorted by date by default; they can optionally search photos by filename by passing in a query parameter

## Testing

Tests are run using the `mocha` framework, and are stored in `/src/tests/`.

1. `users.test.js`

- Created a reusable class to register, login, and mutate `User` objects
- This class was tested thoroughly to reflect changes on the database

2. `photos.test.js`

- This test file uses the resuable test class in `users.test.js` to upload and delete uploaded photos

## Improvements and Future Prospects

- Node.js is a back-end framework that should be used for fast I/O operations, not uploading photos, since that would block any other requests
  - A better solution to this is to user `Worker`, which is a multithreaded API for situations like these
  - Another solution could be to get the client to upload the photo using a web SDK, and pass the URL to the backend
- Bulk operations
  - To perform bulk operations, namely add or delete, you could call the single deletion API numerous times, or create a similar endpoint but use `Promise.all` to wait for all requests to complete
- Documentation
  - Currently documentation was auto-generated through a third party extension, which enforces their style guide, but also imposes a lot of restrictions
- Deployment
  - I would use Docker to containerize this server with a continuous integration pipeline to ensure maximum uptime
  - I chose not to do this because using a free hosting service like Heroku would be prone to downtime because of their free tier (might be faster to spin it up locally)
