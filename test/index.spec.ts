import {Comparators} from '../src/comparators';
import {jsonSort} from '../src';
import {Compare} from '../src/Comparator';

interface SortOptions {
    caseInsensitive: boolean;
    reverse: boolean;
    natural: boolean;
    indent: number | string;
    newline: string;
    finalNewline: boolean;
}

interface TestCaseOutput {
    name?: string,
    compare?: Compare<string>,
    options?: Partial<SortOptions>,
    output: string,
}

interface TestCase {
    name?: string,
    input: string,
    outputs: Array<TestCaseOutput>,
}

const generateDoNothingTestCase = (value: string): TestCase => {
    return {
        name: `Do nothing: ${value}`,
        input: value,
        outputs: Object.values(Comparators).map(compare => {
            return {
                compare,
                output: value,
            };
        }) as Array<TestCaseOutput>,
    };
};

const generateDoNothingTestCases = (values: string[]): Array<TestCase> => {
    return values.map(generateDoNothingTestCase);
}

const primitiveValues = [
    null,
    true,
    false,
    '',
    '"',
    0,
    Number.MAX_SAFE_INTEGER,
    Number.EPSILON,
];

const testCases: Array<TestCase> = [
    generateDoNothingTestCase(`""\n\r`),
    generateDoNothingTestCase(`{\n  "a": 1\n}\n`),
    generateDoNothingTestCase(`[
    {
        "a": [
            1,
            {
                "b": 2
            },
            3
        ]
    }
]
`),
    generateDoNothingTestCase(`""\n\r`),
    generateDoNothingTestCase(`{\n  "a": 1\n}\n`),
    ...generateDoNothingTestCases([
        ...primitiveValues,
        [],
        ...primitiveValues.map(value => [value, value]),
        {},
        ...primitiveValues.map(value => ({value})),
    ].map(value => JSON.stringify(value))),
    generateDoNothingTestCase(`{"a":1,"a":2}`),
    {
        name: 'Default options',
        input: `[{"a":1,"b":2}]`,
        outputs: [
            {
                name: 'alphabeticalSort by default',
                output: `[{"a":1,"b":2}]`,
            },
        ],
    },
    {
        name: 'Object inside Array',
        input: `[{"a":1,"b":2}]`,
        outputs: [
            {
                compare: Comparators.alphabeticalSort,
                output: `[{"a":1,"b":2}]`,
            },
            {
                compare: Comparators.alphabeticalCiSort,
                output: `[{"a":1,"b":2}]`,
            },
            {
                compare: Comparators.alphabeticalReverseSort,
                output: `[{"b":2,"a":1}]`,
            },
            {
                compare: Comparators.alphabeticalReverseCiSort,
                output: `[{"b":2,"a":1}]`,
            },
            {
                compare: Comparators.naturalSort,
                output: `[{"a":1,"b":2}]`,
            },
            {
                compare: Comparators.naturalCiSort,
                output: `[{"a":1,"b":2}]`,
            },
            {
                compare: Comparators.naturalReverseSort,
                output: `[{"b":2,"a":1}]`,
            },
            {
                compare: Comparators.naturalReverseCiSort,
                output: `[{"b":2,"a":1}]`,
            },
        ],
    },
    {
        input: `{"a":1,"b":2}`,
        outputs: [
            {
                compare: Comparators.alphabeticalSort,
                output: `{"a":1,"b":2}`,
            },
            {
                compare: Comparators.alphabeticalCiSort,
                output: `{"a":1,"b":2}`,
            },
            {
                compare: Comparators.alphabeticalReverseSort,
                output: `{"b":2,"a":1}`,
            },
            {
                compare: Comparators.alphabeticalReverseCiSort,
                output: `{"b":2,"a":1}`,
            },
            {
                compare: Comparators.naturalSort,
                output: `{"a":1,"b":2}`,
            },
            {
                compare: Comparators.naturalCiSort,
                output: `{"a":1,"b":2}`,
            },
            {
                compare: Comparators.naturalReverseSort,
                output: `{"b":2,"a":1}`,
            },
            {
                compare: Comparators.naturalReverseCiSort,
                output: `{"b":2,"a":1}`,
            },
        ],
    },
    {
        input: `{"1":1,"10":10,"5":5,"b":"b","a":"a","A":"A","B":"B"}`,
        outputs: [
            {
                compare: Comparators.alphabeticalSort,
                output: `{"1":1,"10":10,"5":5,"A":"A","B":"B","a":"a","b":"b"}`,
            },
            {
                compare: Comparators.alphabeticalCiSort,
                output: `{"1":1,"10":10,"5":5,"a":"a","A":"A","b":"b","B":"B"}`,
            },
            {
                compare: Comparators.alphabeticalReverseSort,
                output: `{"b":"b","a":"a","B":"B","A":"A","5":5,"10":10,"1":1}`,
            },
            {
                compare: Comparators.alphabeticalReverseCiSort,
                output: `{"b":"b","B":"B","a":"a","A":"A","5":5,"10":10,"1":1}`,
            },

            {
                compare: Comparators.naturalSort,
                output: `{"1":1,"5":5,"10":10,"A":"A","B":"B","a":"a","b":"b"}`,
            },
            {
                compare: Comparators.naturalCiSort,
                output: `{"1":1,"5":5,"10":10,"a":"a","A":"A","b":"b","B":"B"}`,
            },
            {
                compare: Comparators.naturalReverseSort,
                output: `{"b":"b","a":"a","B":"B","A":"A","10":10,"5":5,"1":1}`,
            },
            {
                compare: Comparators.naturalReverseCiSort,
                output: `{"b":"b","B":"B","a":"a","A":"A","10":10,"5":5,"1":1}`,
            },
        ]
    },
    {
        input: `{"1":1,"10":10,"5":5,"b":"b","a":"a","A":"A","B":"B"}`,
        outputs: [
            {
                options: {
                    caseInsensitive: false,
                    natural: false,
                    reverse: false,
                },
                output: `{"1":1,"10":10,"5":5,"A":"A","B":"B","a":"a","b":"b"}`,
            },
            {
                options: {
                    caseInsensitive: true,
                    natural: false,
                    reverse: false,
                },
                output: `{"1":1,"10":10,"5":5,"a":"a","A":"A","b":"b","B":"B"}`,
            },
            {
                options: {
                    caseInsensitive: false,
                    natural: false,
                    reverse: true,
                },
                output: `{"b":"b","a":"a","B":"B","A":"A","5":5,"10":10,"1":1}`,
            },
            {
                options: {
                    caseInsensitive: true,
                    natural: false,
                    reverse: true,
                },
                output: `{"b":"b","B":"B","a":"a","A":"A","5":5,"10":10,"1":1}`,
            },
            {
                options: {
                    caseInsensitive: false,
                    natural: true,
                    reverse: false,
                },
                output: `{"1":1,"5":5,"10":10,"A":"A","B":"B","a":"a","b":"b"}`,
            },
            {
                options: {
                    caseInsensitive: true,
                    natural: true,
                    reverse: false,
                },
                output: `{"1":1,"5":5,"10":10,"a":"a","A":"A","b":"b","B":"B"}`,
            },
            {
                options: {
                    caseInsensitive: false,
                    natural: true,
                    reverse: true,
                },
                output: `{"b":"b","a":"a","B":"B","A":"A","10":10,"5":5,"1":1}`,
            },
            {
                options: {
                    caseInsensitive: true,
                    natural: true,
                    reverse: true,
                },
                output: `{"b":"b","B":"B","a":"a","A":"A","10":10,"5":5,"1":1}`,
            },
        ]
    },
    {
        name: 'Custom indent',
        input: `[{"a":1,"b":2}]`,
        outputs: [
            {
                options: {
                    indent: '  '
                },
                name: 'alphabeticalSort by default',
                output: `[
  {
    "a": 1,
    "b": 2
  }
]`,
            },
        ],
    },
];

testCases.forEach((testCase, index) => {
    describe(testCase.name || `Test Case #${index + 1}`, () => {
        testCase.outputs.forEach(({name, output, compare, options}) => {
            it(name || compare?.name || 'undefined', () => {
                const args: [input: string, options?: any] = [testCase.input];
                if (compare) {
                    args.push({compare});
                }
                if (options) {
                    args.push({...options});
                }
                const result = jsonSort.apply(null, args);
                expect(result).toBe(output);
            });
        });
    });
});

const invalidTestCases = [
    '{} extra content',
    '"',
    '"\n',
    '"\r',
    '[',
    '[1,',
    '[}',
    '{',
    '{"a":',
    '{"a":1,'
];

describe('Invalid JSON', () => {

    invalidTestCases.forEach((testCase, index) => {
        it(`TestCase #${index + 1}`, () => {
            const t = () => jsonSort(testCase);
            expect(t).toThrow(Error);
        });
    });
});
