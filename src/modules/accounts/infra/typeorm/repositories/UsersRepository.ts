import { getRepository, Repository } from "typeorm";

import { User } from "@modules/accounts/infra/typeorm/entities/Users";
import { ICreateUserDTO } from "@modules/accounts/dtos/ICreateUserDTO";

import { IUsersRepository } from "../../../repositories/IUsersRepository";

class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async create({
    name,
    email,
    password,
    driver_license,
    id,
    avatar,
  }: ICreateUserDTO): Promise<void> {
    const user = this.repository.create({
      name,
      email,
      password,
      driver_license,
      id,
      avatar,
    });

    await this.repository.save(user);
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.repository.findOne({ email });

    return user;
  }

  async findById(id_user: string): Promise<User> {
    const user = await this.repository.findOne({ id: id_user });

    return user;
  }
}

export { UsersRepository };
