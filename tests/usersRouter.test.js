const UserModel = require("../models/user.model");
const userData = require("../tests/testUserData");
const request = require("supertest");
const app = require("../app");
const { teardownMongoose } = require("../utils/mongoose");
jest.mock("jsonwebtoken");

describe("users.route", () => {
  afterAll(async () => await teardownMongoose());

  beforeEach(async () => {
    await UserModel.create(userData);
  });

  afterEach(async () => {
    jest.resetAllMocks();
    await UserModel.deleteMany();
  });

  describe("/users", () => {
    // 1. test for getting all users
    it("GET / should return with all 'users'", async () => {
      const response = await request(app).get("/");

      expect(response.status).toEqual(200);
    });

    // 2. test for creating a new user
    it("POST should return new user", async () => {
      const expectedUser = {
        username: "user 3",
        password: "password 3",
        userType: "USER",
      };

      const { body: actualUser } = await request(app)
        .post("/users/create")
        .send(expectedUser)
        .expect(201);

      expect(actualUser.username).toBe(expectedUser.username);
      expect(actualUser.password).not.toBe(expectedUser.password);
      expect(actualUser.userType).toBe(expectedUser.userType);
    });

    /*
  // 2. test for searching for existing user
  it("GET /user/:username should return user details when login as correct user", async () => {
    const jwt = require("jsonwebtoken");

    const expectedUser = {
      username: "user 2",
    };

    //simulate login using 'user 2'
    jwt.verify.mockReturnValueOnce({ username: expectedUser.username });

    const { body: actualUser } = await request(app)
      .get(`/user/${expectedUser.username}`)
      .set("Cookie", "token=valid-token")
      .expect(200);

    expect(jwt.verify).toHaveBeenCalledTimes(1);
    expect(actualUser).toMatchObject(expectedUser);
  });

  // 3. test for 403 Forbidden
  it("GET /user/:username should return 403 Forbidden", async () => {
    const jwt = require("jsonwebtoken");

    const loginUser = {
      username: "user 1",
    };

    const expectedUser = {
      username: "user 2",
    };

    //simulate login using 'user 1'
    jwt.verify.mockReturnValueOnce({ username: loginUser.username });

    //searching for 'user 2' and should throw 403 error
    const response = await request(app)
      .get(`/user/${expectedUser.username}`)
      .set("Cookie", "token=valid-token")
      .expect(403);
  });


  // 4. test for denying of access when no token is provided
  it("GET /user/:username should return 401 Unauthorized, when no token is provided", async () => {
    const jwt = require("jsonwebtoken");

    const loginUser = {
      username: "user 1",
    };

    const expectedUser = {
      username: "user 2",
    };

    //simulate login using 'user 1'
    jwt.verify.mockReturnValueOnce({ username: loginUser.username });

    //searching for 'user 2' and should throw 401 error, when no cookie
    const response = await request(app)
      .get(`/user/${expectedUser.username}`)
      //.set("Cookie", "token=valid-token")
      .expect(401);
  });

  // 5. test for denying of access when token is 'invalid''
  it("GET /user/:username should return 401 Unauthorized, when token is invalid", async () => {
    const jwt = require("jsonwebtoken");

    const loginUser = {
      username: "user 1",
    };

    const expectedUser = {
      username: "user 2",
    };

    jwt.verify.mockImplementationOnce(() => {
      throw new Error();
    });

    //searching for 'user 2' and should throw 401 error, when invalid token
    const response = await request(app)
      .get(`/user/${expectedUser.username}`)
      .set("Cookie", "token=invalid-token")
      .expect(401);
  });
  */

    // 6. test for login
    it("POST /users/login should login user", async () => {
      const loginUser = {
        username: userData[0].username,
        password: userData[0].password,
      };

      const response = await request(app)
        .post("/users/login")
        .send(loginUser)
        .expect(200);

      expect(response.statusCode).toBe(200);
    });

    // 7. test for incorrect password login
    it("POST /users/login return 400 error", async () => {
      const loginUser = {
        username: userData[0].username,
        password: "wrong password",
      };

      const response = await request(app)
        .post("/users/login")
        .send(loginUser)
        .expect(400);

      expect(response.text).toBe("Login failed");
    });

    // 8. test for logout
    it("POST /users/logout should logout user", async () => {
      const response = await request(app).post("/users/logout").expect(200);

      expect(response.text).toBe("You are now logged out!");
    });
  });
});
