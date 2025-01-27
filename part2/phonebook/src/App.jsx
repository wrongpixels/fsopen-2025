
import {useState} from 'react'
function App() {
    const [persons, setPersons] = useState([{name: 'Arto Hellas', number: '9999999'}]);
    const [newName, setNewName] = useState('');
    const [newNumber, setNewNumber] = useState('');

    const handleTypeName = ({target}) => setNewName(target.value);

    const handleTypeNumber = ({target}) => setNewNumber(target.value)

    const alertMessageName = `'${newName}' is already in the Phonebook!`;
    const alertMessageNumber = `'${newNumber}' is a number already in the Phonebook!`;
    const emptyAlert = 'You need to add a Name and a Number!';
    const preventSameName = () => {
        if (persons.find(person => person.name === newName))
        {
            alert(alertMessageName);
            return true;
        }
        return false;
    }
    const preventSameNumber = () => {
        if (persons.find(person => person.number === newNumber))
        {
            alert(alertMessageNumber);
            return true;
        }
        return false;
    }
    const preventSamePerson = () => preventSameName() || preventSameNumber();

    const preventEmpty = () => {
        const emptyName = newName === '';
        const emptyNumber = newNumber === '';
        let message = emptyAlert;
        if (!emptyName && !emptyNumber)
        {
            return false;
        }
        if (!emptyName)
        {
            message = 'Number cannot be empty!';
        }
        else if (!emptyNumber)
        {
            message = 'Name cannot be empty!';
        }
        alert(message);
        return true;
    }
    const handleAddPerson = (event) => {
        event.preventDefault();
        if (preventEmpty() || preventSamePerson())
        {
            return;
        }
        const newPerson = {name: newName, number: newNumber};
        setPersons(persons.concat(newPerson));
        setNewName('');
        setNewNumber('');
    }
  return (
      <>
          <h2>Phonebook</h2>
          <form>
              Name: <input value={newName} onChange={handleTypeName}/>
              <div>
              Number <input value={newNumber} onChange={handleTypeNumber} />
              </div>
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
                <li key={person.name}>{person.name} : {person.number}</li>
            )}
        </ol>
    )
}

export default App 
