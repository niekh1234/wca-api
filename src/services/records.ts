import { scrapeWebpage } from '@/lib/scraper';
import { slugify } from '@/utils';
import { CheerioAPI, Element } from 'cheerio';
import { getCacheData, setCacheData } from '@/lib/redis';

export class RecordService {
  public async getRecords() {
    try {
      const cacheHit = await getCacheData('records');

      if (cacheHit) {
        return cacheHit;
      }

      const $ = await scrapeWebpage(process.env.WCA_HOST + '/results/records');
      const results = $('#results-list').children().toArray();
      const output = [] as any;

      while (results.length > 0) {
        const child = results.shift();

        if (!child) {
          break;
        }

        const { name: type } = child;

        if (type === 'h2') {
          const eventName = this.getEventName($, child);
          const eventSlug = this.createSlug(eventName);

          output.push({
            event: eventName,
            slug: eventSlug,
            records: {},
          });
        }

        if (type === 'div') {
          const records = this.getEventRecords($, child);

          output[output.length - 1].records = records;
        }
      }

      await setCacheData('records', output);

      return output;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }

  public async getRecord(event: string) {
    try {
      const records = await this.getRecords();
      const record = records.find((record: any) => record.slug === event);

      if (!record) {
        throw new Error('Record not found');
      }

      return record;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }

  private getEventName($: CheerioAPI, element: Element) {
    return $(element).text().trim();
  }

  private getEventRecords($: CheerioAPI, element: Element) {
    const data = $(element).find('tbody tr');

    const records = {} as any;

    data.each((_, el) => {
      const rows = $(el).find('td');
      const type = rows.eq(0).text().trim().toLowerCase();
      const name = rows.eq(1).text().trim();
      const amount = parseFloat(rows.eq(2).text().trim() || '0');

      if (!type || !name || !amount) {
        throw new Error('Invalid record data');
      }

      records[type] = { name, n: amount };
    });

    return records;
  }

  private createSlug(str: string) {
    const slug = slugify(str);

    return slug.replace(/-cube/g, '');
  }
}
