import '../../assets/css/components/native/CustomSelect.css'

const CustomSelect = (props) => {

    const { list, defaultValue, ...rest} = props

    return (
        <>
            <select className="custom-select" defaultValue {...rest}>
                <option></option>
                {list.map(el => {
                    return <option key={el.value}  >{el.text}</option>
                })}
            </select>
        </>
    )


}


export default CustomSelect