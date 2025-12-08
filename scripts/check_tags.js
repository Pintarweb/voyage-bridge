
const fs = require('fs');
const content = fs.readFileSync('src/app/supplier/dashboard/page.tsx', 'utf8');

const divOpens = (content.match(/<div/g) || []).length;
const divCloses = (content.match(/<\/div>/g) || []).length;

console.log(`Div Opens: ${divOpens}`);
console.log(`Div Closes: ${divCloses}`);

if (divOpens !== divCloses) {
    console.error('MISMATCH!');

    // Simple stack checker
    const lines = content.split('\n');
    let balance = 0;
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const opens = (line.match(/<div/g) || []).length;
        const closes = (line.match(/<\/div>/g) || []).length;
        balance += (opens - closes);
        if (balance < 0) {
            console.log(`Negative balance at line ${i + 1}: ${line.trim()}`);
        }
    }
    console.log(`Final Balance: ${balance}`);
} else {
    console.log('Balanced.');
}
