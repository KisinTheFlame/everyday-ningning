export const environment: Environment = {
    appID: "101996873",
    token: "EzS8aRVNyGIXMJMEQNpl4pHWi4igN7rv",
    sandbox: process.env.NODE_ENV === "development",
    postChannel: "3370836",
    maxTimeToTry: 10,
    excludedChannels: [
        "4432291", // 页友专区
    ],
    command: (
        process.env.NODE_ENV === "development" ?
            {
                getPhoto: "photo",
                playMusic: "music"
            } :
            {
                getPhoto: "/来点宁宁",
                playMusic: "/唱给宁听"
            }
    ),
    schedules: [
        {
            cronExpression: "0 7 * * *",
            greetings: ["早上好！昨天睡得好吗？宁宁也和你问好！要记得吃早餐哦！"],
        },
        {
            cronExpression: "0 12 * * *",
            greetings: ["中午好哦，已经吃过中饭了吗？一顿不吃会饿得慌哦！"],
        },
        {
            cronExpression: "0 18 * * *",
            greetings: ["晚儿好晚儿好，吃过饭了嘛？猜猜今天宁宁会来直播嘛？"],
        },
        {
            cronExpression: "0 0 * * *",
            greetings: ["大家在看直播吗？明天有工作和早课的脆鲨们早点睡觉哦！"],
        },
    ],
};

export interface Schedule {
    cronExpression: string,
    greetings: Array<string>,
}

export interface Environment {
    appID: string,
    token: string,
    sandbox: boolean,
    postChannel: string,
    maxTimeToTry: number,
    excludedChannels: Array<string>,
    command: {
        getPhoto: string,
        playMusic: string,
    },
    schedules: Array<Schedule>
}
