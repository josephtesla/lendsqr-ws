import { WrapperArguments } from "../helpers";
import { userModel } from "../models";
import { AuthService } from "../services";

export const login = async ({ input }: WrapperArguments) => {
  const { email, password } = input
  const authService = new AuthService(userModel)
  const { token, userId } = await authService.login({ email, password })
  return {
    token,
    userId
  }
}
