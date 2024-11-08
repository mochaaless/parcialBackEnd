import { ObjectId, type OptionalId } from 'mongodb'

export type UserModel = OptionalId<{
    nombre: string,
    email: string,
    telefono: string
    amigos: ObjectId[]
}>


export type User = {
    id: string,
    nombre: string,
    email: string,
    telefono: string
    amigos: Friend[]
}

export type Friend = {
    id: string, 
    nombre: string,
    email: string,
    telefono: string
}