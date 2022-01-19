import { NS } from "bitburner";
import { Host } from "lib/state/host";

let _ns: NS;

const registry: { [key: string]: Function } = {};

registry["Find Largest Prime Factor"] = (input: number): number => {
    let factor = 2;
    while (input > Math.pow(factor - 1, 2)) {
        while (input % factor === 0) {
            input /= factor;
        }
        factor += factor % 2 === 0 ? 1 : 2;
    }

    return input === 1 ? Math.max(2, factor - 2) : input;
};

registry["Subarray with Maximum Sum"] = (input: number[]): number => {
    const indicies = new Array(input.length).fill(0).map((_,i) => i);
    const subarrays = indicies.flatMap(start => indicies.map(end => ({ start, end })))
        .map(interval => input.slice(interval.start, interval.end + 1))
        .map(subarr => subarr.reduce((sum,val) => sum + val, 0));
    return Math.max(...subarrays);
};

registry["Total Ways to Sum"] = (input: number): number => {
    let results: number[] = new Array(input+1).fill(0).map((_,index) => index === 0 ? 1 : 0);
    for (let i = 1; i < input; i++) {
        for (let j = i; j <= input; j++) {
            results[j] += results[j-i];
        }
    }
    return results[input];
};

registry["Spiralize Matrix"] = (input: number[][]): number[] => {
    let rows = input.length;
    let columns = input[0].length;

    let position = { x: 0, y: 0 };
    let sequence = [position];
    let direction: "Up" | "Right" | "Down" | "Left" = "Right";

    while (sequence.length < rows * columns) {
        if (direction === "Right") {
            if (position.x + 1 >= columns || sequence.find(point => point.x == position.x + 1 && point.y == position.y)) {
                direction = "Down";
            } else {
                position = { x: position.x + 1, y: position.y };
                sequence.push(position);
            }
        } else if (direction === "Down") {
            if (position.y + 1 >= rows || sequence.find(point => point.x == position.x && point.y == position.y + 1)) {
                direction = "Left";
            } else {
                position = { x: position.x, y: position.y + 1 };
                sequence.push(position);
            }
        } else if (direction === "Left") {
            if (position.x - 1 < 0 || sequence.find(point => point.x == position.x - 1 && point.y == position.y)) {
                direction = "Up";
            } else {
                position = { x: position.x - 1, y: position.y };
                sequence.push(position);
            }
        } else if (direction === "Up") {
            if (position.y - 1 < 0 || sequence.find(point => point.x == position.x && point.y == position.y - 1)) {
                direction = "Right";
            } else {
                position = { x: position.x, y: position.y - 1 };
                sequence.push(position);
            }
        }
    }

    return sequence.map(position => input[position.y][position.x]);
}

registry["Array Jumping Game"] = (input: number[]): boolean => {
    let reachable: boolean[] = input.map((_,index) => index === 0);
    for (let i = 0; i < input.length; i++) {
        if (!reachable[i]) {
            continue;
        }
        for (let j = i + 1; j <= i + input[i]; j++) {
            reachable[j] = true;
        }
    }
    return reachable[input.length-1];
};

registry["Merge Overlapping Intervals"] = (input: number[][]): number[][] => {
    input.sort((a,b) => a[0] - b[0]);

    const result: number[][] = [];
    let start = input[0][0];
    let end = input[0][1];
    for (let interval of input) {
        if (end >= interval[0]) {
            end = Math.max(end, interval[1]);
        } else {
            result.push([start, end]);
            start = interval[0];
            end = interval[1];
        }
    }
    result.push([start, end]);

    return result;
};

registry["Generate IP Addresses"] = (input: string): string[] => {
    const options: string[][] = [];
    for (let i = 0; i < 27; i++) {
        const a = i % 3 + 1;
        const b = Math.floor(i / 3) % 3 + 1;
        const c = Math.floor(i / 9) % 3 + 1;

        options.push([
            input.substring(0,a),
            input.substring(a,a+b),
            input.substring(a+b,a+b+c),
            input.substring(a+b+c)
        ]);
    }
    return options.map(option => option.map(num => parseInt(num)))
        .filter(option => option.every(num => 0 <= num && num <= 255))
        .map(option => option.map(num => num.toString()).join('.'))
        .filter(option => option.length === input.length + 3);
};

registry["Algorithmic Stock Trader I"] = (input: number[]): number => {
    const profits = input.map((price, index, prices) => Math.max(...prices.slice(index+1)) - price)
        .map(profit => profit < 0 ? 0 : profit);
    return Math.max(...profits);
};

registry["Algorithmic Stock Trader II"] = (input: number[]): number => {
    return input.map((price, index, prices) => index === 0 ? 0 : price - prices[index-1])
        .filter(profit => profit > 0)
        .reduce((profit, gain) => profit + gain, 0);
};

registry["Algorithmic Stock Trader III"] = (input: number[]): number => {
    const trades = input.map((buy, buyIndex) => input.map((sell, sellIndex) => ({ buy, buyIndex, sell, sellIndex })))
        .flat(1)
        .filter(trade => trade.buyIndex < trade.sellIndex && trade.buy < trade.sell);
    const tradePairs = trades.map(first => trades.map(second => ({ first, second })))
        .flat(1)
        .filter(pair => pair.first.sellIndex <= pair.second.buyIndex);
    const profits = tradePairs.map(pair => pair.first.sell - pair.first.buy + pair.second.sell - pair.second.buy);
    return Math.max(...profits);
};

registry["Algorithmic Stock Trader IV"] = (input: [number, number[]]): number => {
    const k = input[0];
    const prices = input[1];

    /*const lows: number[] = prices.map((val,i) => ({ value: val, index: i }))
        .filter((val,index,prices) =>
            ( index === 0 || val.value < prices[index-1].value ) &&
            ( index === prices.length - 1 || val.value < prices[index+1].value ))
        .map(price => price.index);
    const highs: number[] = prices.map((val,i) => ({ value: val, index: i }))
        .filter((val,index,prices) =>
            ( index === 0 || val.value > prices[index-1].value ) &&
            ( index === prices.length - 1 || val.value > prices[index+1].value ))
        .map(price => price.index);*/

    const singleDayProfits = prices.map((price, index, prices) => ({ index, profit: index === 0 ? 0 : price - prices[index-1] }))
        .filter(trade => trade.profit > 0);
    const increases: [number, number][] = registry["Merge Overlapping Intervals"](singleDayProfits.map(trade => [trade.index - 1, trade.index]));
    const profits = increases.map(trade => prices[trade[1]] - prices[trade[0]]);

    return profits.sort((a,b) => b-a).slice(0,Math.min(k, profits.length)).reduce((sum,profit) => sum + profit, 0);
};

// TODO: Testing needed
registry["Minimum Path Sum in a Triangle"] = (input: number[][]): number => {
    let index = input.length - 1;
    let curRow = input[index];
    while (index > 0) {
        index--;
        curRow = input[index].map((value,index) => value + Math.min(curRow[index], curRow[index+1]));
    }
    return curRow[0];
};

registry["Unique Paths in a Grid I"] = (input: number[]): number => {
    const rows = Math.min(...input);
    const columns = Math.max(...input);

    let result = 1;
    for (let i = 1; i <= rows - 1; i++) result *= (i + columns - 1);
    for (let i = 2; i <= rows - 1; i++) result /= i;

    return result;
};

registry["Unique Paths in a Grid II"] = (input: number[][]): number => {
    return 1;
};

registry["Sanitize Parentheses in Expression"] = (input: string): string[] => {
    const isValid = (expr: string) => {
        let depth = 0;
        for (let char of expr) {
            if (char === "(") depth++;
            else if (char === ")") depth--;

            if (depth < 0) return false;
        }
        return depth === 0;
    };

    let result = [input];
    while (result.length > 0) {
        if (result.some(isValid)) break;
        result = [...new Set(new Array(result[0].length).fill(0).map((_,i) => i)
            .flatMap(index => result.map(value => `${value.slice(0,index)}${value.slice(index+1)}`))
            .filter(value => value !== ""))];
    }

    return result.length === 0 ? [""] : result.filter(isValid);
};

registry["Find All Valid Math Expressions"] = (input: [string, number]): string[] => {
    const num: string = input[0];
    const target: number = input[1];

    let result: string[] = [num];

    for (let index of new Array(num.length - 1).fill(0).map((_,i) => i + 1).reverse()) {
        result = result.flatMap(expr => {
            const firstHalf = expr.slice(0,index);
            const secondHalf = expr.slice(index);
            return [
                `${firstHalf}+${secondHalf}`,
                `${firstHalf}*${secondHalf}`,
                `${firstHalf}-${secondHalf}`,
                expr,
            ]
        });
    }

    return result
        .filter(expr => {
            try {
                return eval(expr) === target;
            } catch (err) {
                return false;
            }
        });
}

export async function main(ns: NS) {
    while (true) {
        Object.values(Host)
            .filter(host => ns.serverExists(host))
            .flatMap(host => ns.ls(host, ".cct").map(file => ({ host, file })))
            .map(contract => ({
                ...contract,
                title: ns.codingcontract.getContractType(contract.file, contract.host),
                data: ns.codingcontract.getData(contract.file, contract.host),
            }))
            .map(contract => ({
                ...contract,
                solution: registry[contract.title](contract.data),
            }))
            .forEach(contract => {
                const reward = ns.codingcontract.attempt(contract.solution, contract.file, contract.host, { returnReward: true });
                ns.print(reward);
                //ns.print(`{ host: ${contract.host}, file: ${contract.file}, title: ${contract.title}, data: ${contract.data}, answer: ${contract.solution} }`);
            });
        await ns.sleep(600000);
    }

    /*const data = ["21052549", -28];
    const solution = registry["Find All Valid Math Expressions"](data);
    ns.tprint(`Solution: ${solution}`);*/
}