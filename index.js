const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

app.use(morgan('dev'))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

  const formatUpdateMessage = (rawUpdate)  => {
    return new Promise(async (resolve, reject) => {
      try {

        // Define timestamp
        let timestamp = Math.floor(Date.now());
        console.log('timestamp', timestamp)
        // Define update
        let update = {
          message: {
            mid: `${String(timestamp)}`,
            seq: null
          },
          payload: {
            id: rawUpdate.from
          },
          sender: {
            id: rawUpdate.from
          },
          recipient: {
            id: rawUpdate.recipient_id
          },
          timestamp: timestamp
        };

        console.log('update1', update)

        // Define config
       // let config = this.credentials.accounts[update.recipient.id + '_' + update.sender.id] || this.credentials.accounts[update.recipient.id];

        // Define update payload
        update.payload.training = config.message.training;
        update.payload.language = config.message.language;
        update.payload.channel = config.message.channel;

        // Define update message text
        if (rawUpdate.type == 'text') {
          update.message.text = rawUpdate.text.body;
        }
        console.log('update2', update)

        // Return result
        resolve(update);
      } catch(error) {
        reject(error);
      }
    });
  }


  app.post('/wtsp-webhook', (req, res) => {
    if (req.body && req.body.messages) {
      for (let message of req.body.messages) {
        if (message) {
          //message.recipient_id = req.params.id;
          formatUpdateMessage(message).then((update) => {
            console.log('update', update)
          }).catch((error) => {
            console.error('Error in "WhatsappBot.__formatUpdateMessage" method call');
          });
        }
      }
    }
    res.status(200).send('success');
  });


app.listen(4000, () => {
    console.log('back de prueba levantado')
})