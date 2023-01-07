import { NextFunction, Request, Response } from 'express'
import { getTokenFromHeader } from '../helpers'
import { AuthService } from '../services/auth'
import { IUser } from '../types'

export const currentUserMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.get('Authorization')

  if (authHeader == null || authHeader === '') {
    req.user = null
    return next()
  }

  const token = getTokenFromHeader(authHeader)

  let decodedToken
  try {
    decodedToken = AuthService.verifyAuthToken(token)
  } catch (err) {
    req.user = null
    return next()
  }

  const user: IUser = decodedToken.user
  if (user == null) {
    throw new Error('Invalid token payload. ' + 'Token must contain current user details')
  }

  req.user = user
  return next()
}
