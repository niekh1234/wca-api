import { RecordService } from '@/services/records';
import { internalServerError, notFound, ok } from '@/utils/response';
import { Request, Response } from 'express';

export class RecordController {
  recordService: RecordService;

  constructor() {
    this.recordService = new RecordService();
  }

  public async getRecords(req: Request, res: Response) {
    try {
      const records = await this.recordService.getRecords();

      ok(res, records);
    } catch (err: any) {
      internalServerError(res, 'The server encountered an error');
    }
  }

  public async getRecord(req: Request, res: Response) {
    try {
      const { event } = req.params;
      const records = await this.recordService.getRecords();

      if (!records[event]) {
        return notFound(res, 'Record not found');
      }

      ok(res, records[event].records);
    } catch (err: any) {
      internalServerError(res, 'The server encountered an error');
    }
  }
}
