import {OpenAPIV3} from 'openapi-types';
import Ajv, {ValidateFunction} from 'ajv';
import addFormats from 'ajv-formats';

import {Deref} from './types';

const defaultAjv = addFormats(new Ajv({strict: false}));

export type SchemaMap = {
  [name: string]: Deref<OpenAPIV3.SchemaObject>;
};

export class SchemaValidator<Schemas extends Record<string, unknown>> {
  private readonly ajv;
  private readonly validators: Partial<Record<keyof Schemas, ValidateFunction>> = {};

  constructor(readonly schemas: SchemaMap, {ajv = defaultAjv} = {}) {
    this.ajv = ajv;
  }

  static fromDocument<Schemas extends Record<string, unknown>>(document: Deref<OpenAPIV3.Document>): SchemaValidator<Schemas> {
    const schemas = document.components?.schemas;

    if (!schemas) {
      throw new Error(`Document has no schemas`);
    }

    return new SchemaValidator(schemas);
  }

  validate<K extends keyof Schemas>(name: K, data: unknown): data is Schemas[K] {
    if (!(name in this.schemas)) {
      throw new Error(`Schema not found`);
    }
    const schema = this.schemas[name as string];
    const validate = this.validators[name] ?? (this.validators[name] = this.ajv.compile(schema));

    return validate(data);
  }
}