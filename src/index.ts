import {AvailableIntentsEventsEnum, IMessage} from "qq-guild-bot";
import {ws} from "./environment";
import {Replier, reply} from "./autoreply";
import {announceFrequency, atUser, deciding, getRandomPhoto, randomOf} from "./util";
import {config} from "./config";
import {startSchedule} from "./schedule";

// const userSet = new Set<string>();

const replyPlainGreeting = (greetings: Array<string>) => {
    return (userMessage: IMessage) => {
        // if (userMessage.author.id !== config.kisinId) {
        //     if (userSet.has(userMessage.author.id)) {
        //         reply(
        //             userMessage,
        //             {
        //                 content: `${atUser(userMessage)} <emoji:97>（宁宁对你的讨厌程度好像上升了。）`
        //             },
        //             {
        //                 onSuccess: () => console.log(`Reject: ${userMessage.author.username} responded ${greetings}.`),
        //                 onFailure: () => console.log(`Rejecting Failure: ${userMessage.author.username} responded ${greetings}.`)
        //             }
        //         );
        //         return;
        //     }
        //     userSet.add(userMessage.author.id);
        //     setTimeout(() => {
        //         userSet.delete(userMessage.author.id);
        //     }, config.greetingColdDown);
        // }
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
            commandKeyword: deciding("photosp", "图片搜寻"),
            response: userMessage => {
                if (userMessage.author.id !== config.kisinId) {
                    return;
                }
                const args = userMessage.content.split(" ");
                const imagePath = config.backendPrefix + "/ning/" + args[2];
                console.log(imagePath);
                reply(
                    userMessage,
                    {
                        content: "test photosp",
                        image: imagePath,
                    },
                    {}
                );
            }
        },
        {
            commandKeyword: deciding("photo", "/来点宁宁"),
            response: userMessage => {
                getRandomPhoto().then(photoInfo => {
                    reply(
                        userMessage,
                        {
                            content: `${atUser(userMessage)} ${announceFrequency(photoInfo.frequency)}\n${photoInfo.description}`,
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
            commandKeyword: deciding("morning", ["早上好", "早安"]),
            response: replyPlainGreeting([
                "早安早安~",
                "早上好捏~",
            ]),
        },
        {
            commandKeyword: deciding("noon", ["中午好", "午安"]),
            response: replyPlainGreeting([
                "中午好哦~",
                "午安！",
            ]),
        },
        {
            commandKeyword: deciding("evening", "晚上好"),
            response: replyPlainGreeting([
                "晚儿好晚儿好~",
                "好好好，吃过饭了不？",
            ]),
        },
        {
            commandKeyword: deciding("night", ["晚安", "おやすみ", "お休み", "night"]),
            response: replyPlainGreeting([
                "晚安噜~",
                "おやすみなさい～",
                "night night！",
            ]),
        },
        {
            commandKeyword: deciding(["mua", "亲亲"], ["mua", "亲亲", "亲我"]),
            response: replyPlainGreeting(["mua~", "不可以随便mua的说！那……那那那那，mua……"]),
        },
        {
            commandKeyword: deciding("mother", "妈"),
            response: replyPlainGreeting([
                "宝贝儿，妈妈在这里~",
                "乖，不哭不哭~你已经很棒了！",
                "注意休息呀宝贝儿，别累着了~",
                "要多少钱啊宝贝儿？",
                "怎么又闯祸啦！没事，我是你妈妈，有什么不敢说的？",
                "给你买了件新衣服宝贝儿，快试试合不合身~",
                "不痛不痛，让妈妈抱抱~",
                "蛋包饭做好了宝贝儿，快去洗手手吧~",
                "这么大了，还让妈妈哄着睡呢？这孩子~",
                "哎呀~妈妈给你买了新游戏，快来看看~",
                "尽力就行啦，你考多少分都是妈妈的骄傲！",
                "这么累干嘛呀？身体最重要，哎呀，没事！妈妈有钱，大不了妈妈养你一辈子！",
                "想吃这个吗？要不要多买几个？",
                "多大了还要妈妈帮你洗澡？哎呦…",
                "不行！太危险了，你给我回来！",
                "妈妈只有你了，你出了什么事妈妈也活不下去了！",
                "多大了还跟妈妈撒娇呢~",
                "我是你妈，我不疼你谁疼你啊~",
                "妈妈没别的要求，只要你健健康康的就行啦！",
                "脸嫩脏啊，快过来，妈妈给你洗洗！",
                "手好凉，怎么回事？别动，妈给你暖暖！",
            ]),
        }
    ]
};

ws.on(AvailableIntentsEventsEnum.AT_MESSAGES, async (event: { msg: IMessage & { message_reference: { message_id: string } } }) => {
    console.log(event);
    const userMessage = event.msg;
    if (userMessage.message_reference !== undefined) {
        return;
    }
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
        const commandKeyword = replyPattern.commandKeyword(config.mode);
        if (typeof commandKeyword === "string") {
            if (userMessage.content.includes(commandKeyword)) {
                replyPattern.response(userMessage);
                responded = true;
                break;
            }
        } else {
            for (const keyword of commandKeyword) {
                if (userMessage.content.includes(keyword)) {
                    replyPattern.response(userMessage);
                    responded = true;
                    break;
                }
            }
        }
        if (responded) {
            break;
        }
    }
    if (!responded) {
        replier.exception(userMessage);
    }
});

startSchedule();
