import { WrapperArguments } from '../helpers'
import { userRepository } from '../repositories'
import { AuthService } from '../services'

export const login = async ({ input }: WrapperArguments) => {
  const { email, password } = input
  const authService = new AuthService(userRepository)
  const { token, userId } = await authService.login({ email, password })
  return {
    token,
    userId
  }
}
