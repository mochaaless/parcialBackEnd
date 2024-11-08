import { Collection, ObjectId } from "mongodb";
import { UserModel, User, Friend } from "./types.ts";


// export const getInfoAmigo = async (userDb: UserModel, userCollection: Collection<UserModel>) : Promise<User> => {

//     const amigos = await userCollection
//     .find( {_id: { $in: userDb.amigos} } )
//     .toArray()

//     console.log(amigos)

//     return {
//         id: userDb._id!.toString(),
//         nombre: userDb.nombre,
//         email: userDb.email,
//         telefono: userDb.telefono,
//         amigos: amigos.map( (amigo) => amigoFromUser(amigo)) 
//     }
// }


// const amigoFromUser = (amigo: UserModel) : Friend => ({
//     id: amigo._id!.toString(),
//     nombre: amigo.nombre,
//     email: amigo.email,
//     telefono: amigo.telefono
// })




export const getInfoAmigo = async (id: string, userCollection: Collection<UserModel>) : Promise<Friend> => {

    const idO = new ObjectId(id)

    const friend = await userCollection.findOne({_id: idO})

    return {
        id: friend!._id!.toString(),
        nombre: friend!.nombre,
        email: friend!.email,
        telefono: friend!.telefono,
    }
}
