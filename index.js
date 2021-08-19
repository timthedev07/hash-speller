var fs = require("fs");
var helper = require("./module.js");
var path = require("path");

const Reset = "\x1b[0m";
const FgRed = "\x1b[31m";

class Checker {
  _ESCAPE_CHAR = [
    ".",
    ",",
    "!",
    ";",
    ":",
    "?",
    "%",
    "~",
    "+",
    "=",
    "-",
    "_",
    "*",
    "@",
    "#",
    "&",
    "(",
    ")",
    "[",
    "]",
    "{",
    "}",
  ];
  _size = 456976;
  /**
   * Available languages are:
   *
   * english
   *
   * german
   *
   * french
   *
   * spanish
   *
   * italian
   *
   * Please choose one of them and type in exactly what's shown above!
   * @param {String} language The language of the text
   * @param {String} text The actual text
   */
  constructor(language, text) {
    this.ht = new helper.Hashtable();
    this.language = language;
    this.text = text;
    this.words_inDict = 0;
  }

  /**
   * checks if the given language is supported
   * @param {String} lang
   */
  check_lang(lang) {
    const SUPPORTED_LANGS = [
      "english",
      "german",
      "french",
      "spanish",
      "italian",
    ];

    if (!SUPPORTED_LANGS.includes(lang.toLowerCase())) {
      console.log(`${FgRed}Invalid language!${Reset}`);
      return false;
    }
    return true;
  }

  /**
   * Not something you are going to use!
   *
   * Removes any non-alphabet chars
   */
  clean() {
    const start_time = Date.now();
    if (!this.check_lang(this.language)) {
      return false;
    }
    if (this.text === null) {
      return false;
    }
    var buffer = this.text;
    for (var i = 0; i < buffer.length; i++) {
      if (buffer.charAt(i) in this._ESCAPE_CHAR) {
        this.text.replace(buffer.charAt(i), "");
      }
    }
    const end_time = Date.now();
    const final_time = end_time - start_time;
    return final_time;
  }

  /**
   * Not something you are going to use!
   *
   * Returns load time if success
   * @returns
   */
  bucketize() {
    if (!this.check_lang(this.language)) {
      return false;
    }
    this.clean();
    var ht = new helper.Hashtable(this._size);

    const filename = path.join(__dirname, "/data", `/${this.language}.txt`);
    const start_time = Date.now();
    var lines;

    var text = fs.readFileSync(filename, "utf-8");
    var lines = text.split("\n");

    this.words_inDict = lines.length;

    for (var l = 0; l < lines.length; l++) {
      ht.insert(new helper.HTNode(lines[l]));
    }

    const end_time = Date.now();
    const final_time = end_time - start_time;

    this.ht = ht;
    return final_time;
  }

  /**
   *
   * @param {JSON} statistics
   * @returns
   */
  _visualize(statistics) {
    console.log(`
Total number of words checked: ${statistics.total_words}
Number of misspelled words: ${statistics.misspelled_num}
Misspelled words: [${statistics.misspelled_words.join(", ")}]
Number of words in dictionary: ${this.words_inDict}
Checking time: ${statistics.runtime} ms
Words loading time: ${statistics.load_time} ms
Text adjustment time: ${statistics.clean_time} ms
		`);
  }

  /**
   * Checks the correctness of a chunk of text in terms of spelling.
   *
   * if print is true(which by default is false), the stats would be printed out.
   *
   * the returned dictionary would have the structure as follows:\n
   *
   * ```javascript
   *
   * statistics = {
   *
   *     total_words: Number,
   *
   *     misspelled_num: Number,
   *
   *     misspelled_words: Array,
   *
   *     words_in_dictionary: Number,
   *
   *     // time spent on loading
   *     // words into the hash table
   *     load_time: Number,
   *
   *     // time spent on removing useless
   *     // characters for the analysis
   *     clean_time: Number,
   *
   *     // time spent on looking up all of the words
   *     runtime: Number
   * ```
   *
   * @param {Bool} print true if the stats are going to be printed out false otherwise
   */
  check(print = false) {
    if (!this.check_lang(this.language)) {
      return;
    }

    // clean and bucketize
    const clean_time = this.clean();
    const load_time = this.bucketize();

    // get list of words
    const words = this.text.split(" ");

    var statistics = {
      total_words: words.length,
      misspelled_words: [],
      load_time: load_time,
      clean_time: clean_time,
      misspelled_num: 0,
      runtime: 0.0,
    };

    const start_time = Date.now();
    var wrong = 0;
    for (var word = 0; word < words.length; word++) {
      if (this.ht.lookup(new helper.HTNode(words[word])) === false) {
        // Meaning if the word does not exist
        wrong++;
        statistics.misspelled_words.push(words[word]);
      }
    }
    // Collect statistics
    statistics.runtime = Date.now() - start_time;
    statistics.misspelled_num = wrong;

    if (print) {
      this._visualize(statistics);
    }
    return statistics;
  }
}

const checker = new Checker(
  "english",
  "Henry doesnt eat vegetabos at all he loevs meaty balls"
);
checker.check(true);

module.exports = {
  Checker,
};
