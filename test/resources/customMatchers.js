'use strict';

import $ from 'jquery';

export default {

    toHaveOuterHtml: function toHaveOuterHtml(util, customEqualityTesters) {

        return {
            compare: (actual, expectedHtml) => {

                let outerHTML = actual[0].outerHTML;
                let result  = {};

                result.pass = util.equals(outerHTML, expectedHtml, customEqualityTesters);

                if (result.pass) {
                    result.message = "Expected " + outerHTML + " not to equal " + expectedHtml;
                } else {
                    result.message = "Expected " + outerHTML + " to equal " + expectedHtml;
                }

                return result;
            }
        };
    }

};