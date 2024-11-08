import { MongoClient, ObjectId } from 'mongodb'
import { UserModel } from "./types.ts"
import { getInfoAmigo } from "./utils.ts"

// conseguimos mongo url
const MONGO_URL = Deno.env.get("MONGO_URL")
if (!MONGO_URL) {
    console.log("No mongo url found!")
    Deno.exit(1)
}

const client = new MongoClient(MONGO_URL)
await client.connect()
console.log("Conected to database!")

const db = client.db("agenda")

const usersCollection = db.collection<UserModel>("users")

const handler = async (req: Request) : Promise<Response> => {

    const url = new URL(req.url)
    const path = url.pathname
    const method = req.method


    if (method === "GET") {

        if (path === "/personas") {
            const name = url.searchParams.get("nombre")

            let usersDb
            if (name) {
                usersDb = await usersCollection.find({nombre: name}).toArray()
            } else {
                usersDb = await usersCollection.find().toArray()
            }

            const users = []
            for (let i= 0; i<usersDb.length; i++) {
                const amigos = await Promise.all(usersDb[i].amigos.map((amId) => getInfoAmigo(amId, usersCollection)))
                users.push({
                    id: usersDb[i]._id!.toString(),
                    nombre: usersDb[i].nombre,
                    email: usersDb[i].email,
                    telefono: usersDb[i].telefono,
                    amigos
                }
                )
            }

            return new Response(JSON.stringify(users), {status: 200})
        
        } else if (path === "/persona") {
            const email = url.searchParams.get("email")
            if (email) {
                const userDb  = await usersCollection.findOne({email})
                if (userDb) {

                    const amigos = await Promise.all(userDb.amigos.map((amId) => getInfoAmigo(amId, usersCollection)))

                    const user = {
                        id: userDb._id!.toString(),
                        nombre: userDb.nombre,
                        email: userDb.email,
                        telefono: userDb.telefono,
                        amigos
                    }

                    return new Response(JSON.stringify(user), {status: 200})
                }
            }

            return new Response(JSON.stringify({
                "error": "Persona no encontrada."
              }), {status: 404})


        }

        return new Response("Path not found in GET method", {status: 404})

    } else if (method === "POST") {

        if (path === "/personas") {
            const body = await req.json()

            if (!body.nombre || !body.email || !body.telefono || !body.amigos) {
                return new Response("Missing params in request", {status: 400})
            }

            const existUserbyEmail = await usersCollection.findOne({ email: body.email})

            if (existUserbyEmail) return new Response(JSON.stringify({
                error: "El email o teléfono ya están registrados."
            }), {status: 400})

            // const existUserbyPhone = await usersCollection.findOne({ phone: body.phone})
            
            // if (existUserbyPhone) return new Response(JSON.stringify({
            //     error: "El email o teléfono ya están registrados."
            // }), {status: 400})

            await usersCollection.insertOne({
                nombre: body.nombre,
                email: body.email,
                telefono: body.telefono,
                amigos: body.amigos
            })

            const arrFriends = await Promise.all(body.amigos.map((amId) => getInfoAmigo(amId, usersCollection)))

            return new Response(JSON.stringify({
                message: "Persona creada exitosamente",
                persona: {
                    nombre: body.nombre,
                    email: body.email,
                    telefono: body.telefono,
                    amigos: arrFriends
                }
            }), {status: 201})
        }


        return new Response("Path not found in POST method", {status: 404})
    
    } else if (method === "PUT") {
        if (path === "/persona/amigo") {
            const body = await req.json()
            if (!body.personaEmail || !body.amigoID) {
                return new Response("Request type not found", {status: 404})
            }
            const userDb = await usersCollection.findOne( { email: body.email} )

            return new Response("No me ha dado tiempo pero hacer un usrmodel.push el id del amigo en el array de amigos del userDB. Un saludo y se bueno", {status: 200})

            
        }

        return new Response("Path not found in POST method", {status: 404})
    }




    return new Response("Request type not found", {status: 404})
    
}


Deno.serve({port: 4000}, handler)