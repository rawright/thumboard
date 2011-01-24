// JavaScript Document
$(document).ready(function() {
    module("thumboard");
    test("Basic requirements", function() {
        expect(1);
        ok(thumboard, "thumboard");
    });
    test("seed = getWordSeed(value, start)", function() {
        expect(5);
        equals(thumboard.getWordSeed('test word', 7),
            'wo',
            'expected result was "wo"');
        equals(thumboard.getWordSeed('test word', 0),
            '',
            'expected result was empty string');
        equals(thumboard.getWordSeed('test word', 9),
            'word',
            'expected result was "word"');
        equals(thumboard.getWordSeed('test word', 10),
            'word',
            'expected result was "word"');
        equals(thumboard.getWordSeed('test word', -1),
            '',
            'expected result was empty string');
    });
    test("arr = getWordsList(seed, wordsArray)", function() {
        expect(4);
        same(thumboard.getWordsList('th', ['of','th','the','who','this','for']),
            ["the","this"],
            'expected result was "the" and "this"');
        same(thumboard.getWordsList('tha', ['of','th','the','who','this','for']),
            [],
            'expected result was []');
        same(thumboard.getWordsList('that', ['of','th','the','who','this','for']),
            [],
            'expected result was [] since list word must be longer than seed');
        same(thumboard.getWordsList('', ['of','th']),
            ['of','th'],
            'expected result was []');
    });
    test("out = getFormattedWordsList(value, start, wordsArray, max)", function() {
        expect(1);
        equals(thumboard.getFormattedWordsList('the mother was', 8,
                ['father','mother','son','uncle','smother'], 1),
            '<table class="words"><tr><td abbr="word">mother</td></tr></table>');
    });
    test("nextInput = tab(inputs, current)", function() {
        expect(4);
        equals(thumboard.tab(["horse","cow","pig"], "cow"),
            "pig");
        equals(thumboard.tab(["0","1","2"], null),
            "0");
        equals(thumboard.tab(["0","1","2"], "2"),
            "0");
        equals(thumboard.tab(["0","1","2"], "7"),
            "0");
    });
});

