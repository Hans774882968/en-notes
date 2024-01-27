import { NextApiRequest, NextApiResponse } from 'next';
import Ajv, { JSONSchemaType, KeywordDefinition } from 'ajv';

export function validateReq<T>({ schema, keywordObjects, validateQuery }: {
  schema: JSONSchemaType<T>
  keywordObjects?: KeywordDefinition[]
  validateQuery?: boolean
}) {
  const ajv = new Ajv();

  if (Array.isArray(keywordObjects)) {
    keywordObjects.forEach((keywordObject) => {
      ajv.addKeyword(keywordObject);
    });
  }

  const validate = ajv.compile(schema);
  return (req: NextApiRequest, res: NextApiResponse, next: () => any) => {
    const valid = validate(validateQuery ? req.query : req.body);
    if (valid) {
      return next();
    }
    const error = Array.isArray(validate.errors) ? validate.errors[0] : {
      instancePath: '',
      message: '',
      params: ''
    };
    return res.status(400).json({
      error: {
        instancePath: error.instancePath,
        message: error.message,
        params: error.params
      }
    });
  };
}
