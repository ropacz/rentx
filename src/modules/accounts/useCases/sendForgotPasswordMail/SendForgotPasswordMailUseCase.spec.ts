import { UsersRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersRepositoryInMemory";
import { UsersTokensRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersTokensRepositoryInMemory";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { MailProviderInMemory } from "@shared/container/providers/MailProvider/in-memory/MailProviderInMemory";
import { AppError } from "@shared/errors/AppError";

import { SendForgotPasswordMailUseCase } from "./SendForgotPasswordMailUseCase";

let sendForgotPasswordMailUseCase: SendForgotPasswordMailUseCase;
let usersRepositoryInMemory: UsersRepositoryInMemory;
let dayjsDateProvider: DayjsDateProvider;
let usersTokensRepositoryInMemory: UsersTokensRepositoryInMemory;
let mailProviderInMemory: MailProviderInMemory;

describe("Send Forgot Mail", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    dayjsDateProvider = new DayjsDateProvider();
    usersTokensRepositoryInMemory = new UsersTokensRepositoryInMemory();
    mailProviderInMemory = new MailProviderInMemory();

    sendForgotPasswordMailUseCase = new SendForgotPasswordMailUseCase(
      usersRepositoryInMemory,
      usersTokensRepositoryInMemory,
      dayjsDateProvider,
      mailProviderInMemory
    );
  });

  test("should be able to send a forgot password mail to user", async () => {
    const sendMail = spyOn(mailProviderInMemory, "sendMail");

    await usersRepositoryInMemory.create({
      driver_license: "45454",
      email: "any@gmail.com",
      name: "Rodrigo",
      password: "1234",
    });

    await sendForgotPasswordMailUseCase.execute("any@gmail.com");

    expect(sendMail).toBeCalled();
  });

  test("should be able to send an email if user does not exists", async () => {
    const sendMail = sendForgotPasswordMailUseCase.execute("any123@gmail.com");

    await expect(sendMail).rejects.toEqual(
      new AppError("User does not exists")
    );
  });

  test("should be able to create an users token", async () => {
    const createToken = spyOn(usersTokensRepositoryInMemory, "create");

    await usersRepositoryInMemory.create({
      driver_license: "4548",
      email: "outher@gmail.com",
      name: "Rodrigo",
      password: "1234",
    });

    await sendForgotPasswordMailUseCase.execute("outher@gmail.com");

    expect(createToken).toBeCalled();
  });
});
