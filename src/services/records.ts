import { scrapeWebpage } from '@/lib/scraper';
import { createEventSlug, slugify } from '@/utils';
import { Cheerio, CheerioAPI, Element } from 'cheerio';
import { getCacheData, setCacheData } from '@/lib/redis';

export class RecordService {
  public async getRecords() {
    const cacheHit = await getCacheData('records');

    if (cacheHit) {
      return cacheHit;
    }

    const $ = await scrapeWebpage(process.env.WCA_HOST + '/results/records?show=slim');
    const results = $('#results-list .table tbody').children().toArray();

    const output = [] as any;

    for (const result of results) {
      const { event, ...rowData } = this.parseRow($, $(result).find('td'));

      if (!event) {
        continue;
      }

      const eventSlug = createEventSlug(event);
      output.push({
        event,
        slug: eventSlug,
        records: rowData,
      });
    }

    await setCacheData('records', output);

    return output;
  }

  public async getRecord(event: string) {
    const records = await this.getRecords();
    const record = records.find((record: any) => record.slug === event);

    if (!record) {
      throw new Error('Record not found');
    }

    return record;
  }

  private parseRow($: CheerioAPI, row: Cheerio<Element>) {
    if (row.eq(0).hasClass('blank-cell')) {
      return {
        event: null,
      };
    }

    let formatted = {
      event: row.eq(2).text().trim(),
      single: {
        name: row.eq(0).text().trim(),
        n: row.eq(1).text().trim(),
      },
      average: {},
    };

    const hasAverage = row.eq(3).text().trim() !== '';

    if (hasAverage) {
      const attemps = [
        row.eq(5).text().trim(),
        row.eq(6).text().trim(),
        row.eq(7).text().trim(),
        row.eq(8).text().trim(),
      ];

      formatted['average'] = {
        name: row.eq(4).text().trim(),
        n: row.eq(3).text().trim(),
        attempts: attemps.filter((attempt) => attempt !== '').sort((a, b) => a.localeCompare(b)),
      };
    }

    return formatted;
  }
}
