const request = require("supertest");
const app = require("../app");

// "0": "GET    /",
it("GET / should return JSON objects of all end points", async () => {
  const { body } = await request(app).get("/");

  expect(body).toEqual({
    "0": "GET /users",
    "1": "POST /users/create",
    "2": "POST /users/login",
    "3": "POST /users/logout",
  });
});
