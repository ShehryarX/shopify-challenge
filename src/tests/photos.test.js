const request = require("supertest");
const expect = require("chai").expect;

const server = require("../server");
const { MockUser } = require("./users.test");

describe("Photo", () => {
  describe("endpoints", () => {
    it("photos list is empty for new users", async () => {
      const mockUser = new MockUser();
      mockUser.createUser();

      // put into database
      await mockUser.insertToDb();

      const token = await mockUser.getToken();

      // list all photos for user
      const photosReponse = await request(server)
        .get("/api/photos/")
        .set("Authorization", token);

      expect(photosReponse.body.length === 0);

      // wipe from db
      await mockUser.deleteFromDb();
    });

    it("upload a photo", async () => {
      const mockUser = new MockUser();
      mockUser.createUser();

      // put into database
      await mockUser.insertToDb();

      // get token
      const token = await mockUser.getToken();

      // upload photo
      const onePhotoResponse = await request(server)
        .post("/api/photos/")
        .set("Authorization", token)
        .field("name", "temp.jpg")
        .attach(
          "file",
          "/Users/sassad/workplace/photo-gallery/server/tests/mockPhotos/temp.jpg"
        );

      expect(onePhotoResponse.body.length === 1);

      const photoId = onePhotoResponse.body._id;

      // delete photo
      const deletePhotoResponse = await request(server)
        .delete("/api/photos/")
        .set("Authorization", token)
        .send({ id: photoId });

      expect(deletePhotoResponse.body.length === 0);

      // wipe from db
      await mockUser.deleteFromDb();
    });
  });
});
