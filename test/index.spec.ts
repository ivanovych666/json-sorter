import {Comparators} from '../src/comparators';
import {jsonSort} from '../src';
import {Compare} from '../src/Comparator';

interface TestCaseOutput {
    name?: string,
    compare: Compare<string>,
    output: string,
}

interface TestCase {
    name?: string,
    input: string,
    outputs: Array<TestCaseOutput>,
}

type TestCases = Array<TestCase>;

const generateDoNothingTestCase = (value: string): TestCase => {
    return {
        name: `Do nothing: ${value}`,
        input: value,
        outputs: Object.values(Comparators).map(compare => {
            return {
                compare,
                output: value,
            };
        }),
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
    0,
    Number.MAX_SAFE_INTEGER,
    Number.EPSILON,
];

const testCases: TestCases = [
    ...generateDoNothingTestCases([
        ...primitiveValues,
        [],
        ...primitiveValues.map(value => [value, value]),
        {},
        ...primitiveValues.map(value => ({value})),
    ].map(value => JSON.stringify(value))),
    generateDoNothingTestCase(`{"a":1,"a":2}`),
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
    }
];

testCases.forEach((testCase, index) => {
    describe(testCase.name || `Test Case #${index + 1}`, () => {
        testCase.outputs.forEach(({name, output, compare}) => {
            it(name || compare.name, () => {
                const result = jsonSort(testCase.input, compare);
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
