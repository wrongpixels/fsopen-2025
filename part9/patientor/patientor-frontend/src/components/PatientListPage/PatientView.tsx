import { Patient } from '../../types';
import { useMatch } from 'react-router-dom';
import { useState, useEffect } from 'react';
import patientService from '../../services/patients';

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
      <span>
        <h2>
          {patient.name} <i>({patient.gender}</i>)
        </h2>
      </span>
      <p>
        <div>
          <b>Date of Birth:</b> {patient.dateOfBirth}
        </div>
        <div>
          <b>SSN:</b> {patient.ssn}
        </div>
        <div>
          <b>Occupation:</b> {patient.occupation}
        </div>
      </p>
    </div>
  );
};

export default PatientView;
