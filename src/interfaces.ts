export interface AllowedMentions {
    parse?: Array<"roles" | "users" | "everyone">,
    roles?: Array<string>,
    users?: Array<string>,
    replied_user?: boolean
}

export interface LooseObject {
    [key: string]: any
}

export interface MessageFile {
    path?: string,
    url?: string,
    buffer?: Buffer,
    name?: string
}

export interface WebhookSendOptions {
    /**
     * Send a message to the specified thread within a webhook's channel. The thread will automatically be unarchived.
     */
    thread_id?: string | null,
    /**
     * the message contents (up to 2000 characters)
     */
    content?: string,
    /**
     * override the default username of the webhook
     */
    username?: string,
    /**
     * override the default avatar of the webhook
     */
    avatar_url?: string,
    /**
     * true if this is a TTS message
     */
    tts?: boolean,
    /**
     * embedded `rich` content
     */
    embeds?: Array<Embed>,
    /**
     * allowed mentions for the message
     */
    allowed_mentions?: AllowedMentions,
    /**
     * the components to include with the message
     */
    components?: Array<MessageComponent>,
    /**
     * the contents of the file being sent
     */
    files?: Array<MessageFile>,
    /**
     * attachment objects with filename and description
     */
    attachments?: Array<Attachment>,
    /**
     * message flags combined as a bitfield (only SUPPRESS_EMBEDS can be set)
     */
    flags?: number,
    /**
     * name of thread to create (requires the webhook channel to be a forum channel)
     */
    thread_name?: string
}

export interface LoginOptions {
    intents: Array<number> | number
}
export interface CreateWebhookOptions {
    avatar?: string | Buffer,
    name: string,
}

export interface Guild {
    /**
     * guild id
     */
    id: string,
    /**
     * guild name
     */
    name: string,
    /**
     * icon hash
     */
    icon: string | null,
    /**
     * icon hash, returned when in the template object
     */
    icon_hash?: string | null,
    /**
     * splash hash
     */
    splash: string | null,
    /**
     * discovery splash hash; only present for guilds with the "DISCOVERABLE" feature
     */
    discovery_splash: string | null,
    /**
     * true if the user is the owner of the guild
     */
    owner?: boolean,
    /**
     * id of owner
     */
    owner_id: string,
    /**
     * total permissions for the user in the guild (EXCLUDES OVERWRITES)
     */
    permissions: string,
}


export enum PremiumTypes {
    None,
    NitroClassic,
    Nitro
}
export interface User {
    id: string,
    /**
     * the user's id
     */
    username: string,
    /**
     * the user's username, not unique across the platform
     */
    discriminator: string,
    /**
     * the user's 4-digit discord-tag
     */
    avatar?: string,
    /**
     * the user's avatar hash
     * https://cdn.discordapp.com/<hash>.<format>?size=<size>
     */
    bot?: boolean,
    /**
     * whether the user belongs to an OAuth2 application
     */
    system?: boolean,
    /**
     * whether the user is an Official Discord System user (part of the urgent message system)
     */
    mfa_enabled?: boolean,
    /**
     * whether the user has two factor enabled on their account
     */
    banner?: string,
    /**
     * the user's banner hash
     */
    accent_color?: number,
    /**
     * the user's banner color encoded as an integer representation of hexadecimal color code
     */
    locale?: string,
    /**
     * the user's chosen language option
     */
    verified?: boolean,
    /**
     * whether the email on this account has been verified
     */
    email?: string,
    /**
     * the user's email
     */
    flags?: number,
    /**
     * the flags on a user's account
     */
    premium_type?: PremiumTypes,
    /**
     * the type of Nitro subscription on a user's account
     */
    public_flags?: number
    /**
     * the public flags on a user's account
     */
}
export interface Role {

}
export interface Attachment {
    id: string,
    /**
     * attachment id
     */
    filename?: string,
    /**
     * name of file attached
     */
    description?: string,
    /**
     * description for the file (max 1024 characters)
     */
    content_type?: string,
    /**
     * the attachment's media/MIME type
     * https://en.wikipedia.org/wiki/Media_type
     */
    size?: number,
    /**
     * size of file in bytes
     */
    url?: string,
    /**
     * source url of file
     */
    proxy_url?: string,
    /**
     * 	a proxied url of file
     */
    height?: number,
    /**
     * height of file (if image)
     */
    width?: number,
    /**
     * width of file (if image)
     */
    ephemeral?: number,
    /**
     * 	whether this attachment is ephemeral
     */
}
export interface Embed {
    
}
export interface Emoji {

}
export interface Overwrite {
    id: string,
    /**
     * 0 (role) or 1 (member)
     */
    type: number, 
    /**
     * permission bit set
     */
    allow: string,
    /**
     * permission bit set
     */
    deny: string,
} 
export interface Reaction {
    count: number,
    /**
     * times this emoji has been used to react
     */
    me: boolean,
    /**
     * whether the current user reacted using this emoji
     */
    emoji: Emoji
    /**
     * emoji information (PARTIAL)
     */
}
export enum MessageActivityTypes {
    JOIN = 1,
    SPECTATE = 2,
    LISTEN = 3,
    JOIN_REQUEST = 5
}
export interface MessageActivity {
    type: MessageActivityTypes,
    party_id?: string
}
export interface Application {

}
export interface MessageReference {
    message_id?: string,
    channel_id?: string,
    guild_id?: string,
    fail_if_not_exists?: string
}

export enum ChannelTypes {
    GUILD_TEXT,
    DM,
    GUILD_VOICE,
    GROUP_DM,
    GUILD_CATEGORY,
    GUILD_ANNOUNCEMENT,
    ANNOUNCEMENT_THREAD,
    PUBLIC_THREAD,
    PRIVATE_THREAD,
    GUILD_STAGE_VOICE,
    GUILD_DIRECTORY,
    GUILD_FORUM
}
export enum ChannelFlags {
    PINNED = 1 << 1,
    REQUIRE_TAG = 1 << 4
}
export interface ThreadMetadata {
    
}
export interface ThreadMember {

}
export interface ForumTag {

}
export interface DefaultReaction {

}

export interface Channel {
    /**
     * the id of this channel
     */
    id: string,
    /**
     * the type of channel
     */
    type: number,
    /**
     * the id of the guild (may be missing for some channel objects received over gateway guild dispatches)
     */
    guild_id?: string,
    /**
     * sorting position of the channel
     */
    position?: number,
    /**
     * explicit permission overwrites for members and roles
     */
    permission_overwrites?: Overwrite[],
    /**
     * the name of the channel (1-100 characters)
     */
    name?: string,
    /**
     * the channel topic (0-4096 characters for GUILD_FORUM channels, 0-1024 characters for all others)
     */
    topic?: string,
    /**
     * whether the channel is nsfw
     */
    nsfw?: boolean,
    /**
     * the id of the last message sent in this channel (or thread for GUILD_FORUM channels) (may not point to an existing or valid message or thread)
     */
    last_message_id?: string,
    /**
     * the bitrate (in bits) of the voice channel
     */
    bitrate?: number,
    /**
     * the user limit of the voice channel
     */
    user_limit?: number,
    /**
     * amount of seconds a user has to wait before sending another message (0-21600); bots, as well as users with the permission manage_messages or manage_channel, are unaffected
     */
    rate_limit_per_user?: number,
    /**
     * the recipients of the DM
     */
    recipients?: Array<User>,
    /**
     * icon hash of the group DM
     */
    icon?: string,
    /**
     * id of the creator of the group DM or thread
     */
    owner_id?: string,
    /**
     * application id of the group DM creator if it is bot-created
     */
    application_id?: string,
    /**
     * for guild channels: id of the parent category for a channel (each parent category can contain up to 50 channels), for threads: id of the text channel this thread was created
     */
    parent_id?: string | null,
    /**
     * when the last pinned message was pinned. This may be null in events such as GUILD_CREATE when a message is not pinned.
     */
    last_pin_timestamp?: string,
    /**
     * voice region id for the voice channel, automatic when set to null
     */
    rtc_region?: string | null,
    /**
     * the camera video quality mode of the voice channel, 1 when not present
     */
    video_quality_mode?: number,
    /**
     * number of messages (not including the initial message or deleted messages) in a thread.
     */
    message_count?: number,
    /**
     * an approximate count of users in a thread, stops counting at 50
     */
    member_count?: number,
    /**
     * thread-specific fields not needed by other channels
     */
    thread_metadata?: ThreadMetadata,
    /**
     * thread member object for the current user, if they have joined the thread, only included on certain API endpoints
     */
    member?: ThreadMember,
    /**
     * default duration, copied onto newly created threads, in minutes, threads will stop showing in the channel list after the specified period of inactivity, can be set to: 60, 1440, 4320, 10080
     */
    default_auto_archive_duration?: number,
    /**
     * computed permissions for the invoking user in the channel, including overwrites, only included when part of the resolved data received on a slash command interaction
     */
    permissions?: string,
    /**
     * channel flags combined as a bitfield
     */
    flags?: number,
    /**
     * number of messages ever sent in a thread, it's similar to message_count on message creation, but will not decrement the number when a message is deleted
     */
    total_message_sent?: number,
    /**
     * the set of tags that can be used in a GUILD_FORUM channel
     */
    available_tags?: Array<ForumTag>,
    /**
     * the IDs of the set of tags that have been applied to a thread in a GUILD_FORUM channel
     */
    applied_tags?: Array<string>,
    /**
     * the emoji to show in the add reaction button on a thread in a GUILD_FORUM channel
     */
    default_reaction_emoji?: DefaultReaction,
    /**
     * the initial rate_limit_per_user to set on newly created threads in a channel. this field is copied to the thread at creation time and does not live update.
     */
    default_thread_rate_limit_per_user?: number,
    /**
     * 	the default sort order type used to order posts in GUILD_FORUM channels. Defaults to null, which indicates a preferred sort order hasn't been set by a channel admin
     */
    default_sort_order?: number | null,
}


export interface MessageComponent {

}
export interface MessageSticker {

}
export interface Sticker {

}

export interface ChannelMention {
    id: string,
    guild_id: string,
    type: number,
    name: string
}

export enum MessageFlags {
    CROSSPOSTED = 1 << 0,
    IS_CROSSPOST = 1 << 1,
    SUPPRESS_EMBEDS = 1 << 2,
    SOURCE_MESSAGE_DELETED = 1 << 3,
    URGENT = 1 << 4,
    HAS_THREAD = 1 << 5,
    EPHEMERAL = 1 << 6,
    LOADING = 1 << 7,
    FAILED_TO_MENTION_SOME_ROLES_IN_THREAD = 1 << 8
}
export enum MessageTypes {
    DEFAULT,
    RECIPIENT_ADD,
    RECIPIENT_REMOVE,
    CALL,
    CHANNEL_NAME_CHANGE,
    CHANNEL_ICON_CHANGE,
    CHANNEL_PINNED_MESSAGE,
    USER_JOIN,
    GUILD_BOOST,
    GUILD_BOOST_TIER_1,
    GUILD_BOOST_TIER_2,
    GUILD_BOOST_TIER_3,
    CHANNEL_FOLLOW_ADD,
    GUILD_DISCOVERY_DISQUALIFIED,
    GUILD_DISCOVERY_REQUALIFIED,
    GUILD_DISCOVERY_GRACE_PERIOD_INITIAL_WARNING,
    GUILD_DISCOVERY_GRACE_PERIOD_FINAL_WARNING,
    THREAD_CREATED,
    REPLY,
    CHAT_INPUT_COMMAND,
    THREAD_STARTER_MESSAGE,
    GUILD_INVITE_REMINDER,
    CONTEXT_MENU_COMMAND,
    AUTO_MODERATION_ACTION,
}


export interface Message {
    /**
     * id of the message
     */
    id: string,
    /**
     * id of the channel the message was sent in
     */
    channel_id: string,
    /**
     * the author of this message (not guaranteed to be a valid user, see below)
     */
    author: User,
    /**
     * contents of the message
     */
    content: string,
    /**
     * when this message was sent
     */
    timestamp: string,
    /**
     * when this message was edited (or null if never)
     */
    edited_timestamp?: string,
    /**
     * whether this was a TTS message
     */
    tts: boolean,
    /**
     * whether this message mentions everyone
     */
    mention_everyone: boolean,
    /**
     * users specifically mentioned in the message
     */
    mentions: Array<User>,
    /**
     * roles specifically mentioned in this message
     */
    mention_roles: Array<string>,
    /**
     * channels specifically mentioned in this message
     */
    mention_channels?: Array<ChannelMention>,
    /**
     * any attached files
     */
    attachments: Array<Attachment>,
    /**
     * any embedded content
     */
    embeds: Array<Embed>,
    /**
     * reactions to the message
     */
    reactions?: Array<Reaction>,
    /**
     * used for validating a message was sent
     */
    nonce?: string | number,
    /**
     * whether this message is pinned
     */
    pinned: boolean,
    /**
     * if the message is generated by a webhook, this is the webhook's id
     */
    webhook_id?: string,
    /**
     * type of message
     */
    type: MessageTypes,
    /**
     * sent with Rich Presence-related chat embeds
     */
    activity?: MessageActivity,
    /**
     * sent with Rich Presence-related chat embeds
     */
    application?: Application,
    /**
     * if the message is an Interaction or application-owned webhook, this is the id of the application
     */
    application_id?: string,
    /**
     * data showing the source of a crosspost, channel follow add, pin, or reply message
     */
    message_reference?: MessageReference,
   /**
     * message flags combined as a bitfield
     */
    flags?: number,
    /**
     * the message associated with the message_reference
     */
    referenced_message?: Message,
    /**
     * sent if the message is a response to an Interaction
     */
    interaction?: boolean,
    /**
     * the thread that was started from this message, includes thread member object
     */
    thread?: Channel,
    /**
     * sent if the message contains components like buttons, action rows, or other interactive components
     */
    components?: Array<MessageComponent>,
    /**
     * sent if the message contains stickers
     */
    sticker_items?: Array<MessageSticker>,
    /**
     *  @deprecated
     * 	the stickers sent with the message
     */
    stickers?: Sticker,
    /**
     * approximate position of the message in a thread
     * A generally increasing integer (there may be gaps or duplicates) that represents the approximate position of the message in a thread, it can be used to estimate the relative position of the message in a thread in company with total_message_sent on parent thread
     */
    position?: number,
}

export enum WebhookTypes {
    /**
     * Incoming Webhooks can post messages to channels with a generated token
     */
    Incoming = 1,
    /**
     * Channel Follower Webhooks are internal webhooks used with Channel Following to post new messages into channels
     */
    ChannelFollower = 2,
    /**
     * Application webhooks are webhooks used with Interactions
     */
    Application = 3
}

export interface Webhook {
    id: string,
    /**
     * the id of the webhook
     */
    type: WebhookTypes,
    /**
     * the type of the webhook
     */
    guild_id?: string | null,
    /**
     * the guild id this webhook is for, if any
     */
    channel_id: string,
    /**
     * the channel id this webhook is for, if any
     */
    user?: User | null,
    /**
     * the user this webhook was created by (not returned when getting a webhook with its token)
     */
    name: string,
    /**
     * the default name of the webhook
     */
    avatar: string,
    /**
     * the default user avatar hash of the webhook
     */
    token?: string | null,
    /**
     * the secure token of the webhook (returned for Incoming Webhooks)
     */
    application_id: string | null,
    /**
     * the bot/OAuth2 application that created this webhook
     */
    source_guild?: string,
    /**
     * the guild of the channel that this webhook is following (returned for Channel Follower Webhooks)
     */
    source_channel?: Channel,
    /**
     * the channel that this webhook is following (returned for Channel Follower Webhooks)
     */
    url?: string
    /**
     * the url used for executing the webhook (returned by the webhooks OAuth2 flow)
     */

}

export interface UnavailableGuild {
    id: string,
    unavailable: true
}

export interface Ready {
    /**
     * API version
     */
    v: number,
    /**
     * Information about the user including email
     */
    user: User,
    /**
     * Guilds the user is in
     */
    guilds: Array<UnavailableGuild>,
    /**
     * Used for resuming connections
     */
    session_id: string,
    /**
     * Gateway URL for resuming connections
     */
    resume_gateway_url: string,
    /**
     * Shard information associated with this session, if sent when identifying
     */
    shard?: Array<Number>[2],
    /**
     * Contains id and flags
     */
    application: Application
}

export interface PartialMember {
    id: string
}

export interface MessageCreate extends Message {
    guild_id?: string,
    member?: PartialMember,
    mentions: Array<User>
}

export interface MemberUpdate {
    guild_id: string,
    roles: Array<string>,
    user: User,
    nick?: string | null,
    avatar: string | null,
    joined_at: string | null,
    premium_since?: string | null,
    deaf?: boolean,
    mute?: boolean,
    pending?: boolean,
    communication_disabled_until?: string | null,
}

export interface Member {
    /**
     * the user this guild member represents
     * won't be included in the member object attached to MESSAGE_CREATE and MESSAGE_UPDATE gateway events.
     */
    user?: User,
    /**
     * 	this user's guild nickname
     */
    nick?: string | null,
    /**
     * 	the member's guild avatar hash
     */
    avatar?: string | null,
    /**
     * array of role object ids
     */
    roles: Array<string>,
    /**
     * 	when the user joined the guild
     */
    joined_at: string,
    /**
     * 	when the user started boosting the guild
     */
    premium_since?: string | null,
    /**
     * 	whether the user is deafened in voice channels
     */
    deaf: boolean,
    /**
     * 	whether the user is muted in voice channels
     */
    mute: boolean,
    /**
     * 	whether the user has not yet passed the guild's Membership Screening requirements
     */
    pending?: boolean,
    /**
     * total permissions of the member in the channel, including overwrites, ONLY returned when in the interaction object
     */
    permissions?: string,
    /**
     * 	when the user's timeout will expire and the user will be able to communicate in the guild again, null or a time in the past if the user is not timed out
     */
    communication_disabled_until?: string | null
}

export interface MemberCreated extends Member {
    guild_id: string
}
export interface MemberRemoved extends Member {
    guild_id: string,
    user: User
}