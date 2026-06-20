const fs = require('fs');

const path = require('path');

const mime = require('mime-types');


// =====================================
// IGNORED FILES
// =====================================

const ignoredFiles = [

    '.DS_Store',

    'Thumbs.db'
];


// =====================================
// IGNORED FOLDERS
// =====================================

const ignoredFolders = [

    '__MACOSX'
];


// =====================================
// NORMALIZE WINDOWS PATHS
// =====================================

function normalizePath(filePath) {

    return filePath.replace(/\\/g, '/');
}


// =====================================
// IGNORE HIDDEN FILES
// =====================================

function shouldIgnore(fileName) {

    if (
        ignoredFiles.includes(fileName)
    ) {

        return true;
    }

    if (
        fileName.startsWith('.')
    ) {

        return true;
    }

    return false;
}


// =====================================
// IGNORE JUNK FOLDERS
// =====================================

function shouldIgnoreFolder(folderName) {

    return ignoredFolders.includes(
        folderName
    );
}


// =====================================
// ZIP PATH TRAVERSAL PROTECTION
// =====================================

function validateExtractedPath(relativePath) {

    const normalized =
        normalizePath(relativePath);

    if (
        normalized.includes('..')
    ) {

        throw new Error(
            'Unsafe ZIP path detected'
        );
    }

    return normalized;
}


// =====================================
// RESOLVE DEPLOYMENT ENTRY
// =====================================

function resolveDeploymentEntry(
    extractPath
) {

    const extractedItems =
        fs.readdirSync(extractPath)
        .filter(item => {

            return !shouldIgnore(item);
        });


    // =================================
    // CASE 1
    // ROOT index.html
    // =================================

    if (
        extractedItems.includes(
            'index.html'
        )
    ) {

        return 'index.html';
    }


    // =================================
    // CASE 2
    // SINGLE PARENT FOLDER
    // =================================

    if (
        extractedItems.length === 1
    ) {

        const firstItem =
            extractedItems[0];

        const firstItemPath =
            path.join(
                extractPath,
                firstItem
            );

        if (
            fs.statSync(firstItemPath)
            .isDirectory()
        ) {

            const nestedIndexPath =
                path.join(
                    firstItemPath,
                    'index.html'
                );

            if (
                fs.existsSync(
                    nestedIndexPath
                )
            ) {

                return normalizePath(
                    `${firstItem}/index.html`
                );
            }
        }
    }


    // =================================
    // NO VALID ENTRY
    // =================================

    throw new Error(
        'No valid root index.html found'
    );
}


// =====================================
// FILE SIZE VALIDATION
// =====================================

function validateFileSize(fileSize) {

    const maxSize =
        100 * 1024 * 1024;

    if (fileSize > maxSize) {

        throw new Error(
            'ZIP file exceeds 100MB limit'
        );
    }
}


// =====================================
// MIME TYPE HANDLING
// =====================================

function getContentType(fullPath) {

    return (
        mime.lookup(fullPath)
        || 'application/octet-stream'
    );
}


// =====================================
// WALK DIRECTORY RECURSIVELY
// =====================================

function walkDirectory(dir) {

    let results = [];

    const files =
        fs.readdirSync(dir);

    for (const file of files) {

        if (
            shouldIgnore(file)
        ) {

            continue;
        }

        if (
            shouldIgnoreFolder(file)
        ) {

            continue;
        }

        const fullPath =
            path.join(dir, file);

        const stat =
            fs.statSync(fullPath);

        if (stat.isDirectory()) {

            results = results.concat(

                walkDirectory(fullPath)
            );

        } else {

            results.push(fullPath);
        }
    }

    return results;
}


// =====================================
// CLEANUP DEPLOYMENT FILES
// =====================================

function cleanupDeployment(paths) {

    for (const targetPath of paths) {

        if (
            fs.existsSync(targetPath)
        ) {

            fs.rmSync(
                targetPath,
                {
                    recursive: true,
                    force: true
                }
            );
        }
    }
}


// =====================================
// VALIDATE ZIP EXTENSION
// =====================================

function validateZipExtension(fileName) {

    if (
        !fileName
            .toLowerCase()
            .endsWith('.zip')
    ) {

        throw new Error(
            'Only ZIP uploads are allowed'
        );
    }
}


// =====================================
// DETECT DANGEROUS FILES
// =====================================

function isDangerousFile(fileName) {

    const dangerousExtensions = [

        '.exe',

        '.bat',

        '.cmd',

        '.sh',

        '.ps1',

        '.msi'
    ];

    return dangerousExtensions.some(

        ext => fileName
            .toLowerCase()
            .endsWith(ext)
    );
}


// =====================================
// VALIDATE DEPLOYMENT FILES
// =====================================

function validateDeploymentFiles(files) {

    for (const file of files) {

        const normalized =
            normalizePath(file);

        if (
            isDangerousFile(
                normalized
            )
        ) {

            throw new Error(

                `Dangerous file blocked: ${normalized}`
            );
        }
    }
}


// =====================================
// EXPORTS
// =====================================

module.exports = {

    normalizePath,

    validateExtractedPath,

    resolveDeploymentEntry,

    validateFileSize,

    getContentType,

    walkDirectory,

    cleanupDeployment,

    validateZipExtension,

    validateDeploymentFiles
};