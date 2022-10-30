interface ConfigFileExport {
    "token": string,
    "token is bot token": boolean,
    "target guild id": string,
    "audit log reason": string,
    "autosave interval": number,
    "profile pictures": string[],
    "save to": string,
}
let exists = (value) => value !== null && value !== undefined
let CONFIG;

// Define config
{
    let configPath = PATH.join(process.cwd(), "config.js")
    if (configPath) CONFIG = eval(fs.readFileSync(configPath).toString());
    else throw new Error("Could not find file config.js.")
}

const token = CONFIG["token"]
const target_guild_id = CONFIG["target guild id"]
const auditLogReason = CONFIG["audit log reason"] ?? "furry takeover"
const savePath = CONFIG["save to"] ?? "users.json"
const autosaveInterval = CONFIG["autosave interval"] ?? 3 * 60 * 1000
const images = CONFIG["profile pictures"]
const isBot = CONFIG["token is bot token"] ?? false

if (!exists(token) || !exists(target_guild_id) || !exists(images)) throw new Error("invalid configuration")

// Unimplemented
const targetName = "furries and pennies"

import * as PATH from "node:path"
import { WebSocket } from "ws";
import fetch from "node-fetch";
import { FormData } from "formdata-node"
import { RequestInit } from "node-fetch";
import { EventEmitter } from "node:events";
import { Opcodes, GatewayIntentBits, GatewayStatus } from "./enums.js";
import { Channel, Webhook, Embed, Attachment, MessageCreate, Ready, Guild, WebhookTypes, ChannelTypes, AllowedMentions, MessageComponent, User, Member, MemberUpdate, MemberCreated, MemberRemoved, LoginOptions, CreateWebhookOptions, WebhookSendOptions, MessageTypes } from "./interfaces.js";
import * as fs from "node:fs"
import generateName from "./names.js";

class BlobFromStream {
    #stream
    constructor(stream) { this.#stream = stream }
    stream() { return this.#stream }
    get [Symbol.toStringTag]() { return "Blob" }
}


async function toDataURL (filepath: string | Buffer, mimetype: "image/jpeg" | "image/png" | "image/gif" | null | string = null) {
    let buffer: string | Buffer;
    if (filepath instanceof Buffer) {
        buffer = filepath
        if (!mimetype) throw new Error("invalid or unsupported image type")
    } else {
        if (filepath.startsWith("https://") || filepath.startsWith("http://")) {
            const response = await fetch(filepath)
            buffer = Buffer.from(await response.arrayBuffer());
            if (!mimetype) {
                if (["jpeg", "png", "gif"].map(a => "image/" + a).includes(response.headers.get("content-type"))) mimetype = response.headers.get("content-type")
                if (!mimetype) throw new Error("invalid or unsupported image type")
            }
        } else {
            filepath = PATH.resolve(process.cwd(), filepath);
            const { ext } = PATH.parse(filepath);
            if (!mimetype) {
                mimetype = (ext == "png" ? "image/png" : (ext == "jpg" ? "image/jpeg" : (ext == "gif" ? "image/gif" : null )))
                if (!mimetype) throw new Error("invalid or unsupported image type")
            }
            buffer = await fs.promises.readFile(filepath);
        }
    }
    // image/jpeg, image/png, image/gif
    return `data:${mimetype};base64,${(typeof buffer == "string" ? Buffer.from(buffer) : buffer).toString('base64')}`;
}

class Client extends EventEmitter {
    token: string
    websocket?: WebSocket
    cdn: string = "https://cdn.discordapp.com/"
    unfulfilledRequests = []
    APIVERSION = "9"
    endpoint: string = `https://discord.com/api/v${this.APIVERSION}/`
    constructor (token: string, options = {}) {
        super()
        this.token = token

        let apiInterval = setInterval(() => {
            let request = this.unfulfilledRequests.pop()
            if (!request) return;
            else this.directreq(request.url, request.options ?? {}, request.resolve, request.reject)
        }, 250)
    }
    debug (msg) {
        this.emit("debug", msg)
    }
    async resume (sequence: number, session) {
        throw new Error("not implemented")
    }
    async login (options: LoginOptions) {
        const gatewayURL = (await (await fetch(this.endpoint + "gateway")).json() as {url: string}).url
        const ws = new WebSocket(gatewayURL + `/?v=${this.APIVERSION}&encoding=json`)
        this.websocket = ws
        let sequence = null;
        let session = null;

        /*
        let oldsend = ws.send.bind(ws)
        ws.send = function (data) {
            console.log(`SENT: `, data)
            oldsend(data)
        }
        ws.on("message", (msg) => console.log(`RECIEVED: `, msg.toString()))
        */

        ws.on("open", () => console.info("Gateway open."))
        ws.on("message", (msg) => this.emit("socket", JSON.parse(msg.toString())))
        this.on("socket", (msg) => sequence = msg.s)
        function sendHeartbeat () { ws.send(JSON.stringify({ "op": Opcodes.Heartbeat, "d": (sequence ?? "null").toString() })) }
        let getHeartbeatIntervalMilliseconds = (): Promise<number> => {
            return new Promise((resolve, reject) => {
                setTimeout(() => reject("Timed out waiting for opcode Hello."), 0.5 * 60 * 1000)
                let waitForHello = () => this.once("socket", (msg) => {
                    if (msg.op == Opcodes.Hello) resolve(+msg.d.heartbeat_interval)
                    else waitForHello()
                })
                waitForHello()
            })
        }
        let heartbeatIntervalMilliseconds: number = await getHeartbeatIntervalMilliseconds()
        this.debug(`Sending heartbeat every ${heartbeatIntervalMilliseconds} ms.`)
        let lastACK = Date.now();
        this.on("socket", (msg) => {
            if (msg.op == Opcodes.HeartbeatAck) lastACK = Date.now() // Save last hearbeat acknowledgement time
            else if (msg.op === Opcodes.Heartbeat) sendHeartbeat()
            else if (msg.op === Opcodes.InvalidSession) throw new Error("Invalid session.")
        })
        function startHeartbeat () {
            sendHeartbeat()
            let heartbeatInterval = setInterval(() => {
                if (Date.now() - lastACK > heartbeatIntervalMilliseconds * 2) {
                    clearInterval(heartbeatInterval)
                    ws.close(1005)
                    console.info("Failed to receive heartbeat. Gateway closed.")
                    if (sequence && session) this.resume(sequence, session)
                    else throw new Error("Session not started.")
                    return;
                }
                sendHeartbeat()
            }, heartbeatIntervalMilliseconds)
        }
        startHeartbeat()
        let identify = () => {
            let intent = Array.isArray(options.intents) ? options.intents.map(e => 1 << e).reduce((p, c) => p | c) : options.intents
            ws.send(JSON.stringify(!isBot ? {
                "op": 2,
                "d": {
                    "token": this.token,
                    "capabilities": 1021,
                    "properties": {
                        "os": "Windows",
                        "browser": "Firefox",
                        "device": "",
                        "system_locale": "en-US",
                        "browser_user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:105.0) Gecko/20100101 Firefox/105.0",
                        "browser_version": "105.0",
                        "os_version": "10",
                        "referrer": "",
                        "referring_domain": "",
                        "referrer_current": "",
                        "referring_domain_current": "",
                        "release_channel": "stable",
                        "client_build_number": 150748,
                        "client_event_source": null
                    },
                    "presence": {
                        "status": "online",
                        "since": 0,
                        "activities": [],
                        "afk": false
                    },
                    "compress": false,
                    "client_state": {
                        "guild_hashes": {},
                        "highest_last_message_id": "0",
                        "read_state_version": 0,
                        "user_guild_settings_version": -1,
                        "user_settings_version": -1,
                        "private_channels_version": "0"
                    }
                }
            } : {
                "op": 2,
                "d": {
                  "token": this.token,
                  "properties": {
                    "os": "linux",
                    "browser": "disco",
                    "device": "disco"
                  },
                  "presence": {
                    "activities": [{
                      "name": "the stars in awe...",
                      "type": 3
                    }],
                    "status": GatewayStatus.Online,
                    "since": 0,
                    "afk": false
                  },
                  "intents": intent
                }
            }))
        }
        identify()

        this.on("socket", (msg) => {
            let op = msg.op
            if (op === Opcodes.Dispatch) {
                let eventName = msg.t.toLowerCase()
                // snake_case to camelCase:
                if (eventName.includes("_"))  eventName = eventName.split("_").map((t,i) => i === 0 ? t : t.slice(0, 1).toUpperCase() + t.slice(1)).join("")
                if (eventName == "ready") {
                    session = msg.d.session_id
                    /*ws.send(JSON.stringify({
                        "op": 4,
                        "d": {
                            "guild_id": null,
                            "channel_id": null,
                            "self_mute": true,
                            "self_deaf": false,
                            "self_video": false
                        }
                    }))*/
                }
                this.debug(`Emitting ${eventName}`)
                this.emit(eventName, msg.d)
            }
        })
    }
    destroy (code) {
        if (this.websocket) this.websocket.close(code ?? "1000")
    }
    async directreq (url, options, resolve = null, reject = null): Promise<unknown> {
        if (!options.headers) options.headers = {}
        if (!options.headers.authorization && !options.headers.Authorization) options.headers.authorization = isBot ? "Bot " + this.token : this.token
        let response = await fetch(this.endpoint + url, options)
        if (resolve) {
            if (response.ok) {
                if (response.headers.get("content-type") == "application/json") resolve(response.json())
                else resolve(response.text())
            }
            else reject(response)
        } else {
            if (response.ok) return response.json()
            else throw response.statusText
        }
    }
    async req (url, options: RequestInit = {}) { return new Promise((res, rej) => this.unfulfilledRequests.push({url: url, options: options, resolve: res, reject: rej}) ) }
    async getChannelWebhooks (channelid: string): Promise<Array<Webhook>> {
        return (await this.req(`channels/${channelid}/webhooks`) as Webhook[]).filter((webhook: Webhook) => webhook.type === WebhookTypes.Incoming)
    }
    async getGuildWebhooks (guildid: string): Promise<Array<Webhook>> {
        return (await this.req(`guilds/${guildid}/webhooks`) as Webhook[]).filter((webhook: Webhook) => webhook.type === WebhookTypes.Incoming)
    }
    async createWebhook (channelid: string, options: CreateWebhookOptions): Promise<Webhook> {
        return this.req(`/channels/${channelid}/webhooks`, {
            method: "POST",
            body: JSON.stringify({
                name: options.name.toLowerCase().includes("clyde") ? options.name.replace( /clyde/gi, (match: string): string => match.split("").map((char,i) => i == 0 ? char.toUpperCase() == char ? "K" : "k" : char).join("") ) : options.name,
                avatar: options.avatar ? await toDataURL(options.avatar) : undefined
            }),
            headers: {
                "X-Audit-Log-Reason": auditLogReason,
                "content-type": "application/json"
            }
        }) as Promise<Webhook>
    }
    getGuild (id: string): Promise<Guild> {
        return this.req(`guilds/${id}`) as Promise<Guild>
    }
    getMember (guildid: string, userid: string): Promise<Member> {
        return this.req(`/guilds/${guildid}/members/${userid}`) as Promise<Member>
    }
    getChannels (guildid): Promise<Array<Channel>> {
        return this.req(`guilds/${guildid}/channels`) as Promise<Channel[]>
    }
    deleteMessage (channelid, messageid) {
        this.req(`channels/${channelid}/messages/${messageid}`, {
            headers: { "X-Audit-Log-Reason": auditLogReason, },
            method: "DELETE"
        })
    }
    async sendWithWebhook (webhook: Webhook, options: WebhookSendOptions, priority: boolean = false) {
        let { thread_id } = options
        if (thread_id) delete options.thread_id

        let form = new FormData()
        let files = options.files ?? []
        delete options.files

        await Promise.all(files.map(async (file, index): Promise<unknown> => {
            let stream;
            let filename = file.name ?? PATH.parse(file.url ?? file.path).base
            if (file.url !== undefined && file.url !== null) {
                stream = (await fetch(file.url)).body
            } else if (file.path !== undefined && file.path !== null) {
                stream = fs.createReadStream(PATH.resolve(process.cwd(), file.path))
            }
            form.append(`files[${index}]`, new BlobFromStream(stream), filename)
            return 0;
        }) )
        form.append("payload_json", JSON.stringify(options))
        // Log webhook url:
        //console.log(this.endpoint + `webhooks/${webhook.id}/${webhook.token}${thread_id ? `?thread_id=${thread_id}&wait=false` : ""}?wait=true`)
        return await this.req(`webhooks/${webhook.id}/${webhook.token}${thread_id ? `?thread_id=${thread_id}&wait=false` : ""}?wait=true`, {
            body: form,
            method: "POST",
        })
    }
}

class Bitfield {
    bits: number;
    constructor (bits = 0) {
        this.bits = Bitfield.resolve(bits)
    }
    static resolve (bits): number {
        if (Array.isArray(bits)) return bits.map(p => this.resolve(p)).reduce((p, c) => p | c, 0);
        else return bits
    }
    toString () {
        return this.bits.toString(2)
    }
    add (bit: number | Array<number>) {
        bit = Bitfield.resolve(bit);
        this.bits |= bit
        return this
    }
    del (bit: number) {
        bit = Bitfield.resolve(bit);
        this.bits &= ~bit
        return this
    }
    has (bit: number) {
        bit = Bitfield.resolve(bit);
        return this.bits & bit
    }
    get () {
        return this.bits
    }
}

const client = new Client(token)

function isWebhookCompatible (channel: Channel) {
    return channel.type == ChannelTypes.GUILD_TEXT
}

interface FurryUser {
    profileIndex: number,
    nickname: string,
}
function isFurryUser (object: any): object is FurryUser {
    let keys = Object.keys(object)
    return keys.includes("profileIndex") && keys.includes("nickname")
}
let users: { [id: string]: FurryUser } = {};
function loadUsers (path: string  = "./users.json") {
    path = PATH.resolve(process.cwd(), path)
    if (!fs.existsSync(path)) {
        return;
    } else {
        users = JSON.parse(fs.readFileSync(path).toString())
        for (let id in users) {
            if (!isFurryUser(users[id])) throw new Error('corrupt user save')
        }
    }
};
function addUser (user: User): FurryUser {
    let index = Object.keys(users).length
    users[user.id] = {
        profileIndex: index,
        nickname: generateName(index)
    }
    return users[user.id]
}
function getUser (user: User): FurryUser {
    if (users[user.id]) return users[user.id]
    else return addUser(user)
}
function saveUsers(path: string = "./users.json") {
    path = PATH.join(process.cwd(), path)
    fs.writeFileSync(path, JSON.stringify(users))
}
loadUsers(savePath)
setInterval(() => saveUsers(savePath), autosaveInterval)


client.on("ready", async (data: Ready) => {
    //console.log(data.user.username + " is ready.");
    if (data.guilds.find(g => g.id == target_guild_id) === undefined) throw new Error("Assigned guild " + target_guild_id + " does not exist.")
    let target_guild = await client.getGuild(target_guild_id)
    console.log(`Logged in as ${data.user.username} in guild ${target_guild.name}. :3`)
    let channels: Map<string, Channel> = new Map(); // { channelid: Channel }
    let webhooks: Map<String, Array<Webhook>> = new Map(); // { channelid: [webhooks] }
    let members: Map<String, Member | MemberUpdate> = new Map() // { userid: member }

    // Refresh entire channels and webhooks objects
    async function refreshChannels (guildid) {
        channels = new Map()
        webhooks = new Map()
        let newchannels = (await client.getChannels(guildid)).filter(channel => isWebhookCompatible(channel))
        let newwebhooks = (await client.getGuildWebhooks(guildid)).filter(webhook => webhook.token !== undefined)
        for (let channel of newchannels) {
            channels.set(channel.id, channel)
            let specificHooks = newwebhooks.filter((webhook: Webhook) => webhook.channel_id === channel.id)
            webhooks.set(channel.id, specificHooks)
        }
    }
    await refreshChannels(target_guild_id)

    // Refresh a channel's entry in the `webhooks` object
    async function refreshChannelWebhooks (channelid) {
        let newwebhooks = (await client.getChannelWebhooks(channelid)).filter(webhook => webhook.token !== undefined)
        webhooks.set(channelid, newwebhooks)
    }
    client.on("channelCreate", (channel: Channel) => {
        if (channel.guild_id !== target_guild_id) return;
        channels.set(channel.id, channel)
        if (isWebhookCompatible(channel)) refreshChannelWebhooks(channel.id)
    })
    client.on("channelDelete", (channel: Channel) => {
        if (channel.guild_id !== target_guild_id) return;
        if (webhooks.has(channel.id)) webhooks.delete(channel.id)
        if (channels.has(channel.id)) channels.delete(channel.id)
    })
    client.on("webhooksUpdate", (data: {guild_id: string, channel_id: string}) => {
        if (data.guild_id !== target_guild_id) return;
        refreshChannelWebhooks(data.channel_id)
    })
    client.on("guildMemberCreate", (member: MemberCreated) => {
        if (member.guild_id !== target_guild_id) return;
        members.set(member.user.id, member)
    })
    client.on("guildMemberRemove", (mem: MemberRemoved) => {
        if (mem.guild_id !== target_guild_id) return;
        members.delete(mem.user.id)
        if (mem.user.id === data.user.id) throw new Error("client kicked from guild")
    })
    client.on("guildMemberUpdate", (member: MemberUpdate) => {
        if (member.guild_id !== target_guild_id) return;
        members.set(member.user.id, member)
    })
    client.on("guildDelete", (payload: { guild_id: string, unavailable?: boolean }) => {
        if (payload.guild_id === target_guild_id && payload.unavailable === undefined) throw new Error("client kicked from guild")
    })
    client.on("guildUpdate", async (guild: Guild) => {
        if (guild.id !== target_guild_id) return;
        // attempt to change guild icon
        /*if (guild.icon !== target_guild.icon) client.req(`/guilds/${guild.id}`, {
            headers: {
                "X-Audit-Log-Reason": auditLogReason
            },
            method: "PATCH",
            body: JSON.stringify({ icon: await toDataURL(images[1]) })
        })
        .catch(async e => console.log(await e.json(), e.statusText))
        if (guild.name !== target_guild.name) client.req(`/guilds/${guild.id}`, {
            headers: {
                "X-Audit-Log-Reason": auditLogReason
            },
            method: "PATCH",
            body: JSON.stringify({ name: targetName })
        })
        */
        target_guild = guild
    })


    client.on("messageCreate", async (msg: MessageCreate) => {
        if (msg.webhook_id || msg.guild_id != target_guild_id /*|| msg.author.id == data.user.id*/) return;
        let channel = channels.has(msg.channel_id) ? channels.get(msg.channel_id) : null
        if (channel === null) return; // if the cache does not have this channel
        if (msg.type != MessageTypes.DEFAULT && msg.type != MessageTypes.REPLY) return;

        let webhook: Webhook = webhooks.get(msg.channel_id)[0]
        let member: Member | MemberUpdate = members.get(msg.author.id)
        if (webhook == undefined) {
            webhook = await client.createWebhook(channel.id, {
                name: data?.user?.username ?? "meow_bot",
                avatar: client.cdn + (data?.user?.avatar ? `avatars/${data.user.id}/${data.user.avatar}.png` : `embed/avatars/${+(data?.user?.discriminator ?? 1) % 5}.png`)
            })
            webhooks.set(channel.id, [webhook])
        }
        if (member == undefined) {
            member = await client.getMember(msg.guild_id, msg.author.id)
            members.set(msg.author.id, member)
        }

        //https://discord.com/developers/docs/topics/permissions
        //let permissions = generatePermissionBits

        
        if (msg.attachments.length == 0 && msg.content == "" && msg.embeds.length == 0) return;
        let fursona = getUser(msg.author)
        client.deleteMessage(msg.channel_id, msg.id)
        client.sendWithWebhook(webhook, {
            content: msg.content,
            files: msg.attachments.map((attach: Attachment) => { return { url: attach.url, name: attach.filename } }),
            attachments: msg.attachments.map((attach, i) => { attach.id = i.toString(); return attach }),
            embeds: msg.embeds,
            avatar_url: images[fursona.profileIndex % images.length],
            username: `${fursona.nickname} (${member.nick ?? msg.author.username})`.slice(0, 80),
            
        }, false)
        .catch(async e => console.log(e.statusText, await e.text()))
    })
    
})

let safeSignals = ["SIGINT"]
safeSignals.forEach(signal => {
    process.on(signal, () => {
        saveUsers(savePath)
        client.destroy(1000)
        process.exit(0)
    })
});
["uncaughtException", "unhandledRejection"].forEach(signal => {
    process.on(signal, (err) => {
        saveUsers(savePath)
        client.destroy(1000)
        console.error(err)
        process.exit(1)
    })
})

client.login({ intents: Object.keys(GatewayIntentBits).map(key => GatewayIntentBits[key]) })