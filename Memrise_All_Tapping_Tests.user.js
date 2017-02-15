// ==UserScript==
// @name           Memrise All Tapping Tests
// @namespace      https://github.com/cooljingle
// @description    All tapping tests when doing Memrise learning
// @match          https://www.memrise.com/course/*/garden/*
// @match          https://www.memrise.com/garden/review/*
// @version        0.0.4
// @updateURL      https://github.com/cooljingle/memrise-all-tapping-tests/raw/master/Memrise_All_Tapping_Tests.user.js
// @downloadURL    https://github.com/cooljingle/memrise-all-tapping-tests/raw/master/Memrise_All_Tapping_Tests.user.js
// @grant          none
// ==/UserScript==

$(document).ready(function(){
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

        MEMRISE.garden.box_types.TappingTestBox.prototype.initialize = (function() {
            var cached_function = MEMRISE.garden.box_types.TappingTestBox.prototype.initialize;
            return function() {
                cached_function.apply(this, arguments);
                var t = this.thing.columns[this.column_a];
                if(t.tapping_choices.corrects.length === 0) {
                    t.tapping_choices.corrects = t.val.split('');
                    t.possible_answers.tapping.push(t.val.split(''));
                    this.answer_words = t.tapping_choices.corrects;
                    this.choice_words = this.get_choice_words();
                }
            };
        }());
    }
});
