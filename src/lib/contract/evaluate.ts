import { NS } from "bitburner";

let ns: NS;

interface Contract {
    name: string;
    title: string;
    description: string;
    output: (input: string, solution: boolean | number | number[] | number[][] | string[]) => string;
    solver: (data: string) => boolean | number | number[] | number[][] | string[];
}

let contracts: Contract[] = [
    {
        name: 'largest_prime',
        title: 'Find Largest Prime Factor',
        description: 'Determines the largest prime factor of a given number.',
        output: (input, solution) => `The largest prime factor of ${input} is ${solution}.`,
        solver: (data) => {
            let num = parseInt(data);
            let factor = 2;
            while (num > Math.pow(factor - 1, 2)) {
                while (num % factor === 0) {
                    num /= factor;
                }
                factor += factor % 2 === 0 ? 1 : 2;
            }
    
            return num === 1 ? Math.max(2, factor - 2) : num;
        },
    },
    {
        name: 'continuous_subarray',
        title: 'Subarray with Maximum Sum',
        description: '',
        output: (input, solution) => `The largest sum of a subarray in ${input} is ${solution}.`,
        solver: (data) => {
            let numbers = JSON.parse(data) as number[];
            for (let i = 1; i < data.length; i++) {
                numbers[i] = Math.max(numbers[i], numbers[i] + numbers[i - 1]);
            }
            return Math.max(...numbers);
        }
    },
    {
        name: 'positive_sums',
        title: 'Total Ways to Sum',
        description: '',
        output: (input, solution) => `The number ${input} can be written as ${solution} unique sums of more than one positive integers.`,
        solver: (data) => {
            let number = parseInt(data);
            let results: number[] = new Array(number+1).map((_,index) => index === 0 ? 1 : 0);
            for (let i = 1; i < number; i++) {
                for (let j = i; j <= number; j++) {
                    results[j] += results[j-i];
                }
            }
            return results[number];
        }
    },
    {
        name: 'unravel_matrix',
        title: 'Spiralize Matrix',
        description: '',
        output: (input, solution) =>  `The matrix\n${input}\ncan be unravelled as\n${solution}.`,
        solver: (data) => {
            let matrix: number[][] = JSON.parse(data);
            let rows = matrix.length;
            let columns = matrix[0].length;

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

            return sequence.map(position => matrix[position.y][position.x]);
        }
    },
    {
        name: 'array_jumping',
        title: 'Array Jumping Game',
        description: '',
        output: (input, solution) => `The final space in the array\n${input}\nis ${!solution ? 'not ' : ''}reachable.`,
        solver: (data) => {
            let numbers = JSON.parse(data) as number[];
            let reachable: boolean[] = numbers.map((_,index) => index === 0);
            for (let i = 0; i < numbers.length; i++) {
                if (!reachable[i]) {
                    continue;
                }
                for (let j = i + 1; j <= i + numbers[i]; j++) {
                    reachable[j] = true;
                }
            }
            return reachable[numbers.length-1];
        }
    },
    {
        name: 'overlapping_intervals',
        title: 'Merge Overlapping Intervals',
        description: '',
        output: (input, solution) => `Merging the intervals\n${input}\ngives\n${solution}.`,
        solver: (data) => {
            const input: number[][] = JSON.parse(data);
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
        }
    },
    {
        name: 'generate_ips',
        title: 'Generate IP Addresses',
        description: '',
        output: (input, solution) => `All ips that can be formed from ${input} are\n${solution}`,
        solver: (data) => {
            const options: string[][] = [];
            const number: string = data.toString();
            for (let i = 0; i < 27; i++) {
                const a = i % 3 + 1;
                const b = Math.floor(i / 3) % 3 + 1;
                const c = Math.floor(i / 9) % 3 + 1;

                options.push([
                    number.substring(0,a),
                    number.substring(a,a+b),
                    number.substring(a+b,a+b+c),
                    number.substring(a+b+c)
                ]);
            }
            return options.map(option => option.map(num => parseInt(num)))
                .filter(option => option.every(num => 0 <= num && num <= 255))
                .map(option => option.map(num => num.toString()).join('.'))
                .filter(option => option.length === number.length + 3);
        }
    },
    {
        name: 'trader_1',
        title: 'Algorithmic Stock Trader I',
        description: '',
        output: (input, solution) => `The largest profit that can be made in a single trade is $${solution}.`,
        solver: (data) => {
            const prices: number[] = JSON.parse(data);
            const profits = prices.map((price, index, prices) => Math.max(...prices.slice(index+1)) - price)
                .map(profit => profit < 0 ? 0 : profit);
            return Math.max(...profits);
        }
    },
    {
        name: 'trader_2',
        title: 'Algorithmic Stock Trader II',
        description: '',
        output: (input, solution) => ``,
        solver: (data) => {
            return 1;
        }
    },
    {
        name: 'trader_3',
        title: 'Algorithmic Stock Trader III',
        description: '',
        output: (input, solution) => `The largest profit to be made with two trades is $${solution}.`,
        solver: (data) => {
            const prices: number[] = JSON.parse(data);
            const trades = prices.map((buy, buyIndex) => prices.map((sell, sellIndex) => ({ buy, buyIndex, sell, sellIndex })))
                .flat(1)
                .filter(trade => trade.buyIndex < trade.sellIndex && trade.buy < trade.sell);
            const tradePairs = trades.map(first => trades.map(second => ({ first, second })))
                .flat(1)
                .filter(pair => pair.first.sellIndex <= pair.second.buyIndex);
            const profits = tradePairs.map(pair => pair.first.sell - pair.first.buy + pair.second.sell - pair.second.buy);
            return Math.max(...profits);
        }
    },
    {
        name: 'trader_4',
        title: 'Algorithmic Stock Trader IV',
        description: '',
        output: (input, solution) => ``,
        solver: (data) => {
            return 1;
        }
    },
    {
        name: 'triangle_path',
        title: 'Minimum Path Sum in a Triangle',
        description: '',
        output: (input, solution) => ``,
        solver: (data) => {
            return 1;
        }
    },
    {
        name: 'grid_paths_1',
        title: 'Unique Paths in a Grid I',
        description: '',
        output: (input, solution) => `The number of unique paths in a grid of size ${input} from one corner to the opposite is ${solution}.`,
        solver: (data) => {
            const dim = JSON.parse(data) as number[];
            const rows = Math.min(...dim);
            const columns = Math.max(...dim);

            let result = 1;
            for (let i = columns; i > rows; i--) result *= i;
            for (let i = 2; i <= rows; i++) result /= i;

            return result;
        }
    },
    {
        name: 'grid_paths_2',
        title: 'Unique Paths in a Grid II',
        description: '',
        output: (input, solution) => ``,
        solver: (data) => {
            return 1;
        }
    },
    {
        name: 'parentheses',
        title: 'Sanitize Parentheses in Expression',
        description: '',
        output: (input, solution) => ``,
        solver: (data) => {
            return 1;
        }
    },
    {
        name: 'valid_expressions',
        title: 'Find All Valid Math Expressions',
        description: '',
        output: (input, solution) => `All valid expressions using "${input[0]}" that evaluate to ${input[1]} are\n${solution}`,
        solver: (data) => {
            return 1;
        }
    }
];

function helpMenu(ns: NS, data: string): string {
    if (contracts.some(contract => contract.name === data)) {
        const contract = contracts.find(cont => cont.name === data);
        return [
            '',
            `  Name: ${contract.name}`,
            `  Title: ${contract.title}`,
            `  Description: ${contract.description}`,
        ].join('\n');
    } else {
        return [
            '',
            `Unknown contract. The following contracts are available.`,
            ...contracts.map(contract => `  ${contract.name}: ${contract.title}`),
        ].join('\n');
    }
}

function solve(name: string, input: string): any {
    const contract = contracts.find(cont => cont.name === name);
    return contract.solver(input);
}

export async function main(local_ns: NS) {
    ns = local_ns;
    const func = ns.args[0] as string;
    const input = ns.args[1] as string;
    if (contracts.some(contract => contract.name === func)) {
        ns.tprint(solve(func, input));
    } else {
        ns.tprint(helpMenu(ns, input));
        return;
    }
}