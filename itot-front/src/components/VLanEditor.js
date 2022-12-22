import { useContext } from "react"
import { VlanContext } from "../pages/Vlan.js"

const VLanEditor = () => {
    
    const vlan = useContext(VlanContext)

    return (
        <>
            <div><h1 className="title">{vlan.selected_vlan.uid} <br /> <input className="title-input" type="text" defaultValue={vlan.selected_vlan.name}/></h1></div>
            <span>
                <h3>
                    <label>Network</label>
                    <input className="title-input" type="text" defaultValue={vlan.selected_vlan.network}/>
                </h3>
                <h3>
                    <label>Mask</label>
                    <input className="title-input" type="text" defaultValue={vlan.selected_vlan.mask}/>
                </h3>
                <h3>
                    <label>Gateway</label>
                    <input className="title-input" type="text" defaultValue={vlan.selected_vlan.gateway}/>
                </h3>

                
            </span>
        </>
    )
}

export default VLanEditor