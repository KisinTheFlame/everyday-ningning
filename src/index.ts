import {AvailableIntentsEventsEnum, IMessage} from "qq-guild-bot";
import {ws} from "./environment";
import {Replier, reply} from "./reply/base-reply";
import {atUser} from "./util";
import {config, readExcludedChannels} from "./config";
import {startSchedule} from "./schedule";
import {simpleReplyPatterns} from "./reply/simple-reply";
import {functionalReplyPatterns} from "./reply/functional-reply";

(async () => {
    config.excludedChannels = await readExcludedChannels();

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
        replyPatterns: []
    };

    replier.replyPatterns.push(...functionalReplyPatterns);
    replier.replyPatterns.push(...simpleReplyPatterns);


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
})();
