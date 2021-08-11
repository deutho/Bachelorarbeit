import { Result } from "./result";

export interface User {
    uid: string,
    username: string,
    firstname: string,
    lastname: string,
    avatarID: string,
    role: number,
    parent: string,
    schoolclass: string,
    school: string,
    gender: string
}


export interface Student extends User {
    challangesDone: string[],
    starbalance: number,
    loginStreak: number,
    lastReward: number,
    lastRewardResetTime: number,
    gameresults: Result[],
    dailyloginreward: number,
    totalGamesWon: number,
}

export interface Teacher extends User {
    classtargets: Map<string, number>,
    classtargetBalance: number,
    classtargetAchieved: boolean,
    individualtargets: any,
    dailyloginreward: number,
}

export interface Admin extends User {
}
