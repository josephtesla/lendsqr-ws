import Joi from 'joi'

export const fundAccountSchemas = {
  inputSchema: Joi.object().keys({
    amount: Joi.number().min(0).required()
  })
}

export const withdrawFromAccountSchemas = {
  inputSchema: Joi.object().keys({
    amount: Joi.number().min(0).required(),
    bankDetails: Joi.object().keys({
      bankName: Joi.string().required(),
      bankAccountNumber: Joi.string().length(10).required(),
      bankAccountName: Joi.string().required(),
    }).required()
  })
}

export const transferToAccountSchemas = {
  inputSchema: Joi.object().keys({
    amount: Joi.number().min(0).required(),
    toWalletId: Joi.string().required()
  })
}
