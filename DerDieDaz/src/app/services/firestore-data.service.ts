import { Injectable, OnDestroy } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreCollectionGroup, AngularFirestoreDocument, fromDocRef } from '@angular/fire/firestore';
import { Student, User } from '../models/users.model';
import { AuthService } from './auth.service';
import * as firebase from 'firebase';
import { VocabularyGame } from '../models/VocabularyGame.model';
import { Folder } from '../models/folder.model';
import { Folderelement } from '../models/folderelement.model';
import { take } from 'rxjs/operators';
import { BugReport } from '../models/bugreport.model';
import { BehaviorSubject } from 'rxjs';
import { formatDate } from '@angular/common';
import { Challange } from '../models/challange.model';
import { Result } from '../models/result';
import { query } from '@angular/animations';
import { Purchase } from '../models/purchase.model';
import { FeaturesModule } from '../features/features.module';
import { AppModule } from '../app.module';




@Injectable({ providedIn: "root" })
export class FirestoreDataService {
    db = firebase.firestore();
    storage = firebase.storage();
    storageRef = this.storage.ref();
    usersub;
    purchasesub;

    private currentUser: BehaviorSubject<User> = new BehaviorSubject<User>(null);
    currentUserStatus = this.currentUser.asObservable();

    private purchases: BehaviorSubject<Purchase[]> = new BehaviorSubject<Purchase[]>(null);
    purchasesStatus = this.purchases.asObservable();

    constructor(public _afs: AngularFirestore, public _auth: AuthService) {
        this.authStatusListener();
        
    }
    //Auth Change Listener for the user observable
    authStatusListener() {
        firebase.auth().onAuthStateChanged(async (credential) => {
            if (credential) {
                this.getCurrentUser();
                this.getPurchasesFromUser();
            } else {
                this.currentUser.next(null);
                if (this.usersub != null) this.usersub();
                if (this.purchasesub != null) this.purchasesub();
            }
        })
    }

    get getUser() {
        return this.currentUser.value;
    }
   
    /** gets signed in user from DB 
     * 
     */
    getCurrentUser() {
        let ref = this.db.collectionGroup('users').where('uid', "==", this._auth.getCurrentUser().uid);
        this.usersub = ref.onSnapshot((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                this.currentUser.next(doc.data() as User);
            });
        });
    }

    getPurchasesFromUser() {
        let ref = this.db.collection('purchases').where('studentID', "==", this._auth.getCurrentUser().uid);
        let data: Purchase[] = [];
        this.purchasesub = ref.onSnapshot((querySnapshot) => {
            data = [];
            querySnapshot.forEach((doc) => {
                data.push(doc.data() as Purchase)
            });
            this.purchases.next(data);
        });
    }

    getPurchasesFromTecher(): Purchase[] {

        let ref = this.db.collection("purchases").where('teacherID', '==', this._auth.getCurrentUser().uid);
        let data: Purchase[] = []
        ref.get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                data.push(doc.data() as Purchase)
            });
        });
        return data;
    }

    /**gets the user by id
     * 
     * @param uid user id
     */
    getUserPerID(uid: string): Promise<any>  {
        let ref =  this._afs.collectionGroup('users', ref => ref.where('uid', "==", uid));
        return ref.valueChanges().pipe(take(1)).toPromise()
    }

    /**
     * Gets all children of a User based on the parents ID
     * @param uid 
     */
    async getChildernUserByParentID(uid: string): Promise<User[]>{
        let ref: AngularFirestoreCollectionGroup<any>  = this._afs.collectionGroup('users', ref => ref.where('parent', "==", uid));
        return await ref.valueChanges().pipe(take(1)).toPromise();
    }

    /**adds a user with id and parent
     * 
     * @param user user id
     * @param parent parent id (teacher or admin)
     */
    addUser(user: User, parent: User): Promise<void> {
        if (user.role == 2){
            return this.db.collection("users/"+user.parent+"/users").doc(user.uid).set(user);
        } else {
            return this.db.collection("users/"+parent.parent+"/users/"+parent.uid+"/users").doc(user.uid).set(user);
        }
    }

    /**gets the Questions for a game
     * 
     * @param id folder id
     */
    async getTasksPerID(id): Promise<any> {
        let ref: AngularFirestoreCollection<any> = this._afs.collection('games', ref => ref.where('folderUID', '==', id));
        return await ref.valueChanges().pipe(take(1)).toPromise()
    }

    /** returns the content of a folder !document!
     * 
     * @param uid uid of the Document
     */
    getFolderElement(uid: string): Promise<Folderelement> {
        let ref: AngularFirestoreDocument<Folderelement> = this._afs.collection("folders").doc(uid);
        return ref.valueChanges().pipe(take(1)).toPromise()
    }

    /** adds a folder within a document
     * 
     * @param folder the folder to be added
     * @param uid the Document the folder is added to
     */
    updateFolders(folder: Folder, uid: string) {
        return this.db.collection("folders").doc(uid).update({
            folders: firebase.firestore.FieldValue.arrayUnion(JSON.parse(JSON.stringify(folder)))
        });
    }

    async updateResults(user: Student, result: Result) {
        let ref = await this.db.collectionGroup("users").where("uid","==",user.uid).get();
        ref.forEach(doc => {
            doc.ref.update({
                gameresults: firebase.firestore.FieldValue.arrayUnion(result)
            });
        });

    }

    async updateChallanges(user: Student, challanges: string[]) {
        let ref = await this.db.collectionGroup("users").where("uid","==",user.uid).get();
        ref.forEach(doc => {
            doc.ref.update({
                challangesDone: challanges
            });
        });

    }

    

    /** removes folder from a document
     * 
     * @param folder the folder to be removed
     * @param uid the Document the folder is removed from
     */
    deleteFolder(folder: Folder, uid: string) {
        return this.db.collection("folders").doc(uid).update({
            folders: firebase.firestore.FieldValue.arrayRemove(JSON.parse(JSON.stringify(folder)))
        });
    }

    /** deletes the whole document (can be folder, game, user, ...)
     * 
     * @param collection the collection the document is in (games, users, folders)
     * @param uid the uid of the document you want to delete
     */
    deleteDocument(collection: string, uid: string): Promise<any> {
        return this.db.collection(collection).doc(uid).delete();
    }
    
    /**adds folder document after creating a new folder
     * 
     * @param uid the uid of the folder document
     * @param parent the uid of the parent of the new created folder document
     */
    addFolderDocument(uid: string, parent: string): void{
        this.db.collection("folders").doc(uid).set({
            parent: parent,
            folders: []
        });
    }
   
    /** updates the given task (creates a new task if uid is not already in DB - if uid is known, values are updated)
     * 
     * @param task uid of task
     */
    async updateTask(task) {
        await this.db.collection("games").doc(task.uid).set(JSON.parse(JSON.stringify(task)));
    }

    async updateUserPicture(imageURL : string, uid : string) {
        let ref = await this.db.collectionGroup("users").where("uid","==",uid).get();
        ref.forEach(doc => {
            doc.ref.update({
                avatarID: imageURL
            });
        });
    }

    async updateLoginStreak(loginStreak: number, lastReward: number, lastRewardResetTime: number, uid: string) {
        let ref = await this.db.collectionGroup("users").where("uid","==",uid).get();
        ref.forEach(doc => {
            doc.ref.update({
                loginStreak: loginStreak,
                lastReward: lastReward,
                lastRewardResetTime: lastRewardResetTime,
            });
        });

    }

    async updateStarBalance(stars: number, uid: string) {
        console.log(stars)
        let ref = await this.db.collectionGroup("users").where("uid","==",uid).get();
        ref.forEach(doc => {
            doc.ref.update({
                starbalance: stars,
            });
        });
    }

    async UpdateClassTargetBalance(stars: number, uid: string) {
        let ref = await this.db.collectionGroup("users").where("uid","==",uid).get();
        ref.forEach(doc => {
            doc.ref.update({
                classtargetBalance: stars,
            });
        });
    }

    async UpdateClassTargetAchieved(achieved: boolean, uid: string) {
        let ref = await this.db.collectionGroup("users").where("uid","==",uid).get();
        ref.forEach(doc => {
            doc.ref.update({
                classtargetAchieved: achieved,
            });
        });
    }

    async UpdateIndividualTargets(map: any, uid: string): Promise<void> {
        let ref = await this.db.collectionGroup("users").where("uid","==",uid).get();
        ref.forEach(doc => {
            return doc.ref.update({
                individualtargets: map,
            })
        });
    }

    // async deleteIndividualTargets(targetId: string, uid: string) {
    //     let ref = await this.db.collectionGroup("users").where("uid","==",uid).get()
    //     ref.forEach(doc => {
    //         doc.ref.delete();
    //     });
    // }

    async updatePurchaseGiven(purchase: Purchase) {
    let ref = await this.db.collection("purchases").where("objectID", "==", purchase.objectID).where("studentID", "==", purchase.studentID).get()
        ref.forEach(doc => {
            doc.ref.update({
                given: purchase.given
            });
        });
    }

    async deletePurchaseDocument(purchase: Purchase) {
        let ref = await this.db.collection("purchases").where("objectID", "==", purchase.objectID).where("studentID", "==", purchase.studentID).get()
        ref.forEach(doc => {
            doc.ref.delete();
        });
    }

    


    async updateClassTarget(desc: string, price: number, progress: number, uid: string): Promise<void> {
        let ref = await this.db.collectionGroup("users").where("uid","==",uid).get();
        let achieved = true;
        if (progress < price) achieved = false;
        
        let map = {};
        map[desc] = price;

        ref.forEach(doc => {
            return doc.ref.update({
                classtargets: map,
                classtargetBalance: progress,
                classtargetAchieved: achieved,
            });
        });
    }
    
    async updateDailyLoginReward(amount: number, uid: string): Promise<void> {
        let ref = await this.db.collectionGroup("users").where("uid","==",uid).get();
        ref.forEach(doc => {
            return doc.ref.update({
                dailyloginreward: amount
            });
        });
    }

    async updateHomeworkVoucherPrice(amount: number, uid: string): Promise<void> {
        let ref = await this.db.collectionGroup("users").where("uid","==",uid).get();
        ref.forEach(doc => {
            return doc.ref.update({
                homeworkVoucherPrice: amount
            });
        });
    }

    async toggleHomeWorkVoucherStatus(status: boolean, uid: string): Promise<void> {
        let ref = await this.db.collectionGroup("users").where("uid","==",uid).get();
        ref.forEach(doc => {
            return doc.ref.update({
                activatedHomeworkVoucher: !status
            });
        });
    }


    /** temporary result of a finished game
     * 
     * @param uid uid of user (student)
     * @param totalRounds rounds of the game 
     * @param roundsWon rounds correct
     * @param folderID uid of game
     * @param duration time taken to play the game
     */
    createResult(uid: string, totalRounds: number, roundsWon: number, folderID: number, duration: number) {
        this.db.collection('results/'+uid+"/results").add({
            totalRounds: totalRounds,
            roundsWon: roundsWon,
            folderUID: folderID,
            duration: duration, 
        });
    }

    /** adds a bug report to DB (temporary)
     * 
     * @param description description of bug the user wants to report
     * @param user name of user
     * @param status 'offen' or 'geschlossen'
     */
    addBugReport(description: string, user: string, status: string): boolean {
        let success = true;
        let name: string = formatDate(Date.now(),'yyyy-MM-dd HH:mm:ss.SSS','en-GB');
        this.db.collection("bugreports").doc(name).set({
            description: description,
            user: user,
            time: firebase.firestore.FieldValue.serverTimestamp(),
            status: status
        }).catch(()=>{
            success = false;
        });
    return success;
    }

    /** shows the reported bugs of the user
     * 
     * @param user name of user
     */
    getBugReportsByUser(user: string): AngularFirestoreCollection<BugReport> {
        return this._afs.collection("bugreports", ref => ref.where('user', "==", user));
    }

    /**deletes the given element (e.g. image or audio)
     * 
     * @param url url of the element in firebase
     */
    deleteFromStorageByUrl(url: string): Promise<any> {
        return this.storage.refFromURL(url).delete();
    }

    /**adds a challange
     * 
     * @param uid name of challange
     * @param descriptionDone description which notifies user when completing the challange
     * @param descriptionOpen description of challange which describes how to get the reward
     * @param header header of the challange on the card
     * @param imageURL image of the challange and therefore also the reward
     */
    addChallangeDocument(uid: string, descriptionDone: string, descriptionOpen: string, header: string, imageURL: string): void{
        this.db.collection("challanges").doc(uid).set({
            descriptionDone: descriptionDone,
            descriptionOpen: descriptionOpen,
            header: header,
            imageURL: imageURL
        });
    }

    addPurchaseDocument(objectname: string, username: string, objectID: string, price: number, studentID: string, teacherID: string, given: boolean) {
        this.db.collection("purchases").add({
            buyDate: firebase.firestore.FieldValue.serverTimestamp(),
            objectID: objectID,
            price: price,
            studentID: studentID,
            teacherID: teacherID,
            studentName: username,
            objectname: objectname,
            given: given
        });
    }

    async getAllChallanges(): Promise<Challange[]> {
        let ref: any = this._afs.collection("challanges");
        return await ref.valueChanges().pipe(take(1)).toPromise()
    }

    async getAllAvatars(): Promise<any[]> {
        let ref: any = this._afs.collection("avatars");
        return await ref.valueChanges().pipe(take(1)).toPromise()
    }

    
    
}





    
    