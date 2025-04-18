import express, { Request, Response, NextFunction } from 'express';
import { Diagnosis } from '../types';
import { DiagnosisSchema } from '../types';
import diagnoseService from '../service/diagnoseService';
import { ZodError } from 'zod';

const router = express.Router();
router.get('/', (_req, res: Response<Diagnosis[]>) => {
  res.json(diagnoseService.getEntries());
});

router.get('/:code', (req, res: Response<Diagnosis>) => {
  const code = req.params.code;
  res.json(diagnoseService.getEntryByCode(code));
});

const newDiagnosisMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    req.body = DiagnosisSchema.parse(req.body);
  } catch (error) {
    next(error);
  }
};

const newDiagnosisErrorHandler = (
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

router.post(
  '/',
  newDiagnosisMiddleware,
  (req: Request<unknown, unknown, Diagnosis>, res) => {
    try {
      const addedDiagnosis = diagnoseService.addDiagnosis(req.body);
      res.status(202).json(addedDiagnosis);
    } catch (e) {
      res
        .status(500)
        .send(e instanceof Error ? e.message : 'Error adding diangosis');
    }
  }
);

router.use(newDiagnosisErrorHandler);

export default router;
