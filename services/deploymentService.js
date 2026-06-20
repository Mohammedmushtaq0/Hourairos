const dynamodb =
    require('../lib/dynamodb');

const {

    PutCommand,

    QueryCommand,

    DeleteCommand

} = require('@aws-sdk/lib-dynamodb');


// =====================================
// CREATE DEPLOYMENT
// =====================================

async function createDeployment({

    userId,

    deploymentId,

    deploymentUrl

}) {

    await dynamodb.send(

        new PutCommand({

            TableName: 'Deployments',

            Item: {

                userId,

                deploymentId,

                deploymentUrl,

                status: 'active',

                createdAt:
                    new Date().toISOString()
            }
        })
    );
}


// =====================================
// GET USER DEPLOYMENTS
// =====================================

async function getDeploymentsByUser(
    userId
) {

    const result =
        await dynamodb.send(

            new QueryCommand({

                TableName: 'Deployments',

                KeyConditionExpression:
                    'userId = :userId',

                ExpressionAttributeValues: {

                    ':userId':
                        userId
                }
            })
        );

    return result.Items || [];
}


// =====================================
// DELETE DEPLOYMENT
// =====================================

async function deleteDeployment({

    userId,

    deploymentId

}) {

    await dynamodb.send(

        new DeleteCommand({

            TableName: 'Deployments',

            Key: {

                userId,

                deploymentId
            }
        })
    );
}


module.exports = {

    createDeployment,

    getDeploymentsByUser,

    deleteDeployment
};