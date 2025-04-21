import {
  Patient,
  Gender,
  Entry,
  Diagnosis,
  HospitalEntry,
  HealthCheckEntry,
  OccupationalHealthcareEntry,
  EntryType,
} from '../../types';
import { useMatch } from 'react-router-dom';
import { useState, useEffect } from 'react';
import AddEntryForm from './AddEntryForm';
import patientService from '../../services/patients';
import diagnosesService from '../../services/diagnoses';
import HealthRatingBar from '../HealthRatingBar';
import {
  LocalHospital,
  Work,
  Male,
  Female,
  Person,
  HealthAndSafety,
} from '@mui/icons-material';
import { entryStyle, parStyle } from '../../styles';
import { assertNever } from '../../utils';

const drawGenderIcon = (gender: Gender) => {
  switch (gender) {
    case 'male':
      return <Male />;
    case 'female':
      return <Female />;
    default:
      return <Person />;
  }
};

const drawEntryIcon = (entry: Entry) => {
  switch (entry.type) {
    case EntryType.Hospital:
      return (
        <>
          | <LocalHospital /> <i>Hospital</i>
        </>
      );
    case EntryType.OccupationalHealthcare:
      return (
        <>
          | <Work /> <i>Occ. Healthcare</i>
        </>
      );
    case EntryType.HealthCheck:
      return (
        <>
          | <HealthAndSafety /> <i>Health Check</i>
        </>
      );

    default:
      return assertNever(entry);
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

interface EntryProps {
  entry: Entry;
}
interface HospitalEntryProps {
  entry: HospitalEntry;
}
interface HealthCheckEntryProps {
  entry: HealthCheckEntry;
}
interface OccupationalHealthcareEntryProps {
  entry: OccupationalHealthcareEntry;
}

const HospitalEntryComp = ({ entry }: HospitalEntryProps) => {
  return (
    <div style={parStyle}>
      <b>Discharge data:</b>
      <ul>
        <li>
          <b>Date: </b>
          {entry.discharge.date}
        </li>
        <li>
          <b>Criteria: </b>
          {entry.discharge.criteria}
        </li>
      </ul>
    </div>
  );
};
const HealthCheckEntryComp = ({ entry }: HealthCheckEntryProps) => {
  return (
    <div style={parStyle}>
      <b>Health Check Rating: </b>
      <HealthRatingBar rating={entry.healthCheckRating} showText={true} />
    </div>
  );
};

const OccupationalHealthcareEntryComp = ({
  entry,
}: OccupationalHealthcareEntryProps) => {
  return (
    <div style={parStyle}>
      <>
        <b>Employer: </b>
        {entry.employerName}
      </>
      {entry.sickLeave && (
        <>
          <div style={parStyle}>
            <b>Sick Leave:</b>
          </div>
          <ul>
            <li>
              <b>Started: </b>
              {entry.sickLeave.startDate}
            </li>
            <li>
              <b>Ended: </b>
              {entry.sickLeave.endDate}
            </li>
          </ul>
        </>
      )}
    </div>
  );
};

const EntryDetails = (props: EntryProps) => {
  switch (props.entry.type) {
    case EntryType.Hospital:
      return <HospitalEntryComp entry={props.entry} />;
    case EntryType.HealthCheck:
      return <HealthCheckEntryComp entry={props.entry} />;
    case EntryType.OccupationalHealthcare:
      return <OccupationalHealthcareEntryComp entry={props.entry} />;
    default:
      return assertNever(props.entry);
  }
};
interface EntriesProps {
  patient: Patient;
}
const Entries = (props: EntriesProps) => {
  const [entries, setEntries] = useState<Entry[]>();
  useEffect(() => {
    setEntries(props.patient.entries);
  }, []);

  const drawEntryForm = (entries: Entry[]) => (
    <>
      <h3>Entries</h3>
      {entries.length === 0 && (
        <p>
          <i>(Patient has no entries.)</i>
        </p>
      )}
      <AddEntryForm
        entries={entries}
        patientId={props.patient.id}
        setEntries={setEntries}
      />
    </>
  );
  if (!entries) {
    return null;
  }
  return (
    <>
      {drawEntryForm(entries)}
      <div>
        {entries.map((e) => (
          <div key={e.id} style={entryStyle}>
            <h3>
              {e.date} {drawEntryIcon(e)}
            </h3>
            <div>
              <i>{e.description}</i>
            </div>
            <div>
              <Diagnoses diagnosisCodes={e.diagnosisCodes} date={e.date} />
            </div>
            <div>
              <EntryDetails entry={e} />
            </div>
            <p>
              <b>- Diagnosed by: </b>
              {e.specialist} -
            </p>
          </div>
        ))}
      </div>
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
        {patient.name} ({drawGenderIcon(patient.gender)})
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
      <Entries patient={patient} />
    </div>
  );
};

export default PatientView;
