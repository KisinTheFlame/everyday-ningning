import {IMessage, MessageToCreate} from "qq-guild-bot";
import {config} from "../config";
import {client} from "../environment";
import {atUser, randomOf} from "../util";

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
            if (reason.code === 304003) { // url not allowed
                console.log(`Failure: ${message.content} with url not allowed.`);
                reply(
                    userMessage,
                    {
                        content: "出错了呜呜呜，好像是内容里带了链接的原因。重试一下吧！"
                    },
                    {}
                );
                return;
            } else if (reason.code === 2000004) {
                console.log(`Failure: photo detected sexy: ${message.image}`);
                reply(
                    userMessage,
                    {
                        content: "出错了呜呜呜，腾子图片审核没通过。重试一下吧！"
                    },
                    {}
                );
                return;
            }
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
                } else {
                    reply(
                        userMessage,
                        {
                            content: `${atUser(userMessage)}，斯米马赛，腾子司马马了。`
                        },
                        {
                            shouldRetry: false
                        },
                    );
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

export const replyPlainGreeting = (greetings: Array<string>, imageUrl?: string) => {
    return (userMessage: IMessage) => {
        const greeting = randomOf(greetings);
        reply(
            userMessage,
            Object.assign<MessageToCreate, MessageToCreate>(
                {
                    content: `${atUser(userMessage)} ${greeting}`,
                },
                imageUrl === undefined ? {} : {image: imageUrl}
            ),
            {
                onSuccess: () => console.log(`Success: ${userMessage.author.username} responded ${greeting}.`),
                onFailure: () => console.log(`Failure: ${userMessage.author.username} responded ${greeting}.`),
            }
        );
    };
};
