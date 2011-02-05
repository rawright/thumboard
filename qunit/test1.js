// JavaScript Document
$(document).ready(function() {
    module("thumboard");
    test("Basic requirements", function() {
        expect(1);
        ok(thumboard, "thumboard");
    });
    test("seed = getSeed(value, start)", function() {
        expect(5);
        equals(thumboard.getSeed('test word', 7),
            'wo',
            'expected result was "wo"');
        equals(thumboard.getSeed('test word', 0),
            '',
            'expected result was empty string');
        equals(thumboard.getSeed('test word', 9),
            'word',
            'expected result was "word"');
        equals(thumboard.getSeed('test word', 10),
            'word',
            'expected result was "word"');
        equals(thumboard.getSeed('test word', -1),
            '',
            'expected result was empty string');
    });
    test("arr = getWords(seed, words, max)", function() {
        expect(5);
        same(thumboard.getWords('th', ['of','th','the','who','this','for']),
            ["the","this"],
            'expected result was "the" and "this"');
        same(thumboard.getWords('th', ['of','th','the','who','this','for'], 1),
            ["the"],
            'expected result was "the" and "this"');
        same(thumboard.getWords('tha', ['of','th','the','who','this','for']),
            [],
            'expected result was []');
        same(thumboard.getWords('that', ['of','th','the','who','this','for']),
            [],
            'expected result was [] since list word must be longer than seed');
        same(thumboard.getWords('', ['of','th']),
            ['of','th'],
            'expected result was []');
    });
    test("count = getLetters(seed, words, max)", function() {
        expect(5);
        same(thumboard.getLetters("bo", ["body","bode","boat"], 10),
            ["d","a"]);
        same(thumboard.getLetters("s", ["bad","sad","ad"], 10),
            ["a"]);
        same(thumboard.getLetters("sad", ["bad","sad ","ad"], 10),
            []);
        same(thumboard.getLetters("sade", ["bad","sad","ad"], 10),
            []);
        same(thumboard.getLetters("sa", ["save","sale","safe"], 10),
            ["f","l","v"]);
    });
});

