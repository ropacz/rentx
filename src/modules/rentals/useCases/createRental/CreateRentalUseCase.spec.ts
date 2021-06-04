import dayjs from "dayjs";

import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { CreateCarUseCase } from "@modules/cars/useCases/createCar/CreateCarUseCase";
import { RentalsRepositoryInMemory } from "@modules/rentals/repositories/in-memory/RentalsRepositoryInMemory";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { AppError } from "@shared/errors/AppError";

import { CreateRentalUseCase } from "./CreateRentalUseCase";

let createRentalUseCase: CreateRentalUseCase;
let createCarUseCase: CreateCarUseCase;
let dayjsDateProvider: DayjsDateProvider;
let rentalsRepositoryInMemory: RentalsRepositoryInMemory;
let carsRepositoryInMemory: CarsRepositoryInMemory;

describe("Create Rental", () => {
  const dayAdd24Hours = dayjs().add(1, "day").toDate();

  beforeEach(() => {
    rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
    dayjsDateProvider = new DayjsDateProvider();
    carsRepositoryInMemory = new CarsRepositoryInMemory();

    createCarUseCase = new CreateCarUseCase(carsRepositoryInMemory);

    createRentalUseCase = new CreateRentalUseCase(
      rentalsRepositoryInMemory,
      dayjsDateProvider,
      carsRepositoryInMemory
    );
  });

  test("should be able to create a new rental", async () => {
    const car = await createCarUseCase.execute({
      name: "New Car",
      description: "description car",
      daily_rate: 100,
      license_plate: "ABC-1234",
      fine_amount: 60,
      brand: "Volkswagen",
      category_id: "category",
    });

    const rental = await createRentalUseCase.execute({
      user_id: "1234",
      car_id: car.id,
      expected_return_date: dayAdd24Hours,
    });

    expect(rental).toHaveProperty("id");
    expect(rental).toHaveProperty("start_date");
  });

  test("should not be able to create a new rental if there is another open to the same user", async () => {
    const car = await createCarUseCase.execute({
      name: "New Car",
      description: "description car",
      daily_rate: 100,
      license_plate: "ABC-1234",
      fine_amount: 60,
      brand: "Volkswagen",
      category_id: "category",
    });

    await createRentalUseCase.execute({
      user_id: "1234",
      car_id: car.id,
      expected_return_date: dayAdd24Hours,
    });

    const response = createRentalUseCase.execute({
      user_id: "1234",
      car_id: "0000",
      expected_return_date: dayAdd24Hours,
    });

    await expect(response).rejects.toBeInstanceOf(AppError);
    await expect(response).rejects.toMatchObject({
      message: "There's a rental in progress for user!",
    });
  });

  test("should not be able to create a new rental if there is another open to the same car", async () => {
    const car = await createCarUseCase.execute({
      name: "New Car",
      description: "description car",
      daily_rate: 100,
      license_plate: "ABC-1234",
      fine_amount: 60,
      brand: "Volkswagen",
      category_id: "category",
    });

    await createRentalUseCase.execute({
      user_id: "1234",
      car_id: car.id,
      expected_return_date: dayAdd24Hours,
    });

    const response = createRentalUseCase.execute({
      user_id: "0000",
      car_id: car.id,
      expected_return_date: dayAdd24Hours,
    });

    await expect(response).rejects.toBeInstanceOf(AppError);
    await expect(response).rejects.toMatchObject({
      message: "Car is unavailable",
    });
  });

  test("should not be able to create a new rental with invalid return time", async () => {
    const response = createRentalUseCase.execute({
      user_id: "1234",
      car_id: "4321",
      expected_return_date: dayjs().toDate(),
    });

    await expect(response).rejects.toBeInstanceOf(AppError);
    await expect(response).rejects.toMatchObject({
      message: "Invalid return time!",
    });
  });
});
