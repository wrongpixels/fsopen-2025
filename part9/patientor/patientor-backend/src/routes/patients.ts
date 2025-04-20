import express, { Response, Request, NextFunction } from 'express';
import {
  PatientData,
  NewPatient,
  Patient,
  NewEntry,
  Entry,
  parseNewEntry,
} from '../types';
import patientServices from '../service/patientService';
import { toNewPatient } from '../utils';
import { ZodError } from 'zod';

const newPatientMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    req.body = toNewPatient(req.body);
    next();
  } catch (e: unknown) {
    next(e);
  }
};

const newEntryMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const entry: NewEntry = parseNewEntry(req.body);
    req.body = entry;
    next();
  } catch (e: unknown) {
    next(e);
  }
};

const ZodErrorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof ZodError) {
    const errorDetails = error.issues.map((issue) => ({
      field: issue.path[0],
      message: `Error: ${issue.message}'`,
    }));

    res.status(400).json({
      error: errorDetails[0].message,
    });
    return;
  }
  next(error);
};

const router = express.Router();

router.get('/', (_req, res: Response<PatientData[]>) => {
  res.json(patientServices.getSecureEntries());
});

router.get('/:id', (req, res) => {
  const id = req.params.id;
  res.json(patientServices.getPatientById(id));
});

router.post(
  '/',
  newPatientMiddleware,
  (req: Request<unknown, unknown, NewPatient>, res) => {
    try {
      const addedPatient: Patient = patientServices.addPatient(req.body);
      res.status(202).json(addedPatient);
      console.log(`Patient ${addedPatient.name} was added!`);
    } catch (e) {
      res
        .status(500)
        .send(e instanceof Error ? e.message : 'Error adding patient');
    }
  }
);

router.get('/:id/entries', (req: Request, res) => {
  const id = req.params.id;
  const entries = patientServices.getPatientById(id)?.entries;
  res.json(entries);
});

router.post(
  '/:id/entries',
  newEntryMiddleware,
  (req: Request<{ id: string }, unknown, NewEntry>, res: Response) => {
    try {
      const id = req.params.id;
      const entry: Entry = patientServices.addPatientEntry(req.body, id);
      res.json(entry);
    } catch (e) {
      res
        .status(500)
        .send(e instanceof Error ? e.message : 'Error adding patient entry');
    }
  }
);
router.use(ZodErrorHandler);

export default router;
