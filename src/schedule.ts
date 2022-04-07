import * as cron from "node-cron";
import {announceFrequency, getRandomPhoto, randomOf} from "./util";
import {config} from "./config";
import {client} from "./environment";

interface Schedule {
    cronExpression: string,
    greetings: Array<string>,
}

const schedules: Array<Schedule> = [
    {
        cronExpression: "0 7 * * *",
        greetings: [
            "早上好！昨天睡得好吗？宁宁也和你问好！要记得吃早餐哦！",
        ],
    },
    {
        cronExpression: "0 12 * * *",
        greetings: [
            "中午好哦，已经吃过中饭了吗？一顿不吃会饿得慌哦！",
        ],
    },
    {
        cronExpression: "0 18 * * *",
        greetings: [
            "晚儿好晚儿好，吃过饭了嘛？猜猜今天宁宁会来直播嘛？",
        ],
    },
    {
        cronExpression: "0 23 * * *",
        greetings: [
            "大家在看直播吗？明天有工作和早课的脆鲨们早点睡觉哦！",
        ],
    },
];

function generatePushFunction(greetings: Array<string>) {
    return async () => {
        const {path, description, frequency} = await getRandomPhoto();
        await client
            .messageApi
            .postMessage(config.postChannel, {
                content: `${randomOf(greetings)}\n${announceFrequency(frequency)}\n${description}`,
                image: path,
            })
            .then(value => console.log(value))
            .catch(reason => console.log(reason));
    };
}

export function startSchedule() {
    schedules.forEach(schedule => {
        cron.schedule(
            schedule.cronExpression,
            generatePushFunction(schedule.greetings),
            {}
        );
    });
}
