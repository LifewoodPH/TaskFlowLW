const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'components');
const filesToProcess = [];

function findFiles(directory) {
    const files = fs.readdirSync(directory);
    for (const file of files) {
        const fullPath = path.join(directory, file);
        if (fs.statSync(fullPath).isDirectory()) {
            findFiles(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            if (file !== 'SplashScreen.tsx') {
                filesToProcess.push(fullPath);
            }
        }
    }
}

findFiles(dir);

const replacements = [
    [/text-indigo-/g, 'text-primary-'],
    [/bg-indigo-/g, 'bg-primary-'],
    [/ring-indigo-/g, 'ring-primary-'],
    [/border-indigo-/g, 'border-primary-'],
    [/from-indigo-/g, 'from-primary-'],
    [/to-indigo-/g, 'to-primary-'],
    [/via-indigo-/g, 'via-primary-'],
    [/shadow-indigo-/g, 'shadow-primary-'],

    [/text-blue-/g, 'text-primary-'],
    [/bg-blue-/g, 'bg-primary-'],
    [/ring-blue-/g, 'ring-primary-'],
    [/border-blue-/g, 'border-primary-'],
    [/from-blue-/g, 'from-primary-'],
    [/to-blue-/g, 'to-primary-'],
    [/via-blue-/g, 'via-primary-'],
    [/shadow-blue-/g, 'shadow-primary-'],

    [/text-purple-/g, 'text-primary-'],
    [/bg-purple-/g, 'bg-primary-'],
    [/ring-purple-/g, 'ring-primary-'],
    [/border-purple-/g, 'border-primary-'],
    [/from-purple-/g, 'from-primary-'],
    [/to-purple-/g, 'to-primary-'],
    [/via-purple-/g, 'via-primary-'],
    [/shadow-purple-/g, 'shadow-primary-'],

    // Specific replacements for the layout issues:
    // replacing /8 and /12 with standard tailwind values: /10 and /20
    // Use word boundaries to prevent matching /80 or w-1/12
    [/\/8(?=[\s"'])/g, '/10'],
    [/(bg|border|ring|text|shadow|from|to|via)-([a-z0-9-]+)\/12(?=[\s"'])/g, '$1-$2/20']
];

let updatedCount = 0;

for (const file of filesToProcess) {
    let content = fs.readFileSync(file, 'utf8');
    let newContent = content;

    for (const [regex, replacement] of replacements) {
        newContent = newContent.replace(regex, replacement);
    }

    if (content !== newContent) {
        fs.writeFileSync(file, newContent, 'utf8');
        updatedCount++;
    }
}

console.log(`Updated ${updatedCount} files.`);
