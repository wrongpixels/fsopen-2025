
import {useState} from 'react'
function App() {
    const [persons, setPersons] = useState([{name: 'Arto Hellas'}]);
    const [newName, setNewName] = useState('');

    const handleTypeName = (event) => {
        setNewName(event.target.value);
    }

    const alertMessage = `'${newName}' is already in the Phonebook!`
    const preventSameName = () => {
        if (persons.find(person => person.name === newName))
        {
            alert(alertMessage);
            return true;
        }
        return false;
    }

    const handleAddPerson = (event) => {
        event.preventDefault();
        if (newName === '' || preventSameName())
        {
            return;
        }
        const newPerson = {name: newName};
        setPersons(persons.concat(newPerson));
        setNewName('');

    }
  return (
      <>
          <h2>Phonebook</h2>
          <form>
              Name: <input value={newName} onChange={handleTypeName}/>
              <button type="submit" onClick={handleAddPerson}>Add</button>
          </form>
          <h2>Numbers</h2>
          <Entries persons={persons} />
      </>
  )
}
const Entries = ({persons}) =>{
    return (
        <ol>
            {persons.map(person =>
                <li key={person.name}>{person.name}</li>
            )}
        </ol>

    )
}

export default App 
