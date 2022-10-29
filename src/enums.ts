export enum GatewayStatus {
	Online = "online",
	/**
	 * Online
	 */
	DoNotDisturb = "dnd",
	/**
	 * Do Not Disturb
	 */
	AFK = "idle",	
	/**
	 * AFK
	 */
	Invisible = "invisible",	
	/**
	 * Invisible and shown as offline
	 */
	Offline = "offline",
	/**
	 * Offline
	 */
}


export enum GatewayDispatchEvents {
	ApplicationCommandPermissionsUpdate = 'APPLICATION_COMMAND_PERMISSIONS_UPDATE',
	ChannelCreate = 'CHANNEL_CREATE',
	ChannelDelete = 'CHANNEL_DELETE',
	ChannelPinsUpdate = 'CHANNEL_PINS_UPDATE',
	ChannelUpdate = 'CHANNEL_UPDATE',
	GuildBanAdd = 'GUILD_BAN_ADD',
	GuildBanRemove = 'GUILD_BAN_REMOVE',
	GuildCreate = 'GUILD_CREATE',
	GuildDelete = 'GUILD_DELETE',
	GuildEmojisUpdate = 'GUILD_EMOJIS_UPDATE',
	GuildIntegrationsUpdate = 'GUILD_INTEGRATIONS_UPDATE',
	GuildMemberAdd = 'GUILD_MEMBER_ADD',
	GuildMemberRemove = 'GUILD_MEMBER_REMOVE',
	GuildMembersChunk = 'GUILD_MEMBERS_CHUNK',
	GuildMemberUpdate = 'GUILD_MEMBER_UPDATE',
	GuildRoleCreate = 'GUILD_ROLE_CREATE',
	GuildRoleDelete = 'GUILD_ROLE_DELETE',
	GuildRoleUpdate = 'GUILD_ROLE_UPDATE',
	GuildStickersUpdate = 'GUILD_STICKERS_UPDATE',
	GuildUpdate = 'GUILD_UPDATE',
	IntegrationCreate = 'INTEGRATION_CREATE',
	IntegrationDelete = 'INTEGRATION_DELETE',
	IntegrationUpdate = 'INTEGRATION_UPDATE',
	InteractionCreate = 'INTERACTION_CREATE',
	InviteCreate = 'INVITE_CREATE',
	InviteDelete = 'INVITE_DELETE',
	MessageCreate = 'MESSAGE_CREATE',
	MessageDelete = 'MESSAGE_DELETE',
	MessageDeleteBulk = 'MESSAGE_DELETE_BULK',
	MessageReactionAdd = 'MESSAGE_REACTION_ADD',
	MessageReactionRemove = 'MESSAGE_REACTION_REMOVE',
	MessageReactionRemoveAll = 'MESSAGE_REACTION_REMOVE_ALL',
	MessageReactionRemoveEmoji = 'MESSAGE_REACTION_REMOVE_EMOJI',
	MessageUpdate = 'MESSAGE_UPDATE',
	PresenceUpdate = 'PRESENCE_UPDATE',
	StageInstanceCreate = 'STAGE_INSTANCE_CREATE',
	StageInstanceDelete = 'STAGE_INSTANCE_DELETE',
	StageInstanceUpdate = 'STAGE_INSTANCE_UPDATE',
	Ready = 'READY',
	Resumed = 'RESUMED',
	ThreadCreate = 'THREAD_CREATE',
	ThreadDelete = 'THREAD_DELETE',
	ThreadListSync = 'THREAD_LIST_SYNC',
	ThreadMembersUpdate = 'THREAD_MEMBERS_UPDATE',
	ThreadMemberUpdate = 'THREAD_MEMBER_UPDATE',
	ThreadUpdate = 'THREAD_UPDATE',
	TypingStart = 'TYPING_START',
	UserUpdate = 'USER_UPDATE',
	VoiceServerUpdate = 'VOICE_SERVER_UPDATE',
	VoiceStateUpdate = 'VOICE_STATE_UPDATE',
	WebhooksUpdate = 'WEBHOOKS_UPDATE',
	GuildScheduledEventCreate = 'GUILD_SCHEDULED_EVENT_CREATE',
	GuildScheduledEventUpdate = 'GUILD_SCHEDULED_EVENT_UPDATE',
	GuildScheduledEventDelete = 'GUILD_SCHEDULED_EVENT_DELETE',
	GuildScheduledEventUserAdd = 'GUILD_SCHEDULED_EVENT_USER_ADD',
	GuildScheduledEventUserRemove = 'GUILD_SCHEDULED_EVENT_USER_REMOVE',
}

export enum Opcodes {
	/**
	 * An event was dispatched
	 */
	Dispatch,
	/**
	 * A bidirectional opcode to maintain an active gateway connection.
	 * Fired periodically by the client, or fired by the gateway to request an immediate heartbeat from the client.
	 */
	Heartbeat,
	/**
	 * Starts a new session during the initial handshake
	 */
	Identify,
	/**
	 * Update the client's presence
	 */
	PresenceUpdate,
	/**
	 * Used to join/leave or move between voice channels
	 */
	VoiceStateUpdate,
	/**
	 * Resume a previous session that was disconnected
	 */
	Resume = 6,
	/**
	 * You should attempt to reconnect and resume immediately
	 */
	Reconnect,
	/**
	 * Request information about offline guild members in a large guild
	 */
	RequestGuildMembers,
	/**
	 * The session has been invalidated. You should reconnect and identify/resume accordingly
	 */
	InvalidSession,
	/**
	 * Sent immediately after connecting, contains the `heartbeat_interval` to use
	 */
	Hello,
	/**
	 * Sent in response to receiving a heartbeat to acknowledge that it has been received
	 */
	HeartbeatAck,
}

export enum GatewayIntentBits {
	Guilds =  0,
	GuildMembers =  1,
	GuildBans =  2,
	GuildEmojisAndStickers =  3,
	GuildIntegrations =  4,
	GuildWebhooks =  5,
	GuildInvites =  6,
	GuildVoiceStates =  7,
	GuildPresences =  8,
	GuildMessages =  9,
	GuildMessageReactions =  10,
	GuildMessageTyping =  11,
	DirectMessages =  12,
	DirectMessageReactions =  13,
	DirectMessageTyping =  14,
	MessageContent =  15,
	GuildScheduledEvents =  16,
}