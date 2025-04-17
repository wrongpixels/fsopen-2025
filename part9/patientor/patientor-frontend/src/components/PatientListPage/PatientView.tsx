import { Patient, Gender, Entry, Diagnosis } from '../../types';
import { useMatch } from 'react-router-dom';
import { useState, useEffect } from 'react';
import patientService from '../../services/patients';
import diagnosesService from '../../services/diagnoses';
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

interface DiagnosesProps {
  diagnosisCodes: Array<Diagnosis['code']> | undefined;
  date: string;
}

const Diagnoses = (props: DiagnosesProps) => {
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>();
  useEffect(() => {
    const getDiagnoses = async () => {
      const currentDiagnoses: Diagnosis[] = await diagnosesService.getAll();
      if (currentDiagnoses) {
        setDiagnoses(currentDiagnoses);
      }
    };
    getDiagnoses();
  }, []);

  if (!props.diagnosisCodes || props.diagnosisCodes.length === 0) {
    return null;
  }

  if (!diagnoses) {
    return <>Loading diagnoses...</>;
  }

  const getDiagnosisFromCode = (code: string): string => {
    const diagnosis = diagnoses.find((d) => d.code === code);
    return diagnosis?.name || '';
  };

  return (
    <>
      <h4>Diagnosis:</h4>
      <ul>
        {props.diagnosisCodes.map((d, i) => (
          <li key={`${props.date}-${d}-${i}`}>
            <b>{d} | </b> <i>{getDiagnosisFromCode(d)}</i>
          </li>
        ))}
      </ul>
    </>
  );
};

interface EntriesProps {
  entries: Entry[] | undefined;
}

const Entries = (props: EntriesProps) => {
  if (!props.entries || props.entries.length === 0) {
    return null;
  }
  return (
    <>
      <h3>Entries</h3>
      <ul>
        {props.entries.map((e) => (
          <li key={e.id}>
            <b>{e.date}</b> | <i>{e.description}</i>
            <div>
              <Diagnoses diagnosisCodes={e.diagnosisCodes} date={e.date} />
            </div>
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
      <Entries entries={patient.entries} />
    </div>
  );
};

export default PatientView;
