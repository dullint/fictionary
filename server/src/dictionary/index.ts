import path from 'path';
import fs from 'fs';
import { parse } from 'csv-parse';
import { DictionnaryEntry } from './types';
import logger from '../logging';

const cleanDefinitions = (def: string) => {
  const trimmedDef = def.trim();
  return trimmedDef.endsWith('.') ? trimmedDef : trimmedDef + '.';
};

class Dictionary {
  entries: DictionnaryEntry[];

  parseDatabase = async () => {
    this.entries = await new Promise<DictionnaryEntry[]>((resolve, reject) => {
      const csvFilePath = path.resolve(__dirname, 'database.csv');
      const headers = ['word', 'nature', 'genre', 'definition', 'example'];
      const stream = fs.createReadStream(csvFilePath, { encoding: 'utf-8' });
      const entries: DictionnaryEntry[] = [];

      const parser = parse({
        delimiter: ',',
        columns: headers,
        fromLine: 2,
      });
      stream.on('ready', () => {
        stream.pipe(parser);
      });
      parser.on('readable', function () {
        let entry;
        logger.info('Parsing Word CSV');
        while ((entry = parser.read())) {
          entries.push(entry);
        }
      });

      parser.on('error', function (err) {
        logger.error('Error while parsing the Word CSV file', err.message);
        reject();
      });

      parser.on('end', function () {
        logger.info('CSV Parsing complete');
        resolve(entries);
      });
    });
  };

  constructor() {
    this.entries = [];
  }
}

export default new Dictionary();
