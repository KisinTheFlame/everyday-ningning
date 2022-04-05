import {AvailableIntentsEventsEnum, createOpenAPI, createWebsocket} from "qq-guild-bot";
import * as cron from "node-cron";
import axios from "axios";
import {GLOBAL_CONFIG} from "../config";

const backendPrefix = "https://ning.kisin.tech/api";
axios.defaults.baseURL = backendPrefix;

const config = {
    appID: GLOBAL_CONFIG.appID,
    token: GLOBAL_CONFIG.token,
    intents: [AvailableIntentsEventsEnum.AT_MESSAGES],
};

const postChannelId = GLOBAL_CONFIG.postChannel;

const client = createOpenAPI(config);
const ws = createWebsocket(config);

async function getRandomPhoto() {
    const {data} = await axios.post("/get-random-photo");
    const path = backendPrefix + "/ning/" + data.filename;
    const description = data.description;
    return {
        path: path,
        description: description,
    };
}

ws.on(AvailableIntentsEventsEnum.AT_MESSAGES, async event => {
    console.log(event);
    const message = event.msg;
    if (message.content.includes("/来点宁宁")) {
        if (GLOBAL_CONFIG.excludedChannels.includes(message.channel_id)) {
            await client
                .messageApi
                .postMessage(message.channel_id, {
                    content: "不要在这个子频道索取哦，宁宁揍揍你！",
                    msg_id: message.id,
                })
                .then(() => console.log("Rejected"))
                .catch(reason => console.log(reason));
            return;
        }

        const {path, description} = await getRandomPhoto();
        await client
            .messageApi
            .postMessage(message.channel_id, {
                content: "<@!" + message.author.id + "> " + description,
                image: path,
                msg_id: message.id,
            })
            .then(() => console.log("Success"))
            .catch(reason => console.log(reason));
    }
});

function generatePushFunction(greeting: string) {
    return async () => {
        const {path, description} = await getRandomPhoto();
        await client.messageApi.postMessage(postChannelId, {
            content: greeting + "\n" + description,
            image: path,
        });
    };
}

cron.schedule(
    "0 7 * * *",
    generatePushFunction("早上好！昨天睡得好吗？宁宁也和你问好！要记得吃早餐哦！"),
    {}
);

cron.schedule(
    "0 12 * * *",
    generatePushFunction("中午好哦，已经吃过中饭了吗？一顿不吃会饿得慌哦！"),
    {}
);

cron.schedule(
    "0 18 * * *",
    generatePushFunction("晚儿好晚儿好，吃过饭了嘛？猜猜今天宁宁会来直播嘛？"),
    {}
);

cron.schedule(
    "0 0 * * *",
    generatePushFunction("大家在看直播吗？明天有工作和早课的脆鲨们早点睡觉哦！"),
    {}
);
