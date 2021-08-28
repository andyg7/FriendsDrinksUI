let { v4: uuidv4 } = require('uuid');

class Backend {

    constructor(userId) {
        this.friendsDrinksMap = new Map();
        this.friendsDrinksMap.set("1", {
            adminUserId: userId,
            friendsDrinksId: "1",
            name: "Whiskey drinks",
            status: "ACTIVE",
            memberList: [
                {
                    userId: 'userId',
                    firstName: 'John',
                    lastName: 'Grant',
                    email: 'blah@blah'
                }
            ],
            meetupList: [
                {
                    date: "2021/08/25",
                    userStateList: [
                        {
                            userId: 'userId2',
                            firstName: 'Sam',
                            lastName: 'Bar',
                            email: 'sam@blah'
                        }
                    ]
                }
            ]
        });

        this.invitationMap = new Map();
        this.invitationMap.set("1", {
            message: "Want to join Scotch drinks?",
            friendsDrinksId: "1",
            friendsDrinksName: "Scotch drinks",
            userId: userId
        })
    }

    reportUserEvent(input) {
        // nop
        return new Promise(function (resolve, reject) {
            resolve("{}");
        });
    }

    getHomepage(userId) {
        console.log("Getting homepage for " + userId);
        let adminFriendsDrinksStateList = []
        for (const [key, value] of this.friendsDrinksMap) {
            console.log(key + ' = ' + value);
            if (userId === value.adminUserId) {
                adminFriendsDrinksStateList.push(value);
            }
        }

        let memberFriendsDrinksStateList = []
        for (const [key, value] of this.friendsDrinksMap) {
            console.log(key + ' = ' + value);
            let memberUserIds = value.memberList.map(x => x.userId);
            if (memberUserIds.includes(userId)) {
                memberFriendsDrinksStateList.push(value);
            }
        }

        let invitationList = []
        for (const [key, value] of this.invitationMap) {
            console.log(key + ' = ' + value);
            if (userId === value.userId) {
                invitationList.push(value);
            }
        }

        let homepage = {
            adminFriendsDrinksStateList: adminFriendsDrinksStateList,
            memberFriendsDrinksStateList: memberFriendsDrinksStateList,
            invitationList: invitationList
        };
        return new Promise(function (resolve, reject) {
            resolve(JSON.stringify(homepage));
        });
    }

    deleteFriendsDrinks(id) {
        this.friendsDrinksMap.delete(id);
        return new Promise(function (resolve, reject) {
            resolve('{}');
        })
    }

    updateFriendsDrinks(id) {
        return new Promise(function (resolve, reject) {
            resolve('{}');
        })
    }

    createFriendsDrinks(userId, name) {
        console.log("Creating friends drinks for user " + userId + " with name " + name);
        let friendsDrinksId = uuidv4();
        let fd = {
            name: name,
            adminUserId: userId,
            status: 'ACTIVE',
            friendsDrinksId: friendsDrinksId,
            memberList: [],
            meetupList: []
        };
        this.friendsDrinksMap.set(friendsDrinksId, fd);
        return new Promise(function (resolve, reject) {
            resolve('{}');
        })
    }

    replyToInvitation(friendsDrinksId, invitationReply) {
        return new Promise(function (resolve, reject) {
            resolve('{}');
        })
    }

    schedule(friendsDrinksId) {
        return new Promise(function (resolve, reject) {
            resolve('{}');
        })
    }

    getFriendsDrinksDetailPage(friendsDrinksId) {
        let friendsDrink = this.friendsDrinksMap.get(friendsDrinksId);
        return new Promise(function (resolve, reject) {
            resolve(JSON.stringify(friendsDrink));
        })
    }

    getFriendsDrinksInvitation(userId, friendsDrinksId) {
        return new Promise(function (resolve, reject) {
            resolve('{}');
        })
    }

    inviteUser(friendsDrinksId, userId) {
        return new Promise(function (resolve, reject) {
            resolve('{}');
        })
    }

}

module.exports = Backend