import { User } from "@modules/accounts/infra/typeorm/entities/Users";
import { ICreateUserDTO } from "@modules/dtos/ICreateUserDTO";

import { IUsersRepository } from "../IUsersRepository";

class UsersRepositoryInMemory implements IUsersRepository {
  users: User[] = [];

  async create({
    driver_license,
    email,
    name,
    password,
  }: ICreateUserDTO): Promise<void> {
    const user = new User();

    Object.assign(user, {
      driver_license,
      email,
      name,
      password,
    });

    this.users.push(user);
  }

  async findByEmail(email: string): Promise<User> {
    const user = this.users.find((user) => user.email === email);

    return user;
  }
  async findById(id_user: string): Promise<User> {
    const user = this.users.find((user) => user.id === id_user);

    return user;
  }
}

export { UsersRepositoryInMemory };
