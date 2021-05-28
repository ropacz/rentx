import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { AppError } from "@shared/errors/AppError";

import { CreateCarUseCase } from "./CreateCarUseCase";

let createCarUseCase: CreateCarUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;

describe("Create Car", () => {
  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    createCarUseCase = new CreateCarUseCase(carsRepositoryInMemory);
  });

  test("should be able to create a new car", async () => {
    const car = await createCarUseCase.execute({
      name: "Carro novo",
      description: "description car",
      daily_rate: 100,
      license_plate: "ABC-1234",
      fine_amount: 60,
      brand: "Volkswagen",
      category_id: "category",
    });

    expect(car).toHaveProperty("id");
  });

  test("should not be able to a car with exists license plate", async () => {
    await createCarUseCase.execute({
      name: "Carro novo",
      description: "description car",
      daily_rate: 100,
      license_plate: "ABC-1234",
      fine_amount: 60,
      brand: "Volkswagen",
      category_id: "category",
    });

    const response = createCarUseCase.execute({
      name: "Outro carro",
      description: "description car",
      daily_rate: 100,
      license_plate: "ABC-1234",
      fine_amount: 60,
      brand: "Volkswagen",
      category_id: "category",
    });

    await expect(response).rejects.toBeInstanceOf(AppError);
    await expect(response).rejects.toMatchObject({
      message: "Car already exists!",
    });
  });

  test("should be able to create a car with available true by default", async () => {
    const car = await createCarUseCase.execute({
      name: "Carro novo",
      description: "description car",
      daily_rate: 100,
      license_plate: "ABC-1234",
      fine_amount: 60,
      brand: "Volkswagen",
      category_id: "category",
    });

    expect(car.available).toBeTruthy();
  });
});
