console.log("================================START===============================")

const fs = require('fs');

function parseInput(fileName) {
    const re = /(\w+) ([-+]\d+)/gm;
    const content = fs.readFileSync(fileName, 'utf8');
    return [...content.matchAll(re)];
}

function parseInstruction(pos, a) {
    const op = a[1];
    const arg = parseInt(a[2]);
    let result = [pos, 0];

    switch (op) {
        case 'jmp':
            result[0] += arg;
            break;
        case 'acc':
            result[1] += arg;
        default:
            result[0]++;
    }

    return result;
}

function runProgram(input) {
    let i = 0;
    let total = 0;
    let seen = new Set();
    
    while (!(seen.has(i) || i >= input.length)) {
        seen.add(i);
        const [nextPos, acc] = parseInstruction(i, input[i]);
        i = nextPos;
        total += acc;
    }
    return [i, total];
}

const fileName = process.argv[2];

const input = parseInput(fileName);

console.log(runProgram(input));

for (let i = 0; i < input.length; i++) {
    let copy = JSON.parse(JSON.stringify(input));

    if (copy[i][1] === 'nop') {
        copy[i][1] = 'jmp'
    } else if (copy[i][1] === 'jmp') {
        copy[i][1] = 'nop'
    } else {
        continue;
    }

    const [endPos, total] = runProgram(copy);

    // console.log(endPos);

    if (endPos >= input.length) {
        console.log([endPos, total]);
        break;
    }
};