const ObjectList = ({list}) => {
    const listValues = Object.values(list);
    return (
        <ul>
            {listValues.map(element => <li key={element}>{element}</li>)}
        </ul>
    )
}
export default ObjectList;