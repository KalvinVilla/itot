import { useEffect, useState } from 'react'
import '../../assets/css/components/SelectInput.css'

const SelectInput = ({list, placeholder, value, blur, name}) => {

    const [val, setVal] = useState(value)
    
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

    const handleBlur = () => {
        setTimeout(() => {
            setHiddenList(true)
        }, 100);

        
    }

    // useEffect(() => {
    //     return () => {
    //         setVal(list.filter(el => {
    //         console.log(el)
    //         console.log(value)
    //         return el.value === value
    //     }))
    //     }
        
    // }, [value])

    useEffect(() => {
        //console.log(list.find(el => el.value === 1).text)
    }, [list])

    

    const handleResult = ({text}) => {
        setVal(text)
        setHiddenList(true)
    }

    const parseValue = ({val}) => {
        const value = list.find(el => el.value === val)
        if(value) {
            return value.text
        } else {
            return ""
        } 
    }

    return <div onBlur={() => handleBlur()} className='ui'>
        <input className='ui-input' name={name} placeholder={placeholder} value={list.find((el) => el.value === val)?.text || list.find((el) => el.value === 1)?.text} onBlur={blur} onChange={(e) => handleChange(e)} onClick={(e) => handleClick(e)}  type='text' />
        <div className='ui-result' hidden={hiddenList}>
            <ul>
            {currentList.map(({text}, key) => {
                return <li className='ui-result-item' onClick={() => handleResult({text})} key={key}>{text}</li>
            })}
            </ul>
        </div>
    </div>

}

export default SelectInput