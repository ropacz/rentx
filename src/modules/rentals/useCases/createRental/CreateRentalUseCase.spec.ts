import dayjs from "dayjs";

import { RentalsRepositoryInMemory } from "@modules/rentals/repositories/in-memory/RentalsRepositoryInMemory";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { AppError } from "@shared/errors/AppError";

import { CreateRentalUseCase } from "./CreateRentalUseCase";

let createRentalUseCase: CreateRentalUseCase;
let rentalsRepositoryInMemory: RentalsRepositoryInMemory;
let dayjsDateProvider: DayjsDateProvider;

describe("Create Rental", () => {
  const dayAdd24Hours = dayjs().add(1, "day").toDate();

  beforeEach(() => {
    rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
    dayjsDateProvider = new DayjsDateProvider();
    createRentalUseCase = new CreateRentalUseCase(
      rentalsRepositoryInMemory,
      dayjsDateProvider
    );
  });

  test("should be able to create a new rental", async () => {
    const rental = await createRentalUseCase.execute({
      user_id: "1234",
      car_id: "4321",
      expected_return_date: dayAdd24Hours,
    });

    expect(rental).toHaveProperty("id");
    expect(rental).toHaveProperty("start_date");
  });

  test("should not be able to create a new rental if there is another open to the same user", async () => {
    await createRentalUseCase.execute({
      user_id: "1234",
      car_id: "4321",
      expected_return_date: dayAdd24Hours,
    });

    const response = createRentalUseCase.execute({
      user_id: "1234",
      car_id: "0000",
      expected_return_date: dayAdd24Hours,
    });

    await expect(response).rejects.toBeInstanceOf(AppError);
  });

  test("should not be able to create a new rental if there is another open to the same car", async () => {
    await createRentalUseCase.execute({
      user_id: "1234",
      car_id: "4321",
      expected_return_date: dayAdd24Hours,
    });

    const response = createRentalUseCase.execute({
      user_id: "0000",
      car_id: "4321",
      expected_return_date: dayAdd24Hours,
    });

    await expect(response).rejects.toBeInstanceOf(AppError);
  });

  test("should not be able to create a new rental with invalid return time", async () => {
    const response = createRentalUseCase.execute({
      user_id: "1234",
      car_id: "4321",
      expected_return_date: dayjs().toDate(),
    });

    await expect(response).rejects.toBeInstanceOf(AppError);
  });
});
