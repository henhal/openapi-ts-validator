
type DeepNever<T, U> = T extends U ?
    never :
    T extends { [P: string]: any } ?
        { [P in keyof T]: DeepNever<T[P], U> } :
        T extends Array<infer E> ?
            Array<DeepNever<E, U>> :
            T;

export interface ReferenceObject {
  $ref: string;
}

export type Deref<T> = DeepNever<T, ReferenceObject>;



