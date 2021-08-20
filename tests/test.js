const { Checker } = require("hash-speller-js");

const checker = new Checker("english", "Hello wourd thsi is mie first pakage");
checker.check(true);
