# Furry Takeover Userbot
### If your server isn't interesting enough...
---
## Installation
```bash
git clone https://github.com/CactusHamster/Furry-Takeover-Userbot.git # Clone the repo.
cd Furry-Takeover-Userbot
npm install # Install necessary packages.
npm run build # Compile typescript source to useable nodejs.
cp config.template.js config.js # Create a configuration file from the template.
```
---
## Configuration
Please create/edit a config.js file to provide necessary settings to the userbot.

### Default configuration:
```js
// config.js
module.exports = {
    "token": process.env.token,
    "token is bot token": false,
    "target guild id": "unset",
    "audit log reason": "furry takeover",
    "autosave interval": 3 * 60 * 1000,
    "profile pictures": [ "unset" ],
    "save to": "users.json"
}
```
---
## Usage
Requires permission to manage other users' messages and webhooks in the targeted server.

Sending a message in the target Discord server (can be from any user) will trigger the userbot if active.
```bash
npm run build # Compile source to Javascript.
npm start # Start the userbot from compiled Javascript.
```