import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";

import { ListAvailableCarsUseCase } from "./ListAvailableCarsUseCase";

let carsRepositoryInMemory: CarsRepositoryInMemory;
let listAvailableCarsUseCase: ListAvailableCarsUseCase;

describe("List Cars", () => {
  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    listAvailableCarsUseCase = new ListAvailableCarsUseCase(
      carsRepositoryInMemory
    );
  });
  test("should be able to list all available cars", async () => {
    const car = await carsRepositoryInMemory.create({
      name: "Audi A1",
      brand: "Audi",
      category_id: "category_id",
      daily_rate: 110.0,
      description: "Carro novo",
      fine_amount: 40,
      license_plate: "DEF-1234",
    });

    const cars = await listAvailableCarsUseCase.execute();
    expect(cars).toEqual([car]);
  });

  test("should be able to list all available cars by name", async () => {
    const car = await carsRepositoryInMemory.create({
      name: "Audi A1",
      brand: "Audi",
      category_id: "category_id",
      daily_rate: 110.0,
      description: "Carro novo",
      fine_amount: 40,
      license_plate: "DEF-1234",
    });

    const cars = await listAvailableCarsUseCase.execute({
      name: "Audi A1",
    });

    expect(cars).toEqual([car]);
  });

  test("should be able to list all available cars by brand", async () => {
    const car = await carsRepositoryInMemory.create({
      name: "Audi A1",
      brand: "Audi",
      category_id: "category_id",
      daily_rate: 110.0,
      description: "Carro novo",
      fine_amount: 40,
      license_plate: "DEF-1234",
    });

    const cars = await listAvailableCarsUseCase.execute({
      brand: "Audi",
    });

    expect(cars).toEqual([car]);
  });

  test("should be able to list all available cars by category", async () => {
    const car = await carsRepositoryInMemory.create({
      name: "Audi A1",
      brand: "Audi",
      category_id: "12345",
      daily_rate: 110.0,
      description: "Carro novo",
      fine_amount: 40,
      license_plate: "DEF-1234",
    });

    const cars = await listAvailableCarsUseCase.execute({
      category_id: "12345",
    });

    expect(cars).toEqual([car]);
  });
});
