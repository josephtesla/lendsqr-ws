import { Schema } from 'joi'

export type AnyFunction = (...input: any[]) => any

export const JoiValidate = (schema: Schema, obj: any): any => {
  const { error, value } = schema.validate(obj, { abortEarly: false })
  if (error != null) {
    throw error
  }

  return value
}

export const getTokenFromHeader = (header: string): string =>
  (header ?? '').replace('Bearer ', '')
