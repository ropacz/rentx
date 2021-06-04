import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { SpecificationsRepositoryInMemory } from "@modules/cars/repositories/in-memory/SpecificationsRepositoryInMemory";
import { AppError } from "@shared/errors/AppError";

import { CreateCarSpecificationUseCase } from "./CreateCarSpecificationUseCase";

let createCarSpecificationUseCase: CreateCarSpecificationUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;
let specificationsRepositoryInMemory: SpecificationsRepositoryInMemory;

describe("Create Car Specification", () => {
  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    specificationsRepositoryInMemory = new SpecificationsRepositoryInMemory();
    createCarSpecificationUseCase = new CreateCarSpecificationUseCase(
      carsRepositoryInMemory,
      specificationsRepositoryInMemory
    );
  });

  test("should be able to add a new specification to the car", async () => {
    const car = await carsRepositoryInMemory.create({
      name: "Carro novo",
      description: "description car",
      daily_rate: 100,
      license_plate: "ABC-1234",
      fine_amount: 60,
      brand: "Volkswagen",
      category_id: "category",
    });

    const specification = await specificationsRepositoryInMemory.create({
      description: "description test",
      name: "test",
    });

    const specifications_id = [specification.id];

    const specificationsCars = await createCarSpecificationUseCase.execute({
      car_id: car.id,
      specifications_id,
    });

    expect(specificationsCars).toHaveProperty("specifications");
    expect(specificationsCars.specifications).toHaveLength(1);
  });

  test("should not be able to add a new specification to a now-existent car", async () => {
    const car_id = "123";
    const specifications_id = ["543"];

    const response = createCarSpecificationUseCase.execute({
      car_id,
      specifications_id,
    });

    await expect(response).rejects.toBeInstanceOf(AppError);
    await expect(response).rejects.toMatchObject({
      message: "Car does not exists!",
    });
  });
});
