import express, { Response } from 'express';
import { PatientData } from '../types';
import patientServices from '../service/patientServices';

const router = express.Router();
router.get('/', (_req, res: Response<PatientData[]>) => {
  res.send(patientServices.getSecureEntries());
});

export default router;
