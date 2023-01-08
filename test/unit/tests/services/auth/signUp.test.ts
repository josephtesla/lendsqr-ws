import { faker } from '@faker-js/faker'
import {
  UserRepository,
} from "../../../../../src/repositories";
import { AuthService } from "../../../../../src/services";

describe("Sign Up", () => {
  it("It registers new user with valid information", async () => {
    const accessToken = 'superStrongTokenString'
    jest.spyOn(AuthService, 'generateAccessToken').mockReturnValue(accessToken)

    const email = faker.internet.email();
    const password = 'password';
    const name = faker.name.fullName();

    const stubUser = {
      id: faker.random.alphaNumeric(5),
      name,
      email,
      password,
      createdAt: faker.date.past(),
      updatedAt: faker.date.past()
    };

    const userRepository = {
      findUserWithEmail: jest.fn(() => null), // non existing
      create: jest.fn(() => stubUser)
    } as unknown as UserRepository

    const authService = new AuthService(userRepository);
    const result = await authService.signUp({ name, email, password })
    expect(result).not.toBeNull()
    expect(userRepository.findUserWithEmail).toHaveBeenCalledTimes(1)
    expect(userRepository.create).toBeCalledTimes(1)
    expect(result).toMatchObject({
      userId: stubUser.id,
      token: accessToken
    })
  });
});
