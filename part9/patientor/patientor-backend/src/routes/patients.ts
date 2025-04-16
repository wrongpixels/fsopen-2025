import express, { Response, Request, NextFunction } from 'express';
import { PatientData, NewPatient, Patient } from '../types';
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

const newPatientErrorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof ZodError) {
    res.status(400).json({ error: error.issues });
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

router.use(newPatientErrorHandler);

export default router;
