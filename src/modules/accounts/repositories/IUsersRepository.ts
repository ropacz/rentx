import { ICreateUserDTO } from "../../dtos/ICreateUserDTO";
import { User } from "../entities/Users";

interface IUsersRepository {
  create(data: ICreateUserDTO): Promise<void>;
  findByEmail(email: string): Promise<User>;
  findById(id_user: string): Promise<User>;
}

export { IUsersRepository };