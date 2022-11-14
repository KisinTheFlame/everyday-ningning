import {reply, ReplyPattern} from "./base-reply";
import {announceFrequency, atUser, deciding, excludeChannel, getRandomPhoto, randomOf} from "../util";
import {config} from "../config";
import {getWeiboData, Weibo, weiboToString} from "./weibo-reply";
import {client} from "../environment";
import axios from "axios";

const weiboColdDownTime = 60000;
let weiboColdDown = true;

export const functionalReplyPatterns: Array<ReplyPattern> = [
    {
        commandKeyword: deciding("push", "推送"),
        response: userMessage => {
            if (userMessage.author.id !== config.kisinId) {
                return;
            }
            const content = userMessage.content.replace(/.*?\n/, "");
            client
                .messageApi
                .postMessage(
                    config.postChannel,
                    {
                        content: content
                    }
                )
                .catch(reason => console.log(reason));
        }
    },
    {
        commandKeyword: deciding("search", "图片搜寻"),
        response: userMessage => {
            if (userMessage.author.id !== config.kisinId) {
                return;
            }
            const args = userMessage.content.split(" ");
            const imagePath = config.resourcePrefix + "/ning/" + args[2];
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
        commandKeyword: deciding("search-user", "/搜索用户"),
        response: async userMessage => {
            if (userMessage.author.id !== config.kisinId) {
                reply(
                    userMessage,
                    {
                        content: "你疑似不是我的主人捏～",
                    },
                    {}
                );
                console.log(`${userMessage.author.username} tried to search user`);
                return;
            }
            const args = userMessage.content.split(" ");
            const username = args[2];
            const {data} = await client.guildApi.guildMembers(config.guildId, {after: "0", limit: 1000});
            data.forEach((member) => {
                if (member.nick === username) {
                    reply(
                        userMessage,
                        {
                            content: `搜索到：${member.user.id}`,
                            image: member.user.avatar
                        },
                        {}
                    );
                }
            });
        }
    },
    {
        commandKeyword: deciding("ban-user", "封印"),
        response: async userMessage => {
            if (userMessage.author.id !== config.kisinId) {
                reply(
                    userMessage,
                    {
                        content: "你疑似不是我的主人捏～",
                    },
                    {}
                );
                return;
            }
            const args = userMessage.content.split(" ");
            const userId = args[2].replace("<@!", "").replace(">", "");
            const time = parseInt(args[3]);
            config.excludedUsers.add(userId);
            setTimeout(() => {
                config.excludedUsers.delete(userId);
            }, 1000 * 60 * time);
            reply(
                userMessage,
                {
                    content: "この人をご封印するのですか？もはや存じております！"
                },
                {}
            );
        }
    },
    {
        commandKeyword: deciding("ban-channel", "/排除子频道"),
        response: async userMessage => {
            if (userMessage.author.id !== config.kisinId) {
                reply(
                    userMessage,
                    {
                        content: "你疑似不是我的主人捏～"
                    },
                    {}
                );
                console.log(`${userMessage.author.username} tried to ban channel.`);
                return;
            }
            await excludeChannel(userMessage.channel_id);
        }
    },
    {
        commandKeyword: deciding("photo", "来点宁宁"),
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
        commandKeyword: deciding("weibo", "来点微博"),
        response: async userMessage => {
            if (weiboColdDown) {
                weiboColdDown = false;
                setTimeout(() => {
                    weiboColdDown = true;
                }, weiboColdDownTime);
                const weiboList = await getWeiboData();
                const weibo: Weibo = randomOf(weiboList);
                reply(
                    userMessage,
                    {
                        content: `${atUser(userMessage)}\n${weiboToString(weibo)}`,
                        image: weibo.avatar
                    },
                    {}
                );
                for (let i = 0; i < weibo.photos.length; i++) {
                    reply(
                        userMessage,
                        {
                            content: `p${i + 1}`,
                            image: weibo.photos[i]
                        },
                        {}
                    );
                }
            } else {
                reply(
                    userMessage,
                    {
                        content: `${atUser(userMessage)} 微博冷却中，冷却${weiboColdDownTime}毫秒哦！`
                    },
                    {}
                );
            }
        }
    },
    // {
    //     commandKeyword: deciding("pocket", "来点口袋"),
    //     response: userMessage => {
    //         axios
    //             .get(`http://114.215.126.86:8080/pocket/getRandom?channelId=${userMessage.channel_id}`)
    //             .then(value => {
    //                 console.log(`pocket request from ${userMessage.member.nick} get response code ${value.data.code}`);
    //             });
    //     }
    // }
    {
        commandKeyword: deciding("pocket", "来点口袋"),
        response: userMessage => {
            axios
                .get("http://114.215.126.86:8080/pocket/getRandom")
                .then(value =>
                    reply(
                        userMessage,
                        {
                            content: value.data.data.replace(/\[.*]/m, "")
                        },
                        {}
                    )
                );
        }
    }
];
