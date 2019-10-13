const request = require("supertest");
const expect = require("chai").expect;

const server = require("../server");
const { User } = require("../models/User");

class MockUser {
  createUser() {
    // sets current hash
    this.hash = Math.random() * 1000000;

    // sets current user
    this.user = new User({
      name: "Test user",
      email: `testuser${this.hash}@test.com`,
      password: "Random hash"
    });
  }

  loginUser() {
    return request(server)
      .post("/api/users/login")
      .send(this.user);
  }

  insertToDb() {
    // insert user in db
    return request(server)
      .post("/api/users/register")
      .send(this.user);
  }

  async getToken() {
    const response = await this.loginUser();
    return response.body.token;
  }

  deleteFromDb() {
    return User.findByIdAndDelete(this.id);
  }
}

describe("MockUser", () => {
  describe("register, login, and current", () => {
    it("register user", async () => {
      mockUser = new MockUser();

      mockUser.createUser();

      let foundUser = await User.find({ email: mockUser.email });
      expect(foundUser.length == 0);

      // insert into database
      await mockUser.insertToDb();

      // should only store one in database
      foundUser = await User.find({ email: mockUser.email });
      expect(foundUser.length == 1);

      // login the user
      const response = await mockUser.loginUser();

      // extract jwt response
      const { success, token } = response.body;

      // expect auth to be valid and jwt to be defined and > 0
      expect(success).to.be.true;
      expect(token).length.to.be.gt(0);

      // delete user
      mockUser.deleteFromDb();

      // make sure it's deleted
      foundUser = await User.find({ email: mockUser.email });
      expect(foundUser.length == 0);
    });
  });
});

module.exports = {
  MockUser
};
