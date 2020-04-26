const request = require("supertest");
const app = require("../src/app");
const { userOne, userOneId, setupDatabase } = require("./fixtures/db");
const User = require("../src/models/user");

beforeEach(setupDatabase);

test("Should create new user", async () => {
  const response = await request(app)
    .post("/users")
    .send({
      name: "Hardik",
      email: "hardik@example.com",
      password: "hardik@123",
    })
    .expect(201);

  //Asserting that database was changed correctly
  const user = await User.findById(response.body.user._id);
  expect(user).not.toBeNull();

  //Asserting that the response received is correct
  expect(response.body).toMatchObject({
    user: { name: "Hardik", email: "hardik@example.com" },
    token: user.tokens[0].token,
  });

  expect(user.password).not.toBe("hardik@123");
});

test("Should login existing user", async () => {
  const response = await request(app)
    .post("/users/login")
    .send({
      email: userOne.email,
      password: userOne.password,
    })
    .expect(200);
  const user = await User.findById(response.body.user._id);
  expect(user.tokens[1].token).toBe(response.body.token);
});

test("Should not login non existent user", async () => {
  await request(app)
    .post("/users/login")
    .send({
      email: userOne.email,
      password: "dummy@123",
    })
    .expect(400);
});

test("Should get profile of given user", async () => {
  await request(app)
    .get("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test("Should not get profile for unauthenticated user", async () => {
  await request(app).get("/users/me").send().expect(401);
});

test("Should delete profile for authenticated user", async () => {
  await request(app)
    .delete("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
  const user = await User.findById(userOneId);
  expect(user).toBeNull();
});

test("Should not delete profile for unauthenticated user", async () => {
  await request(app).delete("/users/me").send().expect(401);
});

test("Should upload avatar for authenticated user", async () => {
  await request(app)
    .post("/users/me/avatar")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .attach("avatar", "tests/fixtures/profile-pic.jpg")
    .expect(200);
});

test("Should update fields for authenticatred user", async () => {
  await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({ name: "Jerry" })
    .expect(200);
  const user = await User.findById(userOneId);
  expect(user.name).toBe("Jerry");
});

test("Should not update inapplicable fields", async () => {
  await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({ location: "Italy" })
    .expect(400);
});
