import { hash } from "bcrypt";
import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { v4 as uuid } from "uuid";

import { app } from "@shared/infra/http/app";

let connection: Connection;
describe("Create Category Controller", async () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const password = await hash("admin", 8);

    await connection.query(
      `INSERT INTO USERS(id, name, email, password, "isAdmin", created_at, driver_license ) 
				values('${uuid}', 'admin', 'admin@rentx.com.br', '${password}', true, 'now()', 'XXXXXX')
			`
    );
  });

  afterAll(async () => {
    await connection.close();
  });

  test("should be able to create a new category", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "admin@rentx.com.br",
      password: "admin",
    });

    const response = await request(app).post("/categories").send({
      name: "Category Test",
      description: "Same description",
    });

    expect(response.status).toBe(201);
  });
});
