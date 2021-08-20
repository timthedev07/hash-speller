import { HashTable, ListNode } from "./classes";
import fetch from "node-fetch";

type Language = "english" | "italian" | "spanish" | "german" | "french";

const ESCAPE_CHAR = [
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

const size = 456976;

class Checker {
  language: Language;
  text: string;
  table: HashTable;
  dictWords: number;
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
   */
  constructor(language: Language, text: string) {
    this.table = new HashTable(size);
    this.language = language;
    this.text = text;
    this.dictWords = 0;
  }

  checkLang() {
    // const SUPPORTED_LANGS = [
    //   "english",
    //   "german",
    //   "french",
    //   "spanish",
    //   "italian",
    // ];

    return true;
  }

  /**
   * Not something you are going to use!
   *
   * Removes any non-alphabet chars
   */
  private preProcess() {
    const start_time = Date.now();
    if (!this.checkLang()) {
      return false;
    }
    if (this.text === null) {
      return false;
    }
    let buffer = this.text;
    for (let i = 0; i < buffer.length; i++) {
      if (buffer.charAt(i) in ESCAPE_CHAR) {
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
  async bucketize() {
    this.preProcess();
    let table = new HashTable(size);

    const startTime = Date.now();

    let text = await fetch(
      `https://raw.githubusercontent.com/timthedev07/spellerjs/master/data/${this.language}.txt`
    );
    let lines = (await text.text()).split("\n");

    this.dictWords = lines.length;

    for (let l = 0; l < lines.length; l++) {
      table.insert(new ListNode(lines[l]));
    }

    const end_time = Date.now();
    const final_time = end_time - startTime;

    this.table = table;
    return final_time;
  }

  print(statistics: any) {
    console.log(`
Total number of words checked: ${statistics.total_words}
Number of misspelled words: ${statistics.misspelled_num}
Misspelled words: [ ${statistics.misspelled_words.join(", ")} ]
Number of words in dictionary: ${this.dictWords}
Checking time: ${statistics.runtime} ms
Words loading time: ${statistics.load_time} ms
Text adjustment time: ${statistics.preProcess_time} ms
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
   *     preProcess_time: Number,
   *
   *     // time spent on looking up all of the words
   *     runtime: Number
   * ```
   *
   * @param {Bool} print true if the stats are going to be printed out false otherwise
   */
  check(print = false) {
    if (!this.checkLang()) {
      return;
    }

    // preProcess and bucketize
    const preProcess_time = this.preProcess();
    const load_time = this.bucketize();

    // get list of words
    const words = this.text.split(" ");

    let statistics = {
      total_words: words.length,
      misspelled_words: [] as string[],
      load_time: load_time,
      preProcess_time: preProcess_time,
      misspelled_num: 0,
      runtime: 0.0,
    };

    const start_time = Date.now();
    let wrong = 0;
    for (let word = 0; word < words.length; word++) {
      if (this.table.lookup(words[word]) === false) {
        wrong++;
        statistics.misspelled_words.push(words[word]);
      }
    }
    statistics.runtime = Date.now() - start_time;
    statistics.misspelled_num = wrong;

    if (print) {
      this.print(statistics);
    }
    return statistics;
  }
}

module.exports = {
  Checker,
};
