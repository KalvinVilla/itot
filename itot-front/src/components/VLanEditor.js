import { useContext } from "react"
import { VlanContext } from "../pages/Vlan.js"

const VLanEditor = () => {
    
    const vlan = useContext(VlanContext)
    const { uid, name, network, mask, gateway} = vlan.selected_vlan;

    console.log(vlan.selected_vlan)

    return (
        <>
            <div><h1 className="title">{uid} <br /> <input className="title-input" type="text" defaultValue={name}/></h1></div>
            <span>
                <h3>
                    <label>Network</label>
                    <input className="title-input" type="text" defaultValue={network}/>
                </h3>
                <h3>
                    <label>Mask</label>
                    <input className="title-input" type="text" defaultValue={mask}/>
                </h3>
                <h3>
                    <label>Gateway</label>
                    <input className="title-input" type="text" defaultValue={gateway}/>
                </h3>

                
            </span>
        </>
    )
}

export default VLanEditor