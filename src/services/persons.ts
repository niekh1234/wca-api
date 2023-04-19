import { scrapeWebpage } from '@/lib/scraper';
import { maybeCastedAsNumber, slugify } from '@/utils';
import { Cheerio, CheerioAPI, Element } from 'cheerio';
import { getCacheData, setCacheData } from '@/lib/redis';

export class PersonService {
  public async getPerson(id: string) {
    if (!id) {
      throw new Error('No ID provided');
    }

    const cacheHit = await getCacheData(`person-${id}`);

    if (cacheHit) {
      return cacheHit;
    }

    const $ = await scrapeWebpage(process.env.WCA_HOST + `/persons/${id}`);
    const name = this.getUserName($);
    const userDetails = this.getUserDetails($);
    const personalRecords = this.getPersonalRecords($);

    const data = {
      id,
      name,
      ...userDetails,
      personalRecords,
    };

    await setCacheData(`person-${id}`, data);

    return data;
  }

  private getUserName($: CheerioAPI) {
    return $('.text-center h2').text().trim();
  }

  private getUserDetails($: CheerioAPI) {
    const [element] = $('.details table tbody tr').toArray();

    if (!element) {
      throw new Error('No user details found');
    }

    const output = {} as any;
    const keys = ['country', 'id', 'sex', 'competitions', 'successfullAttempts'];

    for (const [index, row] of $(element).find('td').toArray().entries()) {
      const value = $(row).text().trim();

      output[keys[index]] = maybeCastedAsNumber(value);
    }

    return output;
  }

  private getPersonalRecords($: CheerioAPI) {
    const table = $('.personal-records table tbody').children().toArray();
    const personalRecords = {} as any;

    for (const row of table) {
      const tds = $(row).find('td');

      if (tds.length === 0) {
        continue;
      }

      const event = tds.eq(0).text().trim();
      const eventSlug = slugify(event);

      personalRecords[eventSlug] = {
        event,
        single: {
          time: tds.eq(4).text().trim(),
          nationalRecord: tds.eq(1).text().trim(),
          continentalRecord: tds.eq(2).text().trim(),
          worldRecord: tds.eq(3).text().trim(),
        },
        average: {
          time: tds.eq(5).text().trim(),
          nationalRecord: tds.eq(8).text().trim(),
          continentalRecord: tds.eq(7).text().trim(),
          worldRecord: tds.eq(6).text().trim(),
        },
      };
    }

    return personalRecords;
  }
}
