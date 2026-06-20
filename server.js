require("./telemetry");
require('dotenv').config();

const express = require('express');

const session = require('express-session');

const multer = require('multer');

const AdmZip = require('adm-zip');

const fs = require('fs');

const path = require('path');

const { v4: uuidv4 } = require('uuid');

const {
    Issuer,
    generators
} = require('openid-client');

const {
    S3Client,
    PutObjectCommand,
    ListObjectsV2Command,
    DeleteObjectsCommand
} = require('@aws-sdk/client-s3');

const {

    getUser,

    createUser,

    incrementDeploymentCount

} = require('./services/userService');
const {
  loginCounter,
  deploymentCounter,
  paymentSuccessCounter,
  paymentFailedCounter,
} = require("./metrics");
const {

    createDeployment,

    getDeploymentsByUser,

    deleteDeployment

} = require('./services/deploymentService');


const Razorpay =
    require('razorpay');

const crypto =
    require('crypto');

const {
    upgradePlan
} = require(
    './services/paymentService'
);


const razorpay =
    new Razorpay({

        key_id:
            process.env.RAZORPAY_KEY_ID,

        key_secret:
            process.env.RAZORPAY_KEY_SECRET
    });


// ======================================
// DEPLOYMENT UTILS
// ======================================

const {

    normalizePath,

    validateExtractedPath,

    resolveDeploymentEntry,

    validateFileSize,

    getContentType,

    walkDirectory,

    cleanupDeployment,

    validateZipExtension,

    validateDeploymentFiles

} = require('./utils/deploymentUtils');


// ======================================
// AWS S3 CLIENT
// ======================================

const s3 = new S3Client({

    region: process.env.AWS_REGION,

    credentials: {

        accessKeyId:
            process.env.AWS_ACCESS_KEY_ID,

        secretAccessKey:
            process.env.AWS_SECRET_ACCESS_KEY
    }
});


// ======================================
// EXPRESS APP
// ======================================

const app = express();

app.use(

    express.json()
);

app.use(

    express.urlencoded({

        extended: true
    })
);


// ======================================
// FILE UPLOAD CONFIG
// ======================================

const upload = multer({

    dest: 'uploads/'
});


// ======================================
// COGNITO CONFIG
// ======================================

let client;

const CLIENT_ID =process.env.COGNITO_CLIENT_ID;

const CLIENT_SECRET =process.env.COGNITO_CLIENT_SECRET;

const APP_URL =
process.env.APP_URL;

const REDIRECT_URI =
`${APP_URL}/callback`;

const COGNITO_DOMAIN =
'https://ap-south-1yn6kpvhzx.auth.ap-south-1.amazoncognito.com';


// ======================================
// VIEW ENGINE
// ======================================

app.set('view engine', 'ejs');

app.use(express.static('public'));


// ======================================
// SESSION
// ======================================

app.use(session({

    secret: process.env.SESSION_SECRET,

    resave: false,

    saveUninitialized: false
}));


// ======================================
// INITIALIZE COGNITO
// ======================================

async function initializeClient() {

    try {

        const issuer =
            await Issuer.discover(

            'https://cognito-idp.ap-south-1.amazonaws.com/ap-south-1_YN6kpvhzx/.well-known/openid-configuration'
        );

        client = new issuer.Client({

            client_id:
                CLIENT_ID,

            client_secret:
                CLIENT_SECRET,

            redirect_uris:
                [REDIRECT_URI],

            response_types:
                ['code']
        });

        console.log(
            'Cognito initialized'
        );

    } catch (err) {

        console.error(
            'Cognito Error:',
            err
        );
    }
}

initializeClient();


// ======================================
// AUTH MIDDLEWARE
// ======================================

const checkAuth = (
    req,
    res,
    next
) => {

    req.isAuthenticated =
        !!req.session.userInfo;

    next();
};


// ======================================
// HOME ROUTE
// ======================================

app.get(
    '/',
    checkAuth,
    (req, res) => {

    res.render('home', {

        isAuthenticated:
            req.isAuthenticated,

        userInfo:
            req.session.userInfo
    });
});


// ======================================
// LOGIN ROUTE
// ======================================

app.get('/login', async (req, res) => {

    if (!client) {

        return res.send(
            'Cognito not initialized'
        );
    }

    const nonce =
        generators.nonce();

    const state =
        generators.state();

    req.session.nonce =
        nonce;

    req.session.state =
        state;

    const authUrl =
        client.authorizationUrl({

        scope:
            'openid email phone',

        state,

        nonce
    });

    res.redirect(authUrl);
});


// ======================================
// CALLBACK ROUTE
// ======================================

app.get('/callback', async (req, res) => {

    try {

        const params =
            client.callbackParams(req);

        const tokenSet =
            await client.callback(

            REDIRECT_URI,

            params,

            {

                nonce:
                    req.session.nonce,

                state:
                    req.session.state
            }
        );

        const userInfo =
    await client.userinfo(

    tokenSet.access_token
);


// ==================================
// STORE USER IN SESSION
// ==================================

req.session.userInfo =
    userInfo;

loginCounter.add(1);
// ==================================
// CHECK IF USER EXISTS
// ==================================

const existingUser =
    await getUser(
        userInfo.sub
    );


// ==================================
// CREATE USER IF NOT EXISTS
// ==================================

if (!existingUser) {

    await createUser({

        userId:
            userInfo.sub,

        email:
            userInfo.email
    });

    console.log(
        `New user created: ${userInfo.email}`
    );
}


// ==================================
// REDIRECT TO DASHBOARD
// ==================================

res.redirect('/dashboard');

    } catch (err) {

        console.error(
            'Callback Error:',
            err
        );

        res.send(
            'Login failed'
        );
    }
});

app.get(

    '/upgrade',

    checkAuth,

    (req, res) => {

        if (!req.isAuthenticated) {

            return res.redirect('/');
        }

        res.render('upgrade');
    }
);

// ======================================
// DASHBOARD ROUTE
// ======================================

app.get(
    '/dashboard',
    checkAuth,
    async (req, res) => {

    if (!req.isAuthenticated) {

        return res.redirect('/');
    }

    const deployments =
        await getDeploymentsByUser(

            req.session.userInfo.sub
        );

    res.render('dashboard', {

        userInfo:
            req.session.userInfo,

        deployments
    });
});


// ======================================
// DEPLOY ROUTE
// ======================================

app.post(

    '/deploy',

    checkAuth,

    upload.single('websiteZip'),

    async (req, res) => {   
        if (!req.session.userInfo) {

    return res.redirect('/login');
}
        const user =
    await getUser(

        req.session.userInfo.sub
    );


// ===============================
// FREE PLAN LIMIT
// ===============================

if (

    user.plan === 'free'

    &&

    user.deploymentCount >= 3

) {

    return res.redirect(
        '/upgrade'
    );
}
//  {

//     return res.send(`

//         <html>

//         <body
//             style="
//                 background:#0b1020;
//                 color:white;
//                 font-family:Arial;
//                 padding:40px;
//             "
//         >

//             <h1>
//                 Free Plan Limit Reached
//             </h1>

//             <p>
//                 Free users can deploy up to
//                 3 websites.
//             </p>

//             <p>
//                 Upgrade to Pro
//                 to deploy unlimited websites.
//             </p>

//             <a
//                 href="/dashboard"
//                 style="
//                     color:#7ca6ff;
//                 "
//             >
//                 Back To Dashboard
//             </a>

//         </body>

//         </html>
//     `);
// }

    let zipPath = null;

    let extractPath = null;

    try {

        // ==================================
        // VALIDATE FILE EXISTS
        // ==================================

        if (!req.file) {

            return res.status(400).send(
                'ZIP file required'
            );
        }


        // ==================================
        // VALIDATE ZIP EXTENSION
        // ==================================

        validateZipExtension(
            req.file.originalname
        );


        // ==================================
        // VALIDATE FILE SIZE
        // ==================================

        validateFileSize(
            req.file.size
        );


        // ==================================
        // DEPLOYMENT ID
        // ==================================

        const deploymentId =
            `deploy_${uuidv4()}`;

        zipPath =
            req.file.path;

        extractPath =
            path.join(
                'extracted',
                deploymentId
            );

        fs.mkdirSync(
            extractPath,
            {
                recursive: true
            }
        );


        // ==================================
        // EXTRACT ZIP
        // ==================================

        const zip =
            new AdmZip(zipPath);

        zip.extractAllTo(
            extractPath,
            true
        );


        // ==================================
        // RESOLVE ENTRY FILE
        // ==================================

        const deploymentEntry =
            resolveDeploymentEntry(
                extractPath
            );


        // ==================================
        // WALK FILES
        // ==================================

        const allFiles =
            walkDirectory(
                extractPath
            );


        // ==================================
        // VALIDATE FILES
        // ==================================

        validateDeploymentFiles(
            allFiles
        );


        // ==================================
        // UPLOAD FILES TO S3
        // ==================================

        for (const fullPath of allFiles) {

            let relativePath =
                path.relative(
                    extractPath,
                    fullPath
                );

            relativePath =
                normalizePath(
                    relativePath
                );

            relativePath =
                validateExtractedPath(
                    relativePath
                );

            const s3Key =
`deployments/${deploymentId}/${relativePath}`;

            const fileContent =
                fs.readFileSync(
                    fullPath
                );

            const contentType =
                getContentType(
                    fullPath
                );

            await s3.send(

                new PutObjectCommand({

                    Bucket:
                        process.env.S3_BUCKET_NAME,

                    Key:
                        s3Key,

                    Body:
                        fileContent,

                    ContentType:
                        contentType
                })
            );

            console.log(
                `Uploaded: ${s3Key}`
            );
        }


        // ==================================
        // DEPLOYMENT URL
        // ==================================

        const deploymentUrl =
`${process.env.CLOUDFRONT_DOMAIN}/deployments/${deploymentId}/${deploymentEntry}`;

await createDeployment({

    userId:
        req.session.userInfo.sub,

    deploymentId,

    deploymentUrl
});
await incrementDeploymentCount(

    req.session.userInfo.sub
);
deploymentCounter.add(1);
        // ==================================
        // CLEANUP
        // ==================================

        cleanupDeployment([

            zipPath,

            extractPath
        ]);


        // ==================================
        // SUCCESS RESPONSE
        // ==================================

        res.send(`

            <html>

            <body style="background:#0b1020;color:white;font-family:Arial;padding:40px;">

                <h1>
                    Deployment Successful
                </h1>

                <p>
                    Deployment ID:
                    ${deploymentId}
                </p>

                <a
                    href="${deploymentUrl}"
                    target="_blank"
                    style="
                        color:#7ca6ff;
                        font-size:18px;
                    "
                >
                    ${deploymentUrl}
                </a>

            </body>

            </html>
        `);

    } catch (err) {

        console.error(err);

        res.status(500).send(
            err.message
        );

    } finally {

        // ==================================
        // SAFETY CLEANUP
        // ==================================

        cleanupDeployment([

            zipPath,

            extractPath
        ]);
    }
});

app.post(
    '/delete-deployment/:deploymentId',
    checkAuth,
    async (req, res) => {

    try {

        const deploymentId =
            req.params.deploymentId;

        const userId =
            req.session.userInfo.sub;

        const deployments =
            await getDeploymentsByUser(
                userId
            );

        const deployment =
            deployments.find(

                d =>
                    d.deploymentId ===
                    deploymentId
            );

        if (!deployment) {

            return res
                .status(404)
                .send(
                    'Deployment not found'
                );
        }

        const prefix =
`deployments/${deploymentId}/`;

        const objects =
            await s3.send(

                new ListObjectsV2Command({

                    Bucket:
                        process.env.S3_BUCKET_NAME,

                    Prefix:
                        prefix
                })
            );

        if (
            objects.Contents &&
            objects.Contents.length > 0
        ) {

            await s3.send(

                new DeleteObjectsCommand({

                    Bucket:
                        process.env.S3_BUCKET_NAME,

                    Delete: {

                        Objects:

                        objects.Contents.map(

                            object => ({

                                Key:
                                    object.Key
                            })
                        )
                    }
                })
            );
        }

        await deleteDeployment({

            userId,

            deploymentId
        });

        res.redirect(
            '/dashboard'
        );

    } catch (err) {

        console.error(err);

        res.status(500).send(
            err.message
        );
    }
});

// ======================================
// LOGOUT ROUTE
// ======================================

app.get('/logout', (req, res) => {

    req.session.destroy();

    const logoutUrl =
`${COGNITO_DOMAIN}/logout?client_id=${CLIENT_ID}&logout_uri=${APP_URL}`;

    res.redirect(logoutUrl);
});

app.post(

    '/api/create-order',

    checkAuth,

    async (req, res) => {

        try {

            const order =
                await razorpay.orders.create({

                    amount:
                        5900,

                    currency:
                        'INR',

                    receipt:
                        `receipt_${Date.now()}`
                });

            res.json({

                orderId:
                    order.id,

                amount:
                    order.amount,

                currency:
                    order.currency
            });

        } catch (err) {

            console.error(err);

            res.status(500).json({

                error:
                    'Order creation failed'
            });
        }
    }
);

app.post(

    '/api/verify-payment',

    checkAuth,

    async (req, res) => {

        try {

            const {

                razorpay_payment_id,

                razorpay_order_id,

                razorpay_signature

            } = req.body;

            const body =

                razorpay_order_id +

                "|" +

                razorpay_payment_id;

            const expectedSignature =

                crypto

                    .createHmac(

                        'sha256',

                        process.env.RAZORPAY_KEY_SECRET
                    )

                    .update(body)

                    .digest('hex');

            if (

                expectedSignature !==

                razorpay_signature

            ) {
                paymentFailedCounter.add(1);
                return res.status(400).json({

                    success: false,

                    message:
                        'Invalid Signature'
                });
            }

            await upgradePlan({

                userId:
                    req.session.userInfo.sub,

                plan:
                    'pro'
            });
            paymentSuccessCounter.add(1);

            res.json({

                success: true
            });

        } catch (err) {

            console.error(err);

            res.status(500).json({

                success: false
            });
        }
    }
);

// ======================================
// START   SERVER
// ======================================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Server running at http://localhost:${PORT}`);
});
