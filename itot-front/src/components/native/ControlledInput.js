import { useState } from "react"

const ControlledInput = (props) => {

    const { controller, defaultValue, ...rest} = props

    const [value, setValue] = useState(defaultValue)
    
    const handleBlur = ({target}) => {
        const { value, defaultValue } = target
        console.log(value + " / " + defaultValue)
    }

    const handleChange = ({target}) => {
        const { value } = target
        setValue(value)
    }

    return (
        <input value={value} onChange={e => handleChange(e)} onBlur={(e => handleBlur(e))} {...rest}/>
    )

}

export default ControlledInput