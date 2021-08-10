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
        return new Promise<any>(async (resolve, reject) => {

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


            //Check for various challanges

            //Earned the first stars
            let challangedone = false;

            if (user.challangesDone.indexOf("FirstTimeStarsEarned") == -1) {
                if (user.starbalance > 0) {
                    map.set("challange1", "FirstTimeStarsEarned");
                    user.challangesDone.push("FirstTimeStarsEarned");
                    challangedone = true;
                }
            }




            //Win Games
            let wongames =  0
            for (var i = 0; i<user.gameresults.length; i++) {
                if(user.gameresults[i].wonRounds >= user.gameresults[i].totalRounds/2) {
                    wongames++;
                } 
            }

            console.log(wongames);
            
            if (wongames >= 100 && user.challangesDone.indexOf("Win100Games") == -1) {
                map.set("challange2", "Win100Games")
                user.challangesDone.push("Win100Games");
                challangedone = true;
            }

            if (wongames >= 50 && user.challangesDone.indexOf("Win50Games") == -1) {
                map.set("challange3", "Win50Games")
                user.challangesDone.push("Win50Games");
                challangedone = true;
            }

            if (wongames >= 25 && user.challangesDone.indexOf("Win25Games") == -1) {
                map.set("challange4", "Win25Games")
                user.challangesDone.push("Win25Games");
                challangedone = true;
            }

            if (wongames >= 5 && user.challangesDone.indexOf("Win5Games") == -1) {
                map.set("challange13", "Win5Games")
                user.challangesDone.push("Win5Games");
                challangedone = true;
            }


            //LoginStreak
            if (user.loginStreak >= 3 && user.challangesDone.indexOf("3dayLoginStreak") == -1) {
                map.set("challange5", "3dayLoginStreak")
                user.challangesDone.push("3dayLoginStreak");
                challangedone = true;
            }

            if (user.loginStreak >= 7 && user.challangesDone.indexOf("7dayLoginStreak") == -1) {
                map.set("challange6", "7dayLoginStreak")
                user.challangesDone.push("7dayLoginStreak");
                challangedone = true;
            }

            if (user.loginStreak >= 14 && user.challangesDone.indexOf("14dayLoginStreak") == -1) {
                map.set("challange7", "14dayLoginStreak")
                user.challangesDone.push("14dayLoginStreak");
                challangedone = true;
            }

            //100 Percent Streaks
            let results: Result[] = user.gameresults;

            results.sort((a,b)=> {
                return b.datetime-a.datetime;
            });

            let achieved = false;

            //1 time
            if (results.length >=1) {
                if (user.challangesDone.indexOf("1x100%WinStreak") == -1) {
                    for (var i = 0; i < 1; i++) {
                        if (results[i].totalRounds == results[i].wonRounds) achieved = true;
                        else {
                            achieved = false;
                            break;
                        }
                    }
                }
            }
            
            if (achieved) {
                map.set("challange8", "1x100%WinStreak")
                user.challangesDone.push("1x100%WinStreak");
                challangedone = true;
                achieved = false;
            }

            //3 Time
            if (results.length >=3) {
                if (user.challangesDone.indexOf("3x100%WinStreak") == -1) {
                    for (var i = 0; i < 3; i++) {
                        if (results[i].totalRounds == results[i].wonRounds) achieved = true;
                        else {
                            achieved = false;
                            break;
                        }
                    }
                }
            }
            
            if (achieved) {
                map.set("challange9", "3x100%WinStreak")
                user.challangesDone.push("3x100%WinStreak");
                challangedone = true;
                achieved = false;
            }

            //10Time 
            if (results.length >=10) {
                if (user.challangesDone.indexOf("10x100%WinStreak") == -1) {
                    for (var i = 0; i < 10; i++) {
                        if (results[i].totalRounds == results[i].wonRounds) achieved = true;
                        else {
                            achieved = false;
                            break;
                        }
                    }
                }
            }
            
            if (achieved) {
                map.set("challange10", "10x100%WinStreak")
                user.challangesDone.push("10x100%WinStreak");
                challangedone = true;
                achieved = false;
            }

            //Lose First Time
            if (user.challangesDone.indexOf("FirstTimeFailure") == -1 && results[0].wonRounds < results[0].totalRounds/2) {
                map.set("challange11", "FirstTimeFailure")
                user.challangesDone.push("FirstTimeFailure");
                challangedone = true;
            }

            //Earned a group Target
            if (user.challangesDone.indexOf("ClassGoalReached") == -1) {
                let teachers: Teacher[] = await this.afs.getUserPerID(user.parent);

                let teacher = teachers[0]

                if (teacher.classtargetAchieved) {
                    map.set("challange12", "ClassGoalReached")
                    user.challangesDone.push("ClassGoalReached");
                    challangedone = true;
                }
            }

            //update the streak and balance
            this.afs.updateStarsAndLoginStreak(user.starbalance, user.loginStreak, user.lastReward, user.lastRewardResetTime, user.uid);

            //updateChallangesIfOneCompleted
            if (challangedone) {
                this.afs.updateChallanges(user, user.challangesDone);
            }

            resolve(map);

        });
    }



}