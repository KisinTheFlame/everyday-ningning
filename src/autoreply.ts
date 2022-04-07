import {IMessage, MessageToCreate} from "qq-guild-bot";
import {config} from "./config";
import {client} from "./environment";

interface ReplyOptions {
    onSuccess?: () => void,
    onFailure?: () => void,
    shouldRetry?: boolean,
    timeToTry?: number
}

export function reply(
    userMessage: IMessage,
    message: MessageToCreate,
    options: ReplyOptions
) {
    const messageToCreateBase: MessageToCreate = {msg_id: userMessage.id};
    client
        .messageApi
        .postMessage(
            userMessage.channel_id,
            Object.assign(message, messageToCreateBase),
        )
        .then(() => {
            if (options.onSuccess !== undefined) {
                options.onSuccess();
            }
        })
        .catch(reason => {
            console.log(reason);
            if (options.onFailure !== undefined) {
                options.onFailure();
            }
            if (options.shouldRetry === undefined || options.shouldRetry) {
                const timeToTry = options.timeToTry !== undefined ? options.timeToTry : config.maxTimeToTry;
                if (timeToTry > 0) {
                    reply(userMessage, message, {
                        onSuccess: options.onSuccess,
                        onFailure: options.onFailure,
                        shouldRetry: options.shouldRetry,
                        timeToTry: timeToTry - 1
                    });
                }
            }
        });
}

type Response = (userMessage: IMessage) => void;

export interface ReplyPattern {
    commandKeyword: (mode: string) => string | Array<string>,
    response: Response,
}

export interface Replier {
    whenExcludedUser: Response,
    whenExcludedChannel: Response,
    exception: Response,
    replyPatterns: Array<ReplyPattern>,
}
