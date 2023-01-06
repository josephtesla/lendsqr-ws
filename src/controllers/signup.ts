import { WrapperArguments } from "../helpers";
import { userRepository } from "../repositories";
import { AuthService } from "../services";

export const signup = async ({ input }: WrapperArguments) => {
  const { name, email, password } = input;
  const authService = new AuthService(userRepository);
  const { token, userId } = await authService.signUp({ 
    name, 
    email, 
    password 
  });

  return {
    token,
    userId,
  };
};
