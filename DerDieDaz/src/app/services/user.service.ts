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
    }

    async depositStarsToClassTarget(user: Student, amount: number) {
        let teachers: Teacher[] = await this.afs.getUserPerID(user.parent);
        
        let teacher = teachers[0];

        let currentamount = teacher.classtargetBalance+amount;
        let price = 0
        for (const [key, value] of Object.entries(teacher.classtargets)) { 
            price = value;
        }

        if (currentamount > price) currentamount = price;

        if (teacher.classtargetAchieved == false) {
            this.afs.UpdateClassTargetBalance(currentamount, teacher.uid);
        }
        
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

            let now = Date.now()

            let ma = moment(now);
            let mb = moment(user.lastReward);
            let diff = ma.diff(mb, 'hours', true)

            
            //When the streak keeps going
            if (diff > user.lastRewardResetTime && diff < user.lastRewardResetTime + 24) {
                let streak = user.loginStreak + 1;
                user.loginStreak = streak;

                let balance = user.starbalance + user.dailyloginreward;
                user.starbalance = balance;
                user.lastReward = now;

                let midnight = moment().endOf("day")
                user.lastRewardResetTime = midnight.diff(ma, 'hours', true)

                map.set('loginreward', true);
                map.set('streak', streak);
            } 

            //when the Streak was lost
            if (diff > user.lastRewardResetTime + 24) {
                user.loginStreak == 1;
                let balance = user.starbalance + user.dailyloginreward;
                user.starbalance = balance;
                user.lastReward = now;

                let midnight = moment().endOf("day")
                user.lastRewardResetTime = midnight.diff(ma, 'hours', true)
            
                map.set('loginreward', true);
                map.set('streak', 1);
            }

            if (diff < user.lastRewardResetTime) {
                map.set('loginreward', false);
                map.set('streak', user.loginStreak);
            }


            map.set("test", "test");

            //Check for various challanges



            //Earned the first stars
            




            //Win Games


            //WinStreaks


            //100 Percent Streaks


            //Lose First Time


            


            //Earned a group Target


            //update the streak and balance
            this.afs.updateStarsAndLoginStreak(user.starbalance, user.loginStreak, user.lastReward, user.lastRewardResetTime, user.uid);


            resolve(map);

        });
    }



}