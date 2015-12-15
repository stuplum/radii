'use strict';

import $ from 'jquery';
import ng from 'angular';

export default {

    toBeAngularElement: function toBeAngularElement(util, customEqualityTesters) {

        return {
            compare: (actual) => {

                let result  = {};

                result.pass = util.equals(actual instanceof ng.element, true, customEqualityTesters);

                if (result.pass) {
                    result.message = "Expected " + actual + " not to be an angular element";
                } else {
                    result.message = "Expected " + actual + " to be an angular element";
                }

                return result;
            }
        };
    },

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