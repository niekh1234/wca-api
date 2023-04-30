import { PersonService } from '@/services/persons';
import { internalServerError, notFound, ok } from '@/utils/response';
import { Request, Response } from 'express';

export class PersonController {
  personService: PersonService;

  constructor() {
    this.personService = new PersonService();
  }

  public async getPerson(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const person = await this.personService.getPerson(id);

      ok(res, { person });
    } catch (err: any) {
      console.error(err);

      if (err.name === 'NotFoundError') {
        return notFound(res, err.message);
      }

      return internalServerError(res, 'The server encountered an error');
    }
  }
}
