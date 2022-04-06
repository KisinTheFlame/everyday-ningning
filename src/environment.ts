import axios from "axios";
import {config} from "../config";
import {AvailableIntentsEventsEnum, createOpenAPI, createWebsocket} from "qq-guild-bot";

axios.defaults.baseURL = config.backendPrefix;

const botConfig = {
    appID: config.appID,
    token: config.token,
    intents: [AvailableIntentsEventsEnum.AT_MESSAGES],
    sandbox: config.sandbox
};

export const client = createOpenAPI(botConfig);
export const ws = createWebsocket(botConfig);
