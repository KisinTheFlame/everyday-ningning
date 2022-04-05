import {IMessage} from "qq-guild-bot";

export function atUser(userMessage: IMessage) {
    return `<@!${userMessage.author.id}>`;
}
