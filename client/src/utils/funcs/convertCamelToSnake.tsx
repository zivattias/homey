type SnakeObj = { [key: string]: any };

export default function convertCamelToSnake(obj: { [key: string]: any }) {
    const snakeObj: SnakeObj = {};

    for (let key in obj) {
        const snakeKey = key.replace(
            /[A-Z]/g,
            (letter) => `_${letter.toLowerCase()}`
        );

        // If the value is an object, recursively call the function to convert its keys
        if (typeof obj[key] === "object" && obj[key] !== null) {
            snakeObj[snakeKey] = convertCamelToSnake(obj[key]);
        } else {
            snakeObj[snakeKey] = obj[key];
        }
    }

    return snakeObj;
}
