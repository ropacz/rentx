import { CategoriesRepositoryInMemory } from "@modules/cars/repositories/in-memory/CategoriesRepositoryInMemory";
import { AppError } from "@shared/errors/AppError";

import { CreateCategoryUseCase } from "./CreateCategoryUseCase";

let createCategoryUseCase: CreateCategoryUseCase;
let categoriesRepositoryInMeory: CategoriesRepositoryInMemory;

describe("Create Category", () => {
  beforeEach(() => {
    categoriesRepositoryInMeory = new CategoriesRepositoryInMemory();
    createCategoryUseCase = new CreateCategoryUseCase(
      categoriesRepositoryInMeory
    );
  });

  test("should be able to create a new category ", async () => {
    const category = {
      name: "Category test",
      description: "description test",
    };
    await createCategoryUseCase.execute(category);

    const categoryCreated = await categoriesRepositoryInMeory.findByName(
      category.name
    );

    expect(categoryCreated).toHaveProperty("id");
  });

  test("should not be able to create a new category with name exists", async () => {
    const category = {
      name: "Category test",
      description: "description test",
    };
    await createCategoryUseCase.execute(category);

    const categoryAlreadyExists = createCategoryUseCase.execute(category);

    await expect(categoryAlreadyExists).rejects.toBeInstanceOf(AppError);
    await expect(categoryAlreadyExists).rejects.toMatchObject({
      message: "Category already exists!",
    });
  });
});
