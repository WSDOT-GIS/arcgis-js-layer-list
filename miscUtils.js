define(function () {
    "use strict";

    /**
     * @module miscUtils
     */

    return {
        /**
         * Determines if an array contains a given value.
         * @param {Array} array - An array to be searched.
         * @param {*} value - The value to search for in the array.
         * @returns {Boolean} Returns true if the array contains the given value, false otherwise.
         */
        arrayContains: function (array, value) {
            var output = false;
            for (var i = 0; i < array.length; i++) {
                if (array[i] === value) {
                    output = true;
                    break;
                }
            }
            return output;
        },
        /**
         * Parses a string containing comma-separated
         * integer values into an array of integers.
         * @param {string} s - A string containing a comma-separated list of integers.
         * @returns {number[]} Returns the integers listed in the input string as an array of numbers.
         */
        parseIntList: function (s) {
            var output = null;
            if (s) {
                output = s.split(",").map(function (i) {
                    return parseInt(i);
                });
            }
            return output;
        },
        /** Splits a camel-case or Pascal-case variable name into individual words.
         * @param {string} s - A camel-case or Pascal-case string.
         * @param {RegExp} [re=/([A-Za-z]?)([a-z]+)/g] - Regular expression used for detecting the start of a new word.
         * @returns {string[]} The input string, split into different parts.
         */
        splitWords: function (s, re) {
            var match, output = [];
            // re = /[A-Z]?[a-z]+/g
            if (!re) {
                re = /([A-Za-z]?)([a-z]+)/g;
            }

            /*
            matches example: "oneTwoThree"
            ["one", "o", "ne"]
            ["Two", "T", "wo"]
            ["Three", "T", "hree"]
            */

            match = re.exec(s);
            while (match) {
                // output.push(match.join(""));
                output.push(match[0]);
                match = re.exec(s);
            }

            return output;

        }
    };
});