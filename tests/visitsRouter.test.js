const visitModel = require("../models/visit.model");
const visitData = require("../tests/testVisitData");
const request = require("supertest");
const app = require("../app");
const { teardownMongoose } = require("../utils/mongoose");
jest.mock("jsonwebtoken");

describe("visits.route", () => {
  afterAll(async () => await teardownMongoose());

  beforeEach(async () => {
    await visitModel.create(visitData);
  });

  afterEach(async () => {
    jest.resetAllMocks();
    await visitModel.deleteMany();
  });

  describe("/visits", () => {
    // 1. test for getting all visits
    it("GET / should return with all 'visits'", async () => {
      //simulate login using 'user 1'
      const jwt = require("jsonwebtoken");
      const loginUser = {
        username: "user 1",
      };
      jwt.verify.mockReturnValueOnce({ username: loginUser.username });

      const response = await request(app).get("/");

      expect(response.status).toEqual(200);
    });

    // 2. test for registering a new visit
    it("POST should return new visit", async () => {
      //simulate login using 'user 1'
      const jwt = require("jsonwebtoken");
      const loginUser = {
        username: "user 1",
      };
      jwt.verify.mockReturnValueOnce({ username: loginUser.username });

      const expectedVisit = {
        visitDateTime: new Date("2020-01-05T06:23:54.671Z"),
        nric: "nric3",
        contactNo: 33333,
      };

      const { body: actualUser } = await request(app)
        .post("/visits/register")
        .send(expectedVisit)
        .set("Cookie", "token=valid-token")
        .expect(201);

      expect(actualUser.visitDateTime).toBe(
        expectedVisit.visitDateTime.toISOString()
      );
      expect(actualUser.nric).toBe(expectedVisit.nric);
      expect(actualUser.contactNo).toBe(expectedVisit.contactNo);
    });

    // 3. test for contact tracing
    it("GET should return contact trace visits", async () => {
      //simulate login using 'user 1'
      const jwt = require("jsonwebtoken");
      const loginUser = {
        username: "user 1",
      };
      jwt.verify.mockReturnValueOnce({ username: loginUser.username });

      const expectedVisits = [
        {
          visitDateTime: new Date(
            "2020-05-05T06:32:54.671+00:00"
          ).toISOString(),
          nric: "nric3",
          contactNo: 33333,
        },
        {
          visitDateTime: new Date(
            "2020-05-05T06:33:54.671+00:00"
          ).toISOString(),
          nric: "nric4",
          contactNo: 44444,
        },
        {
          visitDateTime: new Date(
            "2020-05-05T06:34:54.671+00:00"
          ).toISOString(),
          nric: "nric5",
          contactNo: 55555,
        },
        {
          visitDateTime: new Date(
            "2020-05-05T06:35:54.671+00:00"
          ).toISOString(),
          nric: "nric6",
          contactNo: 66666,
        },
      ];

      const { body: actualVisits } = await request(app)
        .get("/visits/nric/nric4/trace?contactTraceDate=2020-05-05")
        .send(expectedVisits)
        .set("Cookie", "token=valid-token")
        .expect(200);

      expect(actualVisits).toMatchObject(expectedVisits);
    });
  });
});
