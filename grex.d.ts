/* tslint:disable */
/* eslint-disable */
/**
* This class builds regular expressions from user-provided test cases.
*/
export class RegExpBuilder {
  free(): void;
/**
* Specifies the test cases to build the regular expression from.
*
* The test cases need not be sorted because `RegExpBuilder` sorts them internally.
*
* ⚠ Throws an error if `testCases` is empty.
* @param {string[]} testCases
* @returns {RegExpBuilder}
*/
  static from(testCases: string[]): RegExpBuilder;
/**
* Tells `RegExpBuilder` to convert any Unicode decimal digit to character class `\d`.
*
* This method takes precedence over `withConversionOfWords` if both are set.
* Decimal digits are converted to `\d`, the remaining word characters to `\w`.
*
* This method takes precedence over `withConversionOfWhitespace` if both are set.
* Decimal digits are converted to `\d`, the remaining non-whitespace characters to `\S`.
* @returns {RegExpBuilder}
*/
  withConversionOfDigits(): RegExpBuilder;
/**
* Tells `RegExpBuilder` to convert any character which is not
* a Unicode decimal digit to character class `\D`.
*
* This method takes precedence over `withConversionOfNonWords` if both are set.
* Non-digits which are also non-word characters are converted to `\D`.
*
* This method takes precedence over `withConversionOfNonWhitespace` if both are set.
* Non-digits which are also non-space characters are converted to `\D`.
* @returns {RegExpBuilder}
*/
  withConversionOfNonDigits(): RegExpBuilder;
/**
* Tells `RegExpBuilder` to convert any Unicode whitespace character to character class `\s`.
*
* This method takes precedence over `withConversionOfNonDigits` if both are set.
* Whitespace characters are converted to `\s`, the remaining non-digit characters to `\D`.
*
* This method takes precedence over `withConversionOfNonWords` if both are set.
* Whitespace characters are converted to `\s`, the remaining non-word characters to `\W`.
* @returns {RegExpBuilder}
*/
  withConversionOfWhitespace(): RegExpBuilder;
/**
* Tells `RegExpBuilder` to convert any character which is not
* a Unicode whitespace character to character class `\S`.
* @returns {RegExpBuilder}
*/
  withConversionOfNonWhitespace(): RegExpBuilder;
/**
* Tells `RegExpBuilder` to convert any Unicode word character to character class `\w`.
*
* This method takes precedence over `withConversionOfNonDigits` if both are set.
* Word characters are converted to `\w`, the remaining non-digit characters to `\D`.
*
* This method takes precedence over `withConversionOfNonWhitespace` if both are set.
* Word characters are converted to `\w`, the remaining non-space characters to `\S`.
* @returns {RegExpBuilder}
*/
  withConversionOfWords(): RegExpBuilder;
/**
* Tells `RegExpBuilder` to convert any character which is not
* a Unicode word character to character class `\W`.
*
* This method takes precedence over `withConversionOfNonWhitespace` if both are set.
* Non-words which are also non-space characters are converted to `\W`.
* @returns {RegExpBuilder}
*/
  withConversionOfNonWords(): RegExpBuilder;
/**
* Tells `RegExpBuilder` to detect repeated non-overlapping substrings and
* to convert them to `{min,max}` quantifier notation.
* @returns {RegExpBuilder}
*/
  withConversionOfRepetitions(): RegExpBuilder;
/**
* Tells `RegExpBuilder` to enable case-insensitive matching of test cases
* so that letters match both upper and lower case.
* @returns {RegExpBuilder}
*/
  withCaseInsensitiveMatching(): RegExpBuilder;
/**
* Tells `RegExpBuilder` to replace non-capturing groups by capturing ones.
* @returns {RegExpBuilder}
*/
  withCapturingGroups(): RegExpBuilder;
/**
* Tells `RegExpBuilder` to convert non-ASCII characters to unicode escape sequences.
* The parameter `useSurrogatePairs` specifies whether to convert astral code planes
* (range `U+010000` to `U+10FFFF`) to surrogate pairs.
* @param {boolean} useSurrogatePairs
* @returns {RegExpBuilder}
*/
  withEscapingOfNonAsciiChars(useSurrogatePairs: boolean): RegExpBuilder;
/**
* Tells `RegExpBuilder` to produce a nicer looking regular expression in verbose mode.
* @returns {RegExpBuilder}
*/
  withVerboseMode(): RegExpBuilder;
/**
* Tells `RegExpBuilder` to remove the caret anchor '^' from the resulting regular
* expression, thereby allowing to match the test cases also when they do not occur
* at the start of a string.
* @returns {RegExpBuilder}
*/
  withoutStartAnchor(): RegExpBuilder;
/**
* Tells `RegExpBuilder` to remove the dollar sign anchor '$' from the resulting regular
* expression, thereby allowing to match the test cases also when they do not occur
* at the end of a string.
* @returns {RegExpBuilder}
*/
  withoutEndAnchor(): RegExpBuilder;
/**
* Tells `RegExpBuilder` to remove the caret and dollar sign anchors from the resulting
* regular expression, thereby allowing to match the test cases also when they occur
* within a larger string that contains other content as well.
* @returns {RegExpBuilder}
*/
  withoutAnchors(): RegExpBuilder;
/**
* Specifies the minimum quantity of substring repetitions to be converted
* if `withConversionOfRepetitions` is set.
*
* If the quantity is not explicitly set with this method, a default value of 1 will be used.
*
* ⚠ Throws an error if `quantity` is zero.
* @param {number} quantity
* @returns {RegExpBuilder}
*/
  withMinimumRepetitions(quantity: number): RegExpBuilder;
/**
* Specifies the minimum length a repeated substring must have in order to be converted
* if `withConversionOfRepetitions` is set.
*
* If the length is not explicitly set with this method, a default value of 1 will be used.
*
* ⚠ Throws an error if `length` is zero.
* @param {number} length
* @returns {RegExpBuilder}
*/
  withMinimumSubstringLength(length: number): RegExpBuilder;
/**
* Builds the actual regular expression using the previously given settings.
* @returns {string}
*/
  build(): string;
}
