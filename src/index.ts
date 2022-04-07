import {AvailableIntentsEventsEnum, IMessage} from "qq-guild-bot";
import {ws} from "./environment";
import {Replier, reply} from "./autoreply";
import {atUser, deciding, getRandomPhoto, randomOf} from "./util";
import {config} from "./config";
import {startSchedule} from "./schedule";

const userSet = new Set<string>();

const replyPlainGreeting = (greetings: Array<string>) => {
    return (userMessage: IMessage) => {
        if (userMessage.author.id !== config.kisinId) {
            if (userSet.has(userMessage.author.id)) {
                reply(
                    userMessage,
                    {
                        content: `${atUser(userMessage)} <emoji:97>（宁宁对你的讨厌程度好像上升了。）`
                    },
                    {
                        onSuccess: () => console.log(`Reject: ${userMessage.author.username} responded ${greetings}.`),
                        onFailure: () => console.log(`Rejecting Failure: ${userMessage.author.username} responded ${greetings}.`)
                    }
                );
                return;
            }
            userSet.add(userMessage.author.id);
            setTimeout(() => {
                userSet.delete(userMessage.author.id);
            }, config.greetingColdDown);
        }
        const greeting = randomOf(greetings);
        reply(
            userMessage,
            {
                content: `${atUser(userMessage)} ${greeting}`,
            },
            {
                onSuccess: () => console.log(`Success: ${userMessage.author.username} responded ${greeting}.`),
                onFailure: () => console.log(`Failure: ${userMessage.author.username} responded ${greeting}.`),
            }
        );
    };
};

const replier: Replier = {
    whenExcludedUser: () => {
        return;
    },
    whenExcludedChannel: userMessage => {
        reply(
            userMessage,
            {
                content: `${atUser(userMessage)} 不要在这个子频道索取哦，宁宁揍揍你！`
            },
            {
                onSuccess: () => console.log(`Rejected ${userMessage.author.username} in channel ${userMessage.channel_id} for the channel has been excluded`)
            }
        );
    },
    exception: userMessage => {
        reply(
            userMessage,
            {
                content: `${atUser(userMessage)} 也不知道你想说啥-_-|||让宁宁查询下你闲的程度试试`
            },
            {}
        );
    },
    replyPatterns: [
        {
            commandName: deciding("photo", "/来点宁宁"),
            response: userMessage => {
                getRandomPhoto().then(photoInfo => {
                    reply(
                        userMessage,
                        {
                            content: `${atUser(userMessage)} 这是本图片第${photoInfo.frequency}次出现哦！\n${photoInfo.description}`,
                            image: photoInfo.path,
                        },
                        {
                            onSuccess: () => console.log(`Success: ${userMessage.author.username} retrieving ${photoInfo.path}`),
                            onFailure: () => console.log(`Failure: ${userMessage.author.username} retrieving ${photoInfo.path}`),
                        }
                    );
                });
            }
        },
        {
            commandName: deciding("morning", "早上好"),
            response: replyPlainGreeting(["早安早安~", "早上好捏~"]),
        },
        {
            commandName: deciding("noon", "中午好"),
            response: replyPlainGreeting(["中午好哦~", "午安！"]),
        },
        {
            commandName: deciding("evening", "晚上好"),
            response: replyPlainGreeting(["晚儿好晚儿好~", "好好好，吃过饭了不？"]),
        },
        {
            commandName: deciding("night", "晚安"),
            response: replyPlainGreeting(["晚安噜~", "おやすみなさい～"]),
        },
        {
            commandName: deciding("mua", "mua"),
            response: replyPlainGreeting(["mua~", "不可以随便mua的说！那……那那那那，mua……"]),
        }
    ]
};

ws.on(AvailableIntentsEventsEnum.AT_MESSAGES, async (event: { msg: IMessage }) => {
    console.log(event);
    const userMessage = event.msg;
    if (config.excludedUsers.includes(userMessage.author.id)) {
        replier.whenExcludedUser(userMessage);
        return;
    }
    if (config.excludedChannels.includes(userMessage.channel_id)) {
        replier.whenExcludedChannel(userMessage);
        return;
    }
    let responded = false;
    for (const replyPattern of replier.replyPatterns) {
        if (userMessage.content.includes(replyPattern.commandName(config.mode))) {
            replyPattern.response(userMessage);
            responded = true;
            break;
        }
    }
    if (!responded) {
        replier.exception(userMessage);
    }
});

startSchedule();
