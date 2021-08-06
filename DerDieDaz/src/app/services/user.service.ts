import { Injectable } from "@angular/core";
import { Student, Teacher } from "../models/users.model";
import { FirestoreDataService } from "./firestore-data.service";

@Injectable({ providedIn: 'root' })
export class UserService {

    constructor(private afs: FirestoreDataService){}


    async depositStarsToUser(user: Student, amount: number) {
        let newAmount: number = user.starbalance + amount
        user.starbalance = newAmount

        let parent: Teacher = await this.afs.getUserPerID(user.parent);

        await this.afs.addUser(user, parent);
        
    }

    async depositStarsToClassTarget(user: Student, amount: number) {
        let parent: Teacher = await this.afs.getUserPerID(user.parent);
        
    }

}