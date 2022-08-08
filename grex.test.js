/*
 * Copyright © 2022 Peter M. Stahl pemistahl@gmail.com
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either expressed or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const { RegExpBuilder } = require("./node/grex");
const XRegExp = require("xregexp");

test("no test cases", () => {
    expect(() => RegExpBuilder.from([]).build()).toThrow(
        "No test cases have been provided for regular expression generation");
});

test("default settings", () => {
    const testCases = ["abc", "abd", "abe"];
    const pattern = RegExpBuilder.from(testCases).build();
    expect(pattern).toBe("^ab[c-e]$");
    const regex = XRegExp(pattern);
    for (const testCase of testCases) {
        expect(testCase).toMatch(regex);
    }
});

test("escaping", () => {
    const testCases = ["My ♥ and 💩 is yours."];
    const pattern = RegExpBuilder.from(testCases).withEscapingOfNonAsciiChars(false).build();
    expect(pattern).toBe("^My \\u{2665} and \\u{1f4a9} is yours\\.$");
    const regex = XRegExp(pattern, "u");
    for (const testCase of testCases) {
        expect(testCase).toMatch(regex);
    }
});

test("escaping with surrogate pairs", () => {
    const testCases = ["My ♥ and 💩 is yours."];
    const pattern = RegExpBuilder.from(testCases).withEscapingOfNonAsciiChars(true).build();
    expect(pattern).toBe("^My \\u{2665} and \\u{d83d}\\u{dca9} is yours\\.$");
    const regex = XRegExp(pattern);
    for (const testCase of testCases) {
        expect(testCase).toMatch(regex);
    }
});

test("capturing groups", () => {
    const testCases = ["efgh", "abcxy", "abcw"];
    const pattern = RegExpBuilder.from(testCases).withCapturingGroups().build();
    expect(pattern).toBe("^(abc(xy|w)|efgh)$");
    const regex = XRegExp(pattern);
    for (const testCase of testCases) {
        expect(testCase).toMatch(regex);
    }
});

test("case-insensitive matching", () => {
    const testCases = ["ABC", "zBC", "abc", "AbC", "aBc"];
    const pattern = RegExpBuilder.from(testCases).withCaseInsensitiveMatching().build();
    expect(pattern).toBe("(?i)^[az]bc$");
    const regex = XRegExp(pattern);
    for (const testCase of testCases) {
        expect(testCase).toMatch(regex);
    }
});

test("verbose mode", () => {
    const testCases = ["[a-z]", "(d,e,f)"];
    const pattern = RegExpBuilder.from(testCases).withVerboseMode().build();
    expect(pattern).toBe(
`(?x)
^
  (?:
    \\(d,e,f\\)
    |
    \\[a\\-z\\]
  )
$`
    );
    const regex = XRegExp(pattern);
    for (const testCase of testCases) {
        expect(testCase).toMatch(regex);
    }
});

test("case-insensitive matching and verbose mode", () => {
    const testCases = ["Ä@Ö€Ü", "ä@ö€ü", "Ä@ö€Ü", "ä@Ö€ü"];
    const pattern = RegExpBuilder.from(testCases)
        .withCaseInsensitiveMatching()
        .withVerboseMode()
        .build();
    expect(pattern).toBe(
`(?ix)
^
  ä@ö€ü
$`
    );
    const regex = XRegExp(pattern);
    for (const testCase of testCases) {
        expect(testCase).toMatch(regex);
    }
});

test("conversion of repetitions", () => {
    const testCases = ["a", "b\nx\nx", "c"];
    const pattern = RegExpBuilder.from(testCases).withConversionOfRepetitions().build();
    expect(pattern).toBe("^(?:b(?:\\nx){2}|[ac])$");
    const regex = XRegExp(pattern);
    for (const testCase of testCases) {
        expect(testCase).toMatch(regex);
    }
});

test("escaping and conversion of repetitions", () => {
    const testCases = ["My ♥♥♥ and 💩💩 is yours."];
    const pattern = RegExpBuilder.from(testCases)
        .withEscapingOfNonAsciiChars(false)
        .withConversionOfRepetitions()
        .build();
    expect(pattern).toBe("^My \\u{2665}{3} and \\u{1f4a9}{2} is yours\\.$");
    const regex = XRegExp(pattern, "u");
    for (const testCase of testCases) {
        expect(testCase).toMatch(regex);
    }
});

test("conversion of digits", () => {
    const testCases = ["a1b2c3"];
    const pattern = RegExpBuilder.from(testCases).withConversionOfDigits().build();
    expect(pattern).toBe("^a\\db\\dc\\d$");
    const regex = XRegExp(pattern);
    for (const testCase of testCases) {
        expect(testCase).toMatch(regex);
    }
});

test("conversion of non-digits", () => {
    const testCases = ["a1b2c3"];
    const pattern = RegExpBuilder.from(testCases).withConversionOfNonDigits().build();
    expect(pattern).toBe("^\\D1\\D2\\D3$");
    const regex = XRegExp(pattern);
    for (const testCase of testCases) {
        expect(testCase).toMatch(regex);
    }
});

test("conversion of whitespace", () => {
    const testCases = ["\n\t", "\r"];
    const pattern = RegExpBuilder.from(testCases).withConversionOfWhitespace().build();
    expect(pattern).toBe("^\\s(?:\\s)?$");
    const regex = XRegExp(pattern);
    for (const testCase of testCases) {
        expect(testCase).toMatch(regex);
    }
});

test("conversion of non-whitespace", () => {
    const testCases = ["a1 b2 c3"];
    const pattern = RegExpBuilder.from(testCases).withConversionOfNonWhitespace().build();
    expect(pattern).toBe("^\\S\\S \\S\\S \\S\\S$");
    const regex = XRegExp(pattern);
    for (const testCase of testCases) {
        expect(testCase).toMatch(regex);
    }
});

test("conversion of words", () => {
    const testCases = ["abc", "1234"];
    const pattern = RegExpBuilder.from(testCases).withConversionOfWords().build();
    expect(pattern).toBe("^\\w\\w\\w(?:\\w)?$");
    const regex = XRegExp(pattern);
    for (const testCase of testCases) {
        expect(testCase).toMatch(regex);
    }
});

test("conversion of non-words", () => {
    const testCases = ["abc 1234"];
    const pattern = RegExpBuilder.from(testCases).withConversionOfNonWords().build();
    expect(pattern).toBe("^abc\\W1234$");
    const regex = XRegExp(pattern);
    for (const testCase of testCases) {
        expect(testCase).toMatch(regex);
    }
});
