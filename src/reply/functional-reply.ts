import {reply, ReplyPattern} from "./base-reply";
import {announceFrequency, atUser, deciding, excludeChannel, getRandomPhoto, randomOf} from "../util";
import {config} from "../config";
import {getWeiboData, Weibo, weiboToString} from "./weibo-reply";
import {client} from "../environment";

let weiboColdDown = true;

export const functionalReplyPatterns: Array<ReplyPattern> = [
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
            const {data} = await client.guildApi.guildMembers(userMessage.guild_id, {after: "0", limit: 1000});
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
        commandKeyword: deciding("ban-user", "/封禁用户"),
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
            const userId = args[2];
            config.excludedUsers.add(userId);
            setTimeout(() => {
                config.excludedUsers.delete(userId);
            }, 1000 * 60 * 60 * 8);
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
        commandKeyword: deciding("weibo", "/来点微博"),
        response: async userMessage => {
            if (weiboColdDown) {
                weiboColdDown = false;
                setTimeout(() => {
                    weiboColdDown = true;
                }, 60000);
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
                        content: `${atUser(userMessage)} 微博冷却中，冷却一分钟哦！`
                    },
                    {}
                );
            }
        }
    }
];
