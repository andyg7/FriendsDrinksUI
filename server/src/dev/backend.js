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
        return new Promise(function (resolve, reject) {
            let homepageDto = {
                friendsDrinksList: ["Whiskey", "Vodka"]
            };
            resolve(JSON.stringify(homepageDto));
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

    createFriendsDrinks(id) {
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
        return new Promise(function (resolve, reject) {
            resolve('Success');
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