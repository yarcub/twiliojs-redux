Download [ngrok](https://ngrok.com/), it'll enable us to expose the backend to the outside world.

### Step 1 - Expose localhost:3000 to the world
Run `ngrok http 3000`. It should output something similar to:

`forwarding                    http://fabd148a.ngrok.io -> localhost:3000 `

### Step 2 - Configure Twilio phone number
Configure number's voice url using the hostname given by ngrok. Example:

`http://<ngrok_host>/twilml/incoming/voice`

Create a [TwilML App](https://www.twilio.com/user/account/voice/dev-tools/twiml-apps) with the outgoing voice url:

`http://<ngrok_host>/twilml/outgoing/voice`

Copy app `sid`, that will be needed in a minute.

### Step 3 - Configure project
1. Rename `config.sample.js` to `config.js`
2. Edit `config.js` with your [Twilio account credentials](https://www.twilio.com/user/account/settings).
  * `account_sid`
  * `auth_token`
  * `app_sid`

### Step 4 - Build & Launch

```
npm install
gulp build
node server
```
