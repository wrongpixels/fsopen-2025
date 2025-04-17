import { Patient, Gender, Entry, Diagnosis } from '../../types';
import { useMatch } from 'react-router-dom';
import { useState, useEffect } from 'react';
import patientService from '../../services/patients';
import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';
import PersonIcon from '@mui/icons-material/Person';

const drawIcon = (gender: Gender) => {
  switch (gender) {
    case 'male':
      return <MaleIcon />;
    case 'female':
      return <FemaleIcon />;
    default:
      return <PersonIcon />;
  }
};

const drawDiagnosis = (
  diagnosis: Array<Diagnosis['code']> | undefined,
  date: string
) => {
  if (!diagnosis || diagnosis.length === 0) {
    return null;
  }
  return (
    <>
      <h4>Diagnosis:</h4>
      <ul>
        {diagnosis.map((d, i) => (
          <li key={`${date}-${d}-${i}`}>{d}</li>
        ))}
      </ul>
    </>
  );
};

const drawEntries = (entries: Entry[] | undefined) => {
  if (!entries || entries.length === 0) {
    return null;
  }
  return (
    <>
      <h3>Entries</h3>
      <ul>
        {entries.map((e) => (
          <li key={e.id}>
            <b>{e.date}</b> | <i>{e.description}</i>
            <div>{drawDiagnosis(e.diagnosisCodes, e.date)}</div>
          </li>
        ))}
      </ul>
    </>
  );
};

const PatientView = () => {
  const [patient, setPatient] = useState<Patient>();
  const match = useMatch('/patients/:id');
  const id = match?.params.id;
  if (!id) {
    return <>No valid id!</>;
  }

  useEffect(() => {
    const getPatient = async () => {
      const activePatient = await patientService.getById(id);
      if (activePatient) {
        setPatient(activePatient);
      }
    };
    getPatient();
  }, [id]);

  if (!patient) {
    return <>Loading...</>;
  }

  return (
    <div className="App">
      <h2>
        {patient.name} ({drawIcon(patient.gender)})
      </h2>
      <div>
        <b>Date of Birth:</b> {patient.dateOfBirth}
      </div>
      <div>
        <b>SSN:</b> {patient.ssn}
      </div>
      <div>
        <b>Occupation:</b> {patient.occupation}
      </div>
      <div>{drawEntries(patient.entries)}</div>
    </div>
  );
};

export default PatientView;
