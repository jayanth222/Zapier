"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = parse;
function parse(text, values, startDelimiter = "{", endDelimiter = "}") {
    let startIndex = 0;
    let endIndex = 1;
    let finalString = "";
    while (endIndex < text.length) {
        if (text[startIndex] === startDelimiter) {
            let endpoint = startIndex + 1;
            while (text[endpoint] !== endDelimiter) {
                endpoint++;
            }
            let stringHoldingValue = text.slice(startIndex + 1, endpoint);
            const keys = stringHoldingValue.split(".");
            let localValues = Object.assign({}, values);
            for (let i = 0; i < keys.length; i++) {
                if (typeof localValues === "string") {
                    localValues = JSON.parse(localValues);
                }
                localValues = localValues[keys[i]];
            }
            finalString += localValues;
            startIndex = endpoint + 1;
            endIndex = endpoint + 2;
        }
        else {
            finalString += text[startIndex];
            startIndex++;
            endIndex++;
        }
    }
    if (text[startIndex]) {
        finalString += text[startIndex];
    }
    return finalString;
}
