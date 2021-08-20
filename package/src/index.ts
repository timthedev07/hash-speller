import { HashTable, ListNode } from "./classes";
import fetch from "node-fetch";

type Language = "english" | "italian" | "spanish" | "german" | "french";

const replaceAt = (str: string, index: number, replacement: string) => {
  return (
    str.substr(0, index) + replacement + str.substr(index + replacement.length)
  );
};

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

export class Checker {
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
    if (!this.checkLang(language)) {
      throw "Invalid Language";
    }
    this.table = new HashTable(size);
    this.language = language;
    this.text = text;
    this.dictWords = 0;
  }

  checkLang(language?: string) {
    const SUPPORTED_LANGS = [
      "english",
      "german",
      "french",
      "spanish",
      "italian",
    ];

    return SUPPORTED_LANGS.indexOf(language || this.language) !== -1;
  }

  /**
   * Not something you are going to use!
   *
   * Removes any non-alphabet chars
   */
  preProcess() {
    const start_time = Date.now();
    if (!this.checkLang()) {
      throw "Invalid Language";
    }
    if (!this.text) {
      throw "Invalid text";
    }

    const text = this.text;
    for (let i = 0, n = text.length; i < n; i++) {
      if (text.charAt(i) in ESCAPE_CHAR) {
        this.text = replaceAt(this.text, i, "");
        continue;
      }
    }
    this.text = this.text.toLocaleLowerCase();

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
Total number of words checked: ${statistics.totalWords}
Number of misspelled words: ${statistics.misspelledNum}
Misspelled words: [ ${statistics.misspelledWords.join(", ")} ]
Number of words in dictionary: ${this.dictWords}
Checking time: ${statistics.runtime} ms
Words loading time: ${statistics.loadTime} ms
Text adjustment time: ${statistics.preProcessTime} ms
		`);
  }

  /**
   * Checks the correctness of a chunk of text in terms of spelling.
   *
   * if print is true(which by default is false), the stats would be printed out.
   */
  async check(print = false) {
    if (!this.checkLang()) {
      return;
    }

    // preProcess and bucketize
    let preProcessTime = 0;
    try {
      preProcessTime = this.preProcess();
    } catch (err) {
      throw err;
    }

    const loadTime = await this.bucketize();

    // get list of words
    const words = this.text.split(" ");

    let statistics = {
      totalWords: words.length,
      misspelledWords: [] as string[],
      loadTime,
      preProcessTime,
      misspelledNum: 0,
      runtime: 0.0,
    };

    const start_time = Date.now();
    let wrong = 0;
    for (let word = 0; word < words.length; word++) {
      if (this.table.lookup(words[word]) === false) {
        wrong++;
        statistics.misspelledWords.push(words[word]);
      }
    }
    statistics.runtime = Date.now() - start_time;
    statistics.misspelledNum = wrong;

    if (print) {
      this.print(statistics);
    }
    return statistics;
  }
}
