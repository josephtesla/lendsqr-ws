import bcrypt from 'bcrypt'
import { faker } from '@faker-js/faker'
import {
  UserRepository,
} from "../../../../../src/repositories";
import { AuthService } from "../../../../../src/services";

describe("Login", () => {
  it("It logs in user with valid information", async () => {
    const accessToken = 'superStrongTokenString'
    jest.spyOn(AuthService, 'generateAccessToken').mockReturnValue(accessToken)

    const email = faker.internet.email();
    const password = 'password'

    const stubUser = {
      id: faker.random.alphaNumeric(5),
      name: faker.name.fullName(),
      email,
      password: bcrypt.hashSync(password, 10),
      createdAt: faker.date.past(),
      updatedAt: faker.date.past()
    };

    const userRepository = {
      findUserWithEmail: jest.fn(() => stubUser)
    } as unknown as UserRepository

    const authService = new AuthService(userRepository);
    const result = await authService.login({ email, password })
    expect(userRepository.findUserWithEmail).toHaveBeenCalledTimes(1)
    expect(result).not.toBeNull()
    expect(result).toMatchObject({
      userId: stubUser.id,
      token: accessToken
    })
  });
});
