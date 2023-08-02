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

let wasm;
export function __wbg_set_wasm(val) {
    wasm = val;
}


const heap = new Array(128).fill(undefined);

heap.push(undefined, null, true, false);

function getObject(idx) { return heap[idx]; }

let WASM_VECTOR_LEN = 0;

let cachedUint8Memory0 = null;

function getUint8Memory0() {
    if (cachedUint8Memory0 === null || cachedUint8Memory0.byteLength === 0) {
        cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8Memory0;
}

const lTextEncoder = typeof TextEncoder === 'undefined' ? (0, module.require)('util').TextEncoder : TextEncoder;

let cachedTextEncoder = new lTextEncoder('utf-8');

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8Memory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

let cachedInt32Memory0 = null;

function getInt32Memory0() {
    if (cachedInt32Memory0 === null || cachedInt32Memory0.byteLength === 0) {
        cachedInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachedInt32Memory0;
}

const lTextDecoder = typeof TextDecoder === 'undefined' ? (0, module.require)('util').TextDecoder : TextDecoder;

let cachedTextDecoder = new lTextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

let heap_next = heap.length;

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

function dropObject(idx) {
    if (idx < 132) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

let cachedUint32Memory0 = null;

function getUint32Memory0() {
    if (cachedUint32Memory0 === null || cachedUint32Memory0.byteLength === 0) {
        cachedUint32Memory0 = new Uint32Array(wasm.memory.buffer);
    }
    return cachedUint32Memory0;
}

function passArrayJsValueToWasm0(array, malloc) {
    const ptr = malloc(array.length * 4, 4) >>> 0;
    const mem = getUint32Memory0();
    for (let i = 0; i < array.length; i++) {
        mem[ptr / 4 + i] = addHeapObject(array[i]);
    }
    WASM_VECTOR_LEN = array.length;
    return ptr;
}
/**
* This class builds regular expressions from user-provided test cases.
*/
export class RegExpBuilder {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(RegExpBuilder.prototype);
        obj.__wbg_ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_regexpbuilder_free(ptr);
    }
    /**
    * Specifies the test cases to build the regular expression from.
    *
    * The test cases need not be sorted because `RegExpBuilder` sorts them internally.
    *
    * ⚠ Throws an error if `testCases` is empty.
    * @param {any[]} testCases
    * @returns {RegExpBuilder}
    */
    static from(testCases) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArrayJsValueToWasm0(testCases, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.regexpbuilder_from(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return RegExpBuilder.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
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
    withConversionOfDigits() {
        const ret = wasm.regexpbuilder_withConversionOfDigits(this.__wbg_ptr);
        return RegExpBuilder.__wrap(ret);
    }
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
    withConversionOfNonDigits() {
        const ret = wasm.regexpbuilder_withConversionOfNonDigits(this.__wbg_ptr);
        return RegExpBuilder.__wrap(ret);
    }
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
    withConversionOfWhitespace() {
        const ret = wasm.regexpbuilder_withConversionOfWhitespace(this.__wbg_ptr);
        return RegExpBuilder.__wrap(ret);
    }
    /**
    * Tells `RegExpBuilder` to convert any character which is not
    * a Unicode whitespace character to character class `\S`.
    * @returns {RegExpBuilder}
    */
    withConversionOfNonWhitespace() {
        const ret = wasm.regexpbuilder_withConversionOfNonWhitespace(this.__wbg_ptr);
        return RegExpBuilder.__wrap(ret);
    }
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
    withConversionOfWords() {
        const ret = wasm.regexpbuilder_withConversionOfWords(this.__wbg_ptr);
        return RegExpBuilder.__wrap(ret);
    }
    /**
    * Tells `RegExpBuilder` to convert any character which is not
    * a Unicode word character to character class `\W`.
    *
    * This method takes precedence over `withConversionOfNonWhitespace` if both are set.
    * Non-words which are also non-space characters are converted to `\W`.
    * @returns {RegExpBuilder}
    */
    withConversionOfNonWords() {
        const ret = wasm.regexpbuilder_withConversionOfNonWords(this.__wbg_ptr);
        return RegExpBuilder.__wrap(ret);
    }
    /**
    * Tells `RegExpBuilder` to detect repeated non-overlapping substrings and
    * to convert them to `{min,max}` quantifier notation.
    * @returns {RegExpBuilder}
    */
    withConversionOfRepetitions() {
        const ret = wasm.regexpbuilder_withConversionOfRepetitions(this.__wbg_ptr);
        return RegExpBuilder.__wrap(ret);
    }
    /**
    * Tells `RegExpBuilder` to enable case-insensitive matching of test cases
    * so that letters match both upper and lower case.
    * @returns {RegExpBuilder}
    */
    withCaseInsensitiveMatching() {
        const ret = wasm.regexpbuilder_withCaseInsensitiveMatching(this.__wbg_ptr);
        return RegExpBuilder.__wrap(ret);
    }
    /**
    * Tells `RegExpBuilder` to replace non-capturing groups by capturing ones.
    * @returns {RegExpBuilder}
    */
    withCapturingGroups() {
        const ret = wasm.regexpbuilder_withCapturingGroups(this.__wbg_ptr);
        return RegExpBuilder.__wrap(ret);
    }
    /**
    * Tells `RegExpBuilder` to convert non-ASCII characters to unicode escape sequences.
    * The parameter `useSurrogatePairs` specifies whether to convert astral code planes
    * (range `U+010000` to `U+10FFFF`) to surrogate pairs.
    * @param {boolean} useSurrogatePairs
    * @returns {RegExpBuilder}
    */
    withEscapingOfNonAsciiChars(useSurrogatePairs) {
        const ret = wasm.regexpbuilder_withEscapingOfNonAsciiChars(this.__wbg_ptr, useSurrogatePairs);
        return RegExpBuilder.__wrap(ret);
    }
    /**
    * Tells `RegExpBuilder` to produce a nicer looking regular expression in verbose mode.
    * @returns {RegExpBuilder}
    */
    withVerboseMode() {
        const ret = wasm.regexpbuilder_withVerboseMode(this.__wbg_ptr);
        return RegExpBuilder.__wrap(ret);
    }
    /**
    * Tells `RegExpBuilder` to remove the caret anchor '^' from the resulting regular
    * expression, thereby allowing to match the test cases also when they do not occur
    * at the start of a string.
    * @returns {RegExpBuilder}
    */
    withoutStartAnchor() {
        const ret = wasm.regexpbuilder_withoutStartAnchor(this.__wbg_ptr);
        return RegExpBuilder.__wrap(ret);
    }
    /**
    * Tells `RegExpBuilder` to remove the dollar sign anchor '$' from the resulting regular
    * expression, thereby allowing to match the test cases also when they do not occur
    * at the end of a string.
    * @returns {RegExpBuilder}
    */
    withoutEndAnchor() {
        const ret = wasm.regexpbuilder_withoutEndAnchor(this.__wbg_ptr);
        return RegExpBuilder.__wrap(ret);
    }
    /**
    * Tells `RegExpBuilder` to remove the caret and dollar sign anchors from the resulting
    * regular expression, thereby allowing to match the test cases also when they occur
    * within a larger string that contains other content as well.
    * @returns {RegExpBuilder}
    */
    withoutAnchors() {
        const ret = wasm.regexpbuilder_withoutAnchors(this.__wbg_ptr);
        return RegExpBuilder.__wrap(ret);
    }
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
    withMinimumRepetitions(quantity) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.regexpbuilder_withMinimumRepetitions(retptr, this.__wbg_ptr, quantity);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return RegExpBuilder.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
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
    withMinimumSubstringLength(length) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.regexpbuilder_withMinimumSubstringLength(retptr, this.__wbg_ptr, length);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return RegExpBuilder.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * Builds the actual regular expression using the previously given settings.
    * @returns {string}
    */
    build() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.regexpbuilder_build(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}

export function __wbindgen_string_get(arg0, arg1) {
    const obj = getObject(arg1);
    const ret = typeof(obj) === 'string' ? obj : undefined;
    var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len1 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len1;
    getInt32Memory0()[arg0 / 4 + 0] = ptr1;
};

export function __wbindgen_string_new(arg0, arg1) {
    const ret = getStringFromWasm0(arg0, arg1);
    return addHeapObject(ret);
};

export function __wbindgen_object_drop_ref(arg0) {
    takeObject(arg0);
};

export function __wbindgen_throw(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
};

