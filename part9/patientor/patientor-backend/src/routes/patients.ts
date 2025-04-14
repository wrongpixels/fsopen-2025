import express, { Response } from 'express';
import { PatientData } from '../types';
import patientServices from '../service/patientService';

const router = express.Router();
router.get('/', (_req, res: Response<PatientData[]>) => {
  res.send(patientServices.getSecureEntries());
});

router.post('/', (req, res) => {
  try {
    const body = req.body as unknown;
    const newPatient = patientServices.addPatient(body);
    res.status(202).json(newPatient);
    console.log(`Patient ${newPatient.name} was added!`);
  } catch (e) {
    res
      .status(400)
      .send(e instanceof Error ? e.message : 'Error adding patient');
  }
});

export default router;
