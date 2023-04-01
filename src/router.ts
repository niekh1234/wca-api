import { RecordController } from '@/controllers/records';
import { Request, Response, Router } from 'express';

const router = Router();

router.get('/records', (req: Request, res: Response) => {
  new RecordController().getRecords(req, res);
});

router.get('/records/:event', (req: Request, res: Response) => {
  new RecordController().getRecord(req, res);
});

export default router;
