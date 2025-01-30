const DrawFlag = ({country}) => {
    return (
        <img src={country.flags.png} alt={country.flags.alt}/>
    )
}
export default DrawFlag;