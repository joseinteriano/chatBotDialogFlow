const { io } = require('../server')
const uuid = require('uuid')
const dialogflow = require('@google-cloud/dialogflow')
//let d = require('../../config/credentials.json')
io.on('connection', (client) => {
    console.log('Usuario conectado')

    client.on("chat message", (message) => {
        console.log(process.env.PROJECT_ID)
        const callapibot = async (projectId = process.env.PROJECT_ID) => {
          try {
            const sessionId = uuid.v4()
            const sessionClient = new dialogflow.SessionsClient({
              keyFilename: './config/credentials.json'
            })
            const sessionPath = sessionClient.projectAgentSessionPath(
              projectId,
              sessionId
            )
            const request = {
              session: sessionPath,
              queryInput: {
                text: {
                  text: message,
                  languageCode: "es-HN",
                },
              },
            }
            
            const responses = await sessionClient.detectIntent(request)
            //console.log(responses[0].queryResult.fulfillmentMessages[0].payload.fields)
            //console.log("Detected intent")

            const result = responses[0].queryResult.fulfillmentText
            //client.emit("bot reply", result)
            client.emit('bot reply', responses[0].queryResult)

            //console.log(result)
            if (result.intent) {
              console.log(`  Intent: ${result.intent.displayName}`)
            } else {
              console.log(`  No intent matched.`)
            }
          } catch (error) {
            console.log(error)
          }
        }
    
        callapibot()
      })

    // client.on('entrarChat', (usuario, callback) => {
    //     if(!usuario.nombre || !usuario.sala){
    //         return callback({
    //             ok: false,
    //             message: 'El nombre y sala son necesarios'
    //         })
    //     }

    //     client.join(usuario.sala)

    //     let personas = usuarios.agregarPersona(client.id, usuario.nombre, usuario.sala)
        
    //     client.broadcast.to(usuario.sala).emit('listaPersona', usuarios.getPersonasPorSala(usuario.sala))
    //     client.broadcast.to(usuario.sala).emit('crearMensaje', crearMensaje('Administrador', `${usuario.nombre} se unió`))

    //     callback(usuarios.getPersonasPorSala(usuario.sala))
    // })

    // client.on('disconnect', () => {
    //     let personaBorrada = usuarios.borrarPersona(client.id)

    //     client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje('Administrador', `${personaBorrada.nombre} salió`))
    //     client.broadcast.to(personaBorrada.sala).emit('listaPersona', usuarios.getPersonasPorSala(personaBorrada.sala))
    // })

    // client.on('crearMensaje', (data, callback) => {
    //     let persona = usuarios.getPersona(client.id)

    //     let mensaje = crearMensaje(persona.nombre, data.mensaje)

    //     client.broadcast.to(persona.sala).emit('crearMensaje', mensaje)

    //     callback(mensaje)
    // })

    // client.on('mensajePrivado', data => {
    //     let persona = usuario.getPersona(client.id)

    //     client.broadcast.to(data.to).emit('mensajeProvado', crearMensaje(persona.nombre, data.mensaje))

    // })
})