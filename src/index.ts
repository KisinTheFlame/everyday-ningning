import {AvailableIntentsEventsEnum, createOpenAPI, createWebsocket, IMessage, MessageToCreate} from "qq-guild-bot";
import * as cron from "node-cron";
import axios from "axios";
import {environment} from "../config";
import {atUser} from "./util";

const backendPrefix = "https://ning.kisin.tech/api";
axios.defaults.baseURL = backendPrefix;

const config = {
    appID: environment.appID,
    token: environment.token,
    intents: [AvailableIntentsEventsEnum.AT_MESSAGES],
    sandbox: environment.sandbox
};

const postChannelId = environment.postChannel;

const client = createOpenAPI(config);
const ws = createWebsocket(config);

function getRandomPhoto() {
    return axios
        .post("/get-random-photo")
        .then((response: { data: { filename: string, description: string, frequency: number } }) => {
            const data = response.data;
            const path = backendPrefix + "/ning/" + data.filename;
            const description = data.description;
            const frequency = data.frequency;
            return {
                path: path,
                description: description,
                frequency: frequency
            };
        });
}

interface ReplyOptions {
    onSuccess?: () => void,
    onFailure?: () => void,
    shouldRetry?: boolean,
    timeToTry?: number
}

function reply(
    userMessage: IMessage,
    message: MessageToCreate,
    options: ReplyOptions
) {
    const onSuccess = options.onSuccess;
    const onFailure = options.onFailure;
    const shouldRetry = options.shouldRetry;
    const messageToCreateBase: MessageToCreate = {msg_id: userMessage.id};
    client
        .messageApi
        .postMessage(
            userMessage.channel_id,
            Object.assign(message, messageToCreateBase),
        )
        .then(() => {
            if (onSuccess !== undefined) {
                onSuccess();
            }
        })
        .catch(reason => {
            console.log(reason);
            if (onFailure !== undefined) {
                onFailure();
            }
            if (shouldRetry) {
                const timeToTry = options.timeToTry !== undefined ? options.timeToTry : environment.maxTimeToTry;
                if (timeToTry > 0) {
                    reply(userMessage, message, {
                        onSuccess: onSuccess,
                        onFailure: onFailure,
                        shouldRetry: shouldRetry,
                        timeToTry: timeToTry - 1
                    });
                }
            }
        });
}

function postPhoto(userMessage: IMessage, photoInfo: { frequency: number, description: string, path: string }) {
    reply(
        userMessage,
        {
            content: `${atUser(userMessage)} 这是本图片第${photoInfo.frequency}次出现哦！\n${photoInfo.description}`,
            image: photoInfo.path,
        },
        {
            onSuccess: () => console.log(`Success: ${userMessage.author.username} retrieving ${photoInfo.path}`),
            onFailure: () => console.log(`Failure: ${userMessage.author.username} retrieving ${photoInfo.path}`)
        }
    );
}

function warnExcludedChannel(userMessage: IMessage) {
    reply(
        userMessage,
        {
            content: `${atUser(userMessage)} 不要在这个子频道索取哦，宁宁揍揍你！`
        },
        {
            onSuccess: () => console.log(`Rejected ${userMessage.author.username} in channel ${userMessage.channel_id}`)
        }
    );
}

ws.on(AvailableIntentsEventsEnum.AT_MESSAGES, async (event: { msg: IMessage }) => {
    console.log(event);
    const userMessage = event.msg;
    if (environment.excludedChannels.includes(userMessage.channel_id)) {
        warnExcludedChannel(userMessage);
        return;
    }
    if (userMessage.content.includes(environment.command.getPhoto)) {
        getRandomPhoto().then(photoInfo => {
            postPhoto(userMessage, photoInfo);
        });
    } else if (userMessage.content.includes(environment.command.playMusic)) {
        //
    }
});

function generatePushFunction(greetings: Array<string>) {
    const random = (array: Array<string>) => {
        return array
            .map(value => {
                return {
                    str: value,
                    weight: Math.random(),
                };
            })
            .reduce((previousValue, currentValue) => {
                return previousValue.weight > currentValue.weight ? previousValue : currentValue;
            })
            .str;
    };

    return async () => {
        const {path, description, frequency} = await getRandomPhoto();
        await client.messageApi.postMessage(postChannelId, {
            content: `${random(greetings)}\n这是本图片第${frequency}\n${description}`,
            image: path,
        });
    };
}

environment.schedules.forEach(schedule => {
    cron.schedule(
        schedule.cronExpression,
        generatePushFunction(schedule.greetings),
        {}
    );
});
