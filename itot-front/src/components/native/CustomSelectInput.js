import { useEffect, useState } from 'react'
import '../../assets/css/components/native/CustomSelectInput.css'

const CustomSelectInput = (props) => {

    const { list, defaultvalue, ...rest} = props

    const [val, setVal] = useState(defaultvalue)
    
    const [hiddenList, setHiddenList] = useState(true)
    const [currentList, setCurrentList] = useState([])

    const handleClick = (e) => {
        const { target } = e
        const { value } = target

        setHiddenList(false)
        setList(value)
    }

    const handleChange = (e) => {
        const { target } = e
        const { value } = target

        setVal(value)
        setList(value)
    }

    const setList = (value) => {
        if(value === "" || value === undefined) {
            setCurrentList(list)
            return
        }

        setCurrentList(list.filter(({text}) => {
            return text.toLowerCase().includes(value.toLowerCase())
        }))
    }

    const handleBlur = (e) => {
        setTimeout(() => {
            setHiddenList(true)
            const value = list.find(el => el.text === val)?.value
            console.log(val)
            console.log(defaultvalue)
            //blur(e)
        }, 100);



        
    }

    useEffect(() => {

    }, [])

    useEffect(() => {
        //console.log(list.find(el => el.value === 1).text)
    }, [list])

    

    const handleResult = ({text}) => {
        setVal(text)
        setHiddenList(true)
    }

    return <div onBlur={(e) => handleBlur(e)} className='ui'>{/*</div><div onBlur={() => handleBlur()} className='ui'>*/}
        <input className='ui-input' {...rest} value={val}  onChange={(e) => handleChange(e)} onClick={(e) => handleClick(e)}  type='text' />
        <div className='ui-result' hidden={hiddenList}>
            <ul>
            {currentList.map(({text}, key) => {
                return <li className='ui-result-item' onClick={() => handleResult({text})} key={key}>{text}</li>
            })}
            </ul>
        </div>
    </div>

}

export default CustomSelectInput