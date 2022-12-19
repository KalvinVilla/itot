import { useEffect, useState } from "react"
import '../VLanList.css'

const VLanList = () => {

    
    const [vlan, setVlan] = useState(undefined)

    useEffect(() => {

        const fetchData = async () => {

        fetch("/db/vlan/get", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
        }).then(async resp => {
            if(!resp.ok) {
                console.log("API error")
                setVlan([])
                return;
            }
            
            await resp.json().then(response => {
                setVlan(response.result)
                return;
            })
        })
    }

    fetchData()
        
        return;
    }, [])


    const handleClick = (vlan) => {
        console.log(vlan)
    }

    const HandleView = () => {
        return vlan.map(({uid, name}) => {
            return <div className="vlan-menu-item" key={uid}><button onClick={() => handleClick({uid})} className="vlan-menu-btn" >{uid} - {name}</button></div>
        })
    }


    return (
        <>
            {vlan === undefined ? <h1>Loading</h1> : <div className="vlan-menu"> <HandleView/> </div>}
        </>
    )

}

export default VLanList