const dynamodb =
    require('../lib/dynamodb');

const {
    GetCommand,
    PutCommand,
    UpdateCommand
} = require('@aws-sdk/lib-dynamodb');


// =======================
// GET USER
// =======================

async function getUser(userId) {

    const result =
        await dynamodb.send(

            new GetCommand({

                TableName: 'Users',

                Key: {

                    userId
                }
            })
        );

    return result.Item;
}


// =======================
// CREATE USER
// =======================

async function createUser({

    userId,

    email

}) {

    await dynamodb.send(

        new PutCommand({

            TableName: 'Users',

            Item: {

                userId,

                email,

                plan: 'free',

                createdAt:
                    new Date().toISOString()
            }
        })
    );
}

module.exports = {

    getUser,

    createUser,

    incrementDeploymentCount
};

// =======================
// INCREMENT DEPLOYMENT COUNT
// =======================

async function incrementDeploymentCount(
    userId
) {

    await dynamodb.send(

        new UpdateCommand({

            TableName: 'Users',

            Key: {

                userId
            },

            UpdateExpression:
                'SET deploymentCount = deploymentCount + :inc',

            ExpressionAttributeValues: {

                ':inc': 1
            }
        })
    );
}