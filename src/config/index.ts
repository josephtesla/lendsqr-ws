import dotenv from 'dotenv'

dotenv.config()
dotenv.config({ path: './../../.env' })

export const config = Object.freeze({
  environment: process.env.NODE_ENV as string,
  port: process.env.PORT,
  jwtSecret: process.env.JWT_SECRET as string,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN as string,

  dbHost: process.env.DB_HOST,
  dbPort: Number(process.env.DB_PORT),
  dbName: process.env.DB_NAME,
  dbUser: process.env.DB_USER,
  dbPass: process.env.DB_PASS
})
