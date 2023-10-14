const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect;
const app = require("../server");
chai.use(chaiHttp);

let tokenAdmin = "";
let tokenUser = "";
describe("API ENDPOINT TESTING", async () => {
  await getData();
  await postData();
  await loginAdmin();
  await loginUser();
  await postAttack();
  await getAttack();
});

async function getData() {
  it("GET Data", (done) => {
    chai
      .request(app)
      .get("/data")
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        expect(res.body).to.have.property("statusCode");
        expect(res.body).to.have.property("success");
        expect(res.body).to.have.property("message");
        expect(res.body).to.have.property("data");

        expect(res.body.statusCode).to.have.an("number");
        expect(res.body.success).to.have.an("boolean");
        expect(res.body.message).to.have.an("string");
        expect(res.body.data).to.have.an("array");

        done();
      });
  });
}

async function postData() {
  it("POST Data", (done) => {
    let dataSample = {
      userId: 2,
      values: "[80, 80, 80, 80, 80]",
    };
    chai
      .request(app)
      .post("/data")
      .set("Content-Type", "application/x-www-form-urlencoded")
      .send(dataSample)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(201);
        expect(res.body).to.be.an("object");
        expect(res.body).to.have.property("statusCode");
        expect(res.body).to.have.property("success");
        expect(res.body).to.have.property("message");
        expect(res.body).to.have.property("data");

        expect(res.body.statusCode).to.have.an("number");
        expect(res.body.success).to.have.an("boolean");
        expect(res.body.message).to.have.an("string");
        expect(res.body.data).to.have.an("null");

        done();
      });
  });
}

async function loginAdmin() {
  it("POST Login Admin", (done) => {
    let dataSample = {
      role: "1",
    };
    chai
      .request(app)
      .post("/login")
      .set("Content-Type", "application/x-www-form-urlencoded")
      .send(dataSample)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        expect(res.body).to.have.property("statusCode");
        expect(res.body).to.have.property("success");
        expect(res.body).to.have.property("data");

        expect(res.body.statusCode).to.have.an("number");
        expect(res.body.success).to.have.an("boolean");
        expect(res.body.data).to.have.an("string");
        tokenAdmin = res.body.data;
        done();
      });
  });
}
async function loginUser() {
  it("POST Login User", (done) => {
    let dataSample = {
      role: "0",
    };
    chai
      .request(app)
      .post("/login")
      .set("Content-Type", "application/x-www-form-urlencoded")
      .send(dataSample)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        expect(res.body).to.have.property("statusCode");
        expect(res.body).to.have.property("success");
        expect(res.body).to.have.property("data");

        expect(res.body.statusCode).to.have.an("number");
        expect(res.body.success).to.have.an("boolean");
        expect(res.body.data).to.have.an("string");
        tokenUser = res.body.data;
        done();
      });
  });
}

async function postAttack() {
  it("POST Data", (done) => {
    chai
      .request(app)
      .post("/attack")
      .set("Authorization", tokenUser)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(201);
        expect(res.body).to.be.an("object");
        expect(res.body).to.have.property("statusCode");
        expect(res.body).to.have.property("success");
        expect(res.body).to.have.property("message");
        expect(res.body).to.have.property("data");

        expect(res.body.statusCode).to.have.an("number");
        expect(res.body.success).to.have.an("boolean");
        expect(res.body.message).to.have.an("string");
        expect(res.body.data).to.have.an("array");

        done();
      });
  });
}

async function getAttack() {
  it("GET Attack", (done) => {
    chai
      .request(app)
      .get("/attack")
      .set("Authorization", tokenAdmin)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        expect(res.body).to.have.property("statusCode");
        expect(res.body).to.have.property("success");
        expect(res.body).to.have.property("data");

        expect(res.body.statusCode).to.have.an("number");
        expect(res.body.success).to.have.an("boolean");
        expect(res.body.data).to.have.an("object");

        expect(res.body.data).to.have.all.keys("label", "total");

        done();
      });
  });

  it("GET Attack", (done) => {
    chai
      .request(app)
      .get("/attack")
      .set("Authorization", tokenUser)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(401);
        expect(res.body).to.be.an("object");
        expect(res.body).to.have.property("statusCode");
        expect(res.body).to.have.property("success");
        expect(res.body).to.have.property("data");

        expect(res.body.statusCode).to.have.an("number");
        expect(res.body.success).to.have.an("boolean");
        expect(res.body.data).to.have.an("null");

        done();
      });
  });
}
