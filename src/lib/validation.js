import joi from "@hapi/joi";

export const stringSchema = joi
  .string()
  .allow('');

export const sigmaSchema = joi
  .array()
  .items(joi.string(), joi.number(), joi.boolean())
  .required()
  .label('sigma');

export const machineSchema = sigma => joi.object({
  initial: joi.string().required(),
  final: joi.array().items(joi.string().required()),
  states: joi
    .object()
    .pattern(
      /[a-zA-Z0-9-_]/,
      joi.object({
        on: joi
          .object()
          .pattern(/[a-zA-Z0-9-_]/, joi.string())
          .length(sigma.length),
      }),
    )
    .required(),
});
