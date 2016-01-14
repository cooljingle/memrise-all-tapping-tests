// ==UserScript==
// @name           Memrise All Tapping Tests 
// @namespace      https://github.com/cooljingle
// @description    All tapping tests when doing Memrise learning
// @match          http://www.memrise.com/course/*/garden/*
// @match          http://www.memrise.com/garden/review/*
// @version        0.0.1
// @updateURL      https://github.com/cooljingle/memrise-all-tapping-tests/raw/master/Memrise_All_Tapping_Tests.user.js
// @downloadURL    https://github.com/cooljingle/memrise-all-tapping-tests/raw/master/Memrise_All_Tapping_Tests.user.js
// @grant          none
// ==/UserScript==

MEMRISE.garden.boxes.load = (function() {
    var cached_function = MEMRISE.garden.boxes.load;
    return function() {
        enableAllTappingTests();
        return cached_function.apply(this, arguments);
    };
}());

function enableAllTappingTests() {
    MEMRISE.garden.session.box_factory.make = (function() {
        var cached_function = MEMRISE.garden.session.box_factory.make;
        return function() {
            var result = cached_function.apply(this, arguments);
            if(_.contains(["typing", "multiple_choice", "audio-typing", "audio-multiple-choice"], result.template)) {
                result.template = "tapping";
            }
            return result;
        };
    }());
}
