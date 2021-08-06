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
}


export interface Student extends User {
    challangesDone: string[],
    starbalance: number,
    loginStreak: number,
    lastReward: number,
    gameresults: Result[],
    dailyloginreward: number,
    totalGamesWon: number,
}

export interface Teacher extends User {
    classtargets: Map<string, number>,
    classtargetBalance: number,
    individualtargets: Map<string, number>,
    dailyloginreward: number,
}

export interface Admin extends User {
}
