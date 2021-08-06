import { Injectable } from "@angular/core";
import { Folder } from "../models/folder.model";
import { Result } from "../models/result";
import { Admin, Student, Teacher } from "../models/users.model";
import { FirestoreDataService } from "./firestore-data.service";

@Injectable({ providedIn: 'root' })
export class UserService {

    constructor(private afs: FirestoreDataService){}


    async depositStarsToUser(user: Student, amount: number) {
        let newAmount: number = user.starbalance + amount
        user.starbalance = newAmount

        let parent: Teacher = await this.afs.getUserPerID(user.parent);

        await this.afs.addUser(user, parent);

        this.checkForChallanges(user);
        
    }

    async depositStarsToClassTarget(user: Student, amount: number) {
        let parent: Teacher = await this.afs.getUserPerID(user.parent);

        let newAmount: number = parent.classtargetBalance + amount
        parent.classtargetBalance = newAmount

        let admin: Admin = await this.afs.getUserPerID(parent.parent);

        await this.afs.addUser(parent, admin)

    }

    async unlockChallange(user: Student, challange: string) {
        //TODO
    }


    async purchaseReward(user: Student, reward: string) {
        //TODO
    }

    async finishGame(user: Student, game: Folder, result: Result) {
        //TODO
    }

    checkForChallanges(user: Student) {
        //Win Games


        //WinStreaks


        //100 Percent Streaks


        //Lose First Time


        //Earned the first stars


        //Earned a group Target


    }

}