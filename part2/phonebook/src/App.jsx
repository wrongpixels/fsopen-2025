
import {useState} from 'react'
function App() {
    const [persons, setPersons] = useState([
        { name: 'Arto Hellas', number: '040-123456', id: 1 },
        { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
        { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
        { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
    ])
    const [newName, setNewName] = useState('');
    const [newNumber, setNewNumber] = useState('');
    const[filter, setFilter] = useState('');

    const handleTypeName = ({target}) => setNewName(target.value);
    const handleTypeNumber = ({target}) => setNewNumber(target.value);
    const handleTypeFilter = ({target}) => setFilter(target.value);
    const activeFilter = filter.toLowerCase();

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
        const newPerson = {name: newName, number: newNumber, id: persons.length+1};
        setPersons(persons.concat(newPerson));
        setNewName('');
        setNewNumber('');
    }
    const filteredPersons = filter === ''? persons:persons.filter(person => person.name.toLowerCase().includes(activeFilter));
  return (
      <>
          <h2>Phonebook</h2>
         <Filter filter={filter} handleTypeFilter={handleTypeFilter} />
          <AddContactForm newName={newName} handleTypeName={handleTypeName} newNumber={newNumber} handleTypeNumber={handleTypeNumber} handleAddPerson={handleAddPerson} />

          <h2>Numbers</h2>
          <Entries persons={filteredPersons} />
      </>
  )
}
const Filter = ({filter, handleTypeFilter}) => {
    return (
        <div>
            Filter by name: <input value={filter} onChange={handleTypeFilter}/>
        </div>
    )
}
const AddContactForm = (props) => {
    return (
        <div>
            <h3>
                Add contact
            </h3>
            <form>
                Name: <input value={props.newName} onChange={props.handleTypeName}/>
                <div>
                    Number <input value={props.newNumber} onChange={props.handleTypeNumber}/>
                </div>
                <button type="submit" onClick={props.handleAddPerson}>Add</button>
            </form>

        </div>
    )

}
const Entries = ({persons}) => {
    return (
        <ul>
            {persons.map(person =>
                <li key={person.id}>{person.name} : {person.number}</li>
            )}
        </ul>
    )
}

export default App 
