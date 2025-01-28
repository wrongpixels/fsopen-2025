import {useState, useEffect} from 'react'
import phonebookservices from "./services/phonebookservices.js";

function App() {
    const [persons, setPersons] = useState([])
    const [newName, setNewName] = useState('');
    const [newNumber, setNewNumber] = useState('');
    const [filter, setFilter] = useState('');

    useEffect(() => {
        phonebookservices.getContacts().then(result => setPersons(result))
    }, []);

    const handleTypeName = ({target}) => setNewName(target.value);
    const handleTypeNumber = ({target}) => setNewNumber(target.value);
    const handleTypeFilter = ({target}) => setFilter(target.value);
    const activeFilter = filter.toLowerCase();

    const alertMessageSame = `'${newName}' with number ${newNumber} is already in the Phonebook!`
    const alertMessageName = `'${newName}' is already in the Phonebook!\n\nUpdate ${newName}'s number to '${newNumber}'?`;
    const alertMessageNumber = `'${newNumber}' is a already in the Phonebook!\n\nUpdate its contact name to '${newName}'?`;
    const emptyAlert = 'You need to add a Name and a Number!';

    const preventSameContact = () => {
        const personExists = persons.find(person => person.name === newName && person.number === newNumber);
        if (personExists) {
            alert(alertMessageSame);
            return true;
        }
        return false;
    }
    const preventSameName = () => {
        const personExists = persons.find(person => person.name === newName);
        if (personExists) {
            if (window.confirm(alertMessageName)) {
                handleEditPerson({...personExists, number: newNumber});
            }
            return true;
        }
        return false;
    }
    const preventSameNumber = () => {
        const personExists = persons.find(person => person.number === newNumber);
        if (personExists) {
            if (window.confirm(alertMessageNumber)) {
                handleEditPerson({...personExists, name: newName});
            }
            return true;
        }
        return false;
    }
    const preventSamePerson = () => preventSameContact() || preventSameName() || preventSameNumber();

    const preventEmpty = () => {
        const emptyName = newName === '';
        const emptyNumber = newNumber === '';
        let message = emptyAlert;
        if (!emptyName && !emptyNumber) {
            return false;
        }
        if (!emptyName) {
            message = 'Number cannot be empty!';
        } else if (!emptyNumber) {
            message = 'Name cannot be empty!';
        }
        alert(message);
        return true;
    }
    const handleAddPerson = (event) => {
        event.preventDefault();
        if (preventEmpty() || preventSamePerson()) {
            return;
        }
        const newPerson = {name: newName, number: newNumber};
        phonebookservices.addNumber(newPerson).then(
            result => {
                setPersons(persons.concat(result))
                setNewName('');
                setNewNumber('');
            })
    }
    const handleEditPerson = (person) => {
        phonebookservices.editContact(person).then(
            result => {
                setPersons(persons.map(existing => existing.id === result.id ? result : existing))
                setNewName('');
                setNewNumber('');
            }
        )
    }
    const handleDeletePerson = (id) => {
        const personToRemove = persons.find(person => person.id === id);
        if (!personToRemove) {
            return;
        }
        const message = `Do you really want to remove '${personToRemove.name}'?`
        if (window.confirm(message)) {
            phonebookservices.deleteNumber(id)
                .then(() => removeByID(id))
                .catch(() => removeByID(id));
        }
    };

    const removeByID = (id) => setPersons(persons.filter(person => person.id !== id));

    const filteredPersons = filter === '' ? persons : persons.filter(person => person.name.toLowerCase().includes(activeFilter));

    return (
        <>
            <h1>Phonebook</h1>
            <Filter filter={filter} handleTypeFilter={handleTypeFilter}/>
            <AddContactForm newName={newName} handleTypeName={handleTypeName} newNumber={newNumber}
                            handleTypeNumber={handleTypeNumber} handleAddPerson={handleAddPerson}/>

            <h2>Numbers</h2>
            <Entries persons={filteredPersons} handleDeletePerson={handleDeletePerson}/>
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
            <h2>
                Add contact
            </h2>
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
const Entries = ({persons, handleDeletePerson}) => {

    return (
        <ul>
            {
                persons.map(person =>
                    <li key={person.id}><b>{person.name}:</b> {person.number}
                        <button style={{marginLeft: 10}} onClick={() => handleDeletePerson(person.id)}>Delete</button>
                    </li>
                )}
        </ul>
    )
}

export default App 
