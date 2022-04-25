import {client, ws} from "./environment";
import {config} from "./config";

const content =
`
古戸絵梨花

2022年4月25日17时04分
`.trim();

client.messageApi.postMessage(
    config.postChannel,
    {
        content: content
    }
);

ws.disconnect();
