import {dereference} from 'json-schema-ref-parser';
import {Deref} from 'src/types';
import {OpenAPIV3} from 'openapi-types';

export async function parseDocument(path: string): Promise<Deref<OpenAPIV3.Document>> {
  return await dereference(path) as Deref<OpenAPIV3.Document>;
}