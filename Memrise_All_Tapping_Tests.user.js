// ==UserScript==
// @name           Memrise All Tapping Tests
// @namespace      https://github.com/cooljingle
// @description    All tapping tests when doing Memrise learning
// @match          https://www.memrise.com/course/*/garden/*
// @match          https://www.memrise.com/garden/review/*
// @version        0.0.7
// @updateURL      https://github.com/cooljingle/memrise-all-tapping-tests/raw/master/Memrise_All_Tapping_Tests.user.js
// @downloadURL    https://github.com/cooljingle/memrise-all-tapping-tests/raw/master/Memrise_All_Tapping_Tests.user.js
// @grant          none
// ==/UserScript==

$(document).ready(function(){

    MEMRISE.garden._events.start.push(() => {
        enableAllTappingTests();
        MEMRISE.garden.populateScreens();
    });

    function enableAllTappingTests() {
        MEMRISE.garden.session.box_factory.make = (function() {
            var cached_function = MEMRISE.garden.session.box_factory.make;
            return function() {
                var result = cached_function.apply(this, arguments);
                if(_.contains(["typing", "reversed_multiple_choice", "multiple_choice", "audio-typing", "audio-multiple-choice"], result.template)) {
                    result.template = "tapping";
                }
                return result;
            };
        }());

        MEMRISE.garden.populateScreens = function() {
            _.each(MEMRISE.garden.learnables || _.indexBy(MEMRISE.garden.session_data.learnables, 'learnable_id'), function(v, k) {
                var learnableScreens = (MEMRISE.garden.screens || MEMRISE.garden.session_data.screens)[k];
                if(learnableScreens && !_.contains(Object.keys(learnableScreens), "tapping")) {
                    var screenBase = _.find([learnableScreens.multiple_choice, learnableScreens.reversed_multiple_choice], s => s.answer.kind === "text");
                    if(screenBase) {
                        //if multi word answer, split on spaces and punctuation
                        var splitParam = _.contains(screenBase.correct[0], " ") ? new RegExp(/[\u3000-\u303F\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,\-\/:;<=>?@\[\]^_`{|}~¿¡ ]/) : "";
                        learnableScreens.tapping = $.extend({}, screenBase, {
                            template: "tapping",
                            choices: _.uniq(_.flatten(_.map(screenBase.choices, c => c.split(splitParam).filter(x => x !== "")))),
                            correct: _.map(screenBase.correct, c => c.split(splitParam).filter(x => x !== "").map(x => x.toLowerCase()))
                        });
                    }
                }
            });
        };
    }
});
