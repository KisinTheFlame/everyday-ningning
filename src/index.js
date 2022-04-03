import {createOpenAPI, createWebsocket} from "qq-guild-bot";
import cron from "node-cron";
import axios from "axios";

const backendPrefix = "https://ning.kisin.tech/api";
axios.defaults.baseURL = backendPrefix;

const config = {
    appID: "101996873",
    token: "EzS8aRVNyGIXMJMEQNpl4pHWi4igN7rv",
    sandbox: true,
};

const postChannelId = "3869931";

const client = createOpenAPI(config);
const ws = createWebsocket(config);

async function getRandomPhoto() {
    const {data} = await axios.post("/get-random-photo");
    const path = backendPrefix + "/ning/" + data.filename;
    const description = data.description;
    return {
        path: path,
        description: description
    };
}

ws.on("AT_MESSAGES", async event => {
    console.log(event);
    const message = event.msg;
    if (message.content.indexOf("/来点宁宁") !== -1) {
        const {path, description} = await getRandomPhoto();
        await client.messageApi.postMessage(message.channel_id, {
            content: description,
            image: path,
            msg_id: message.id
        });
        console.log(message.author.username + "得到了图片" + path);
    }
});

function generatePushFunction(greeting) {
    return async () => {
        const {path, description} = await getRandomPhoto();
        await client.messageApi.postMessage(postChannelId, {
            content: greeting + "\n" + description,
            image: path
        });
    };
}

cron.schedule(
    "0 7 * * *",
    generatePushFunction("早上好！昨天睡得好吗？宁宁也和你问好！"),
    {}
);

cron.schedule(
    "0 12 * * *",
    generatePushFunction("中午好哦，已经吃过中饭了吗？一顿不吃会饿得慌哦！"),
    {}
);

cron.schedule(
    "0 18 * * *",
    generatePushFunction("晚儿好晚儿好，猜猜今天宁宁会来直播嘛？"),
    {}
);
