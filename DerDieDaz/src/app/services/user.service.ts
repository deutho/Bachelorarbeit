import { Injectable } from "@angular/core";
import * as moment from "moment";
import { mapTo } from "rxjs/operators";
import { Folder } from "../models/folder.model";
import { Result } from "../models/result";
import { Admin, Student, Teacher, User } from "../models/users.model";
import { FirestoreDataService } from "./firestore-data.service";

@Injectable({ providedIn: 'root' })
export class UserService {

    constructor(private afs: FirestoreDataService){}


    depositStarsToUser(user: Student, amount: number) {
        let currentamount = user.starbalance + amount;
        this.afs.updateStarBalance(currentamount, user.uid);
        user.starbalance = currentamount;
        this.afs.updateUserObservable(user);
    }

    async depositStarsToClassTarget(user: Student, amount: number) {
        let teachers: Teacher[] = await this.afs.getUserPerID(user.parent);
        
        let teacher = teachers[0];

        let currentamount = teacher.classtargetBalance+amount;
        let price = 0
        for (const [key, value] of Object.entries(teacher.classtargets)) { 
            price = value;
        }


        this.afs.UpdateClassTargetBalance(currentamount, teacher.uid);
        
        if (currentamount >= price) {
            this.afs.UpdateClassTargetAchieved(true, teacher.uid);
        }


    }

    async unlockChallange(user: Student, challange: string) {
        //TODO
    }


    async purchaseReward(user: Student, reward: string) { //reward should eventually become a reward object
        //TODO
    }


    async finishGame(user: Student, totalrounds: number, roundsWon: number, foldername: string, duration: number, stars: number) {
        return new Promise<any>(async (resolve, reject) => {
        
            let percentageOfRightAnswers = roundsWon/totalrounds;
            let percentageOfEarnedStars = stars * percentageOfRightAnswers
            let rounded = Math.floor(percentageOfEarnedStars);
            
            const newResult = <Result> {
                datetime: Date.now(),
                game: foldername,
                totalRounds: totalrounds,
                wonRounds: roundsWon,
                duration: duration,
                earnedStars: rounded 
            }

            user.gameresults.push(newResult);
            this.afs.updateUserObservable(user);

            console.log(newResult);
            await this.afs.updateResults(user, newResult);

            this.depositStarsToUser(user, rounded);

            this.depositStarsToClassTarget(user, rounded);

            //check for challanges
            let doneChallanges = await this.checkForChallangesAndLoginStreak(user);

            console.log(doneChallanges);

            resolve([newResult, doneChallanges])
        });
        
    }

    checkForChallangesAndLoginStreak(user: Student) {
        return new Promise<any>((resolve, reject) => {

            let map = new Map();
            
            //Check and Give out the daily reward for the first game in a day
            let ma = moment(Date.now());
            let mb = moment(user.lastReward);
            let diff = ma.diff(mb, 'days')
            console.log(diff)

            //When the streak keeps going
            if (diff == 1) {
                let streak = user.loginStreak + 1;
                user.loginStreak = streak;

                let balance = user.starbalance + user.dailyloginreward;
                user.starbalance = balance;
                user.lastReward = Date.now();
                map.set('loginreward', true);
                map.set('streak', streak);
            } 

            //when the Streak was lost
            if (diff > 1) {
                user.loginStreak == 1;
                let balance = user.starbalance + user.dailyloginreward;
                user.starbalance = balance;
                user.lastReward = Date.now();
                map.set('loginreward', true);
                map.set('streak', 1);
            }

            if (diff == 0) {
                map.set('loginreward', false);
                map.set('streak', user.loginStreak);
            }


            map.set("test", "test");

            //Win Games


            //WinStreaks


            //100 Percent Streaks


            //Lose First Time


            //Earned the first stars


            //Earned a group Target


            //update the streak and balance
            this.afs.updateStarsAndLoginStreak(user.starbalance, user.loginStreak, user.lastReward, user.uid);


            //update the local observable
            this.afs.updateUserObservable(user);

            resolve(map);

        });
    }



}