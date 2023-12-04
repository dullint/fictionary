import path from "path";
import fs from "fs";
import { parse } from "csv-parse";
import { DictionaryLanguage, DictionnaryEntry } from "./types";
import logger from "../logging";

class Dictionary {
  french: DictionnaryEntry[];
  english: DictionnaryEntry[];

  parseOneLanguageDatabase = async (language: DictionaryLanguage) => {
    return new Promise<DictionnaryEntry[]>((resolve, reject) => {
      const csvFilePath = path.resolve(
        __dirname,
        "database",
        `database_fictionary - ${language}.csv`
      );
      const headers = ["word", "nature", "genre", "definition", "example"];
      const stream = fs.createReadStream(csvFilePath, { encoding: "utf-8" });
      const entries: DictionnaryEntry[] = [];

      const parser = parse({
        delimiter: ",",
        columns: headers,
        fromLine: 2,
      });
      stream.on("ready", () => {
        logger.info(`[SET UP] Parsing ${language} dictionary database`);
        stream.pipe(parser);
      });

      parser.on("readable", function () {
        let entry;
        while ((entry = parser.read())) {
          entries.push(entry);
        }
      });

      parser.on("error", (err) => {
        logger.error(
          "[SET UP] Error while parsing the Word CSV file",
          err.message
        );
        reject();
      });

      parser.on("end", function () {
        logger.info(`[SET UP] ${language} dictionary parsing complete`);
        resolve(entries);
      });
    });
  };

  setUp = async () => {
    this.french = await this.parseOneLanguageDatabase(
      DictionaryLanguage.French
    );
    this.english = await this.parseOneLanguageDatabase(
      DictionaryLanguage.English
    );
  };

  constructor() {
    this.french = [];
    this.english = [];
  }
}

export default new Dictionary();
