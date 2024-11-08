import { ObjectId, type OptionalId } from 'mongodb'

export type UserModel = OptionalId<{
    name: string,
    age: number,
    email: string,
    books: ObjectId[]
}>