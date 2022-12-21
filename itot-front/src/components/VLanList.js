import { useContext, useEffect, useState } from "react"
import '../assets/css/components/VLanList.css'
import { VlanContext } from "../pages/Vlan.js";

const VLanList = () => {

    const vlan = useContext(VlanContext);

    const [vlan_list, setVlanList] = useState(undefined)

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
                    setVlanList([])
                    return;
                }
                
                await resp.json().then(response => {
                    setVlanList(response.result)
                    return;
                })
            })
        }

        fetchData()
        
        return;
    }, [])


    const handleClick = (e, v) => {
        vlan.setSelectedVlan(v)
    }

    const HandleView = () => {
        return vlan_list.map((vlan) => {
            return <li key={vlan.uid} className="vlan-item" selected={(vlan.selected_vlan !== undefined && vlan.selected_vlan.uid === vlan.uid) ? "current" : null }><button onClick={(e) => handleClick(e, vlan)} className="vlan-item-btn">{vlan.uid} <br /> {vlan.name}</button></li>
        })
    }


    return (
        <>
            {vlan_list === undefined ? <h1>Loading</h1> :     <ul className="vlan-nav"> <HandleView/> </ul>}
        </>
    )

}

export default VLanList