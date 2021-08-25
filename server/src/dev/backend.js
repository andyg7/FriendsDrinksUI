class Backend {

    constructor() { }

    reportUserEvent(input) {
        // nop
        return new Promise(function (resolve, reject) {
            resolve("Success");
        });
    }

    getHomepage(userId) {
        console.log("Getting homepage for " + userId);
        let homepage = {
            adminFriendsDrinksStateList: [{
                adminUserId: "1",
                friendsDrinksId: "1",
                name: "Whiskey drinks",
                status: "ACTIVE"
            }],
            memberFriendsDrinksStateList: [{
                adminUserId: "1",
                friendsDrinksId: "1",
                name: "Vodka drinks",
                status: "ACTIVE"
            }],
            invitationList: [{
                message: "Want to join Scotch drinks?",
                friendsDrinksId: "1",
                friendsDrinksName: "Scotch drinks"
            }]
        };
        return new Promise(function (resolve, reject) {
            resolve(JSON.stringify(homepage));
        });
    }

    deleteFriendsDrinks(id) {
        return new Promise(function (resolve, reject) {
            resolve('Success');
        })
    }

    updateFriendsDrinks(id) {
        return new Promise(function (resolve, reject) {
            resolve('Success');
        })
    }

    createFriendsDrinks(userId, name) {
        console.log("Creating friends drinks for user " + userId + " with name " + name);
        return new Promise(function (resolve, reject) {
            resolve('Success');
        })
    }

    replyToInvitation(friendsDrinksId, invitationReply) {
        return new Promise(function (resolve, reject) {
            resolve('Success');
        })
    }

    schedule(friendsDrinksId) {
        return new Promise(function (resolve, reject) {
            resolve('Success');
        })
    }

    getFriendsDrinksDetailPage(friendsDrinksId) {
        let dp = {
            adminUserId: 'someAdminUserId',
            friendsDrinksId: friendsDrinksId,
            name: 'Detail page name :)',
            memberList: [
                {
                    userId: 'userId',
                    firstName: 'John',
                    lastName: 'Grant',
                    email: 'blah@blah'
                }
            ]
        }
        return new Promise(function (resolve, reject) {
            resolve(JSON.stringify(dp));
        })
    }

    getFriendsDrinksInvitation(userId, friendsDrinksId) {
        return new Promise(function (resolve, reject) {
            resolve('Success');
        })
    }

    inviteUser(friendsDrinksId, userId) {
        return new Promise(function (resolve, reject) {
            resolve('Success');
        })
    }

}

module.exports = Backend