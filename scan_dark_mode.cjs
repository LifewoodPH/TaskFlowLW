const fs = require('fs');
const path = require('path');

const dir = './components';
const files = [];

function walk(directory) {
    const items = fs.readdirSync(directory);
    for (const item of items) {
        const fullPath = path.join(directory, item);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) walk(fullPath);
        else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.jsx')) files.push(fullPath);
    }
}
walk(dir);

const issues = [];
let fileIssuesCount = {};

files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    let hasIssue = false;

    // Extract all className string literals and template literals
    const classNameRegex = /className=(?:["']([^"']+)["']|\{`([^`]+)`\})/g;
    let match;

    while ((match = classNameRegex.exec(content)) !== null) {
        const clsString = (match[1] || match[2] || "").replace(/\s+/g, ' ');

        const missingDarkText = /(?<!dark:)(?<!hover:)(?<!focus:)(?<!active:)(text-black|text-slate-900|text-slate-800)\b/.test(clsString) && !/dark:text-/.test(clsString);
        const missingDarkBg = /(?<!dark:)(?<!hover:)(?<!focus:)(?<!active:)(bg-white|bg-slate-50|bg-slate-100)\b/.test(clsString) && !/dark:bg-/.test(clsString) && !/text-transparent/.test(clsString);
        const missingBorder = /(?<!dark:)(?<!hover:)(?<!focus:)(?<!active:)(border-black|border-slate-200|border-slate-300)\b/.test(clsString) && !/dark:border-/.test(clsString);

        const missingDarkHoverBg = /(?<!dark:)(hover:bg-white|hover:bg-slate-50|hover:bg-slate-100|hover:bg-slate-200)\b/.test(clsString) && !/dark:hover:bg-/.test(clsString);
        const missingDarkHoverText = /(?<!dark:)(hover:text-black|hover:text-slate-900|hover:text-slate-800)\b/.test(clsString) && !/dark:hover:text-/.test(clsString);

        const hasHardcodedHex = /(?<!dark:)text-\[[#[0-9a-fA-F]+\]/.test(clsString) && !/dark:text-/.test(clsString);

        if (missingDarkText || missingDarkBg || missingBorder || missingDarkHoverBg || missingDarkHoverText || hasHardcodedHex) {
            if (!hasIssue) {
                issues.push(`\n--- ${file} ---`);
                hasIssue = true;
            }
            let reasons = [];
            if (missingDarkText) reasons.push('Missing dark:text');
            if (missingDarkBg) reasons.push('Missing dark:bg');
            if (missingBorder) reasons.push('Missing dark:border');
            if (missingDarkHoverBg) reasons.push('Missing dark:hover:bg');
            if (missingDarkHoverText) reasons.push('Missing dark:hover:text');
            if (hasHardcodedHex) reasons.push('Hardcoded hex text without dark variant');

            issues.push(`[${reasons.join(', ')}] : ${clsString}`);
            fileIssuesCount[file] = (fileIssuesCount[file] || 0) + 1;
        }
    }
});

console.log(`Found issues in ${Object.keys(fileIssuesCount).length} files. Writing to dark_mode_issues.log`);
fs.writeFileSync('dark_mode_issues.log', issues.join('\n'));
