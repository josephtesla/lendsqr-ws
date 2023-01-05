import { WrapperArguments } from "../helpers";
import { userModel } from "../models";
import { AuthService } from "../services";

export const signup = async ({ input }: WrapperArguments) => {
  const { name, email, password } = input;
  const authService = new AuthService(userModel);
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
