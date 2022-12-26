import { createContext, useState } from "react"
import { useParams } from "react-router-dom"
import Footer from "../components/Footer.js"
import Header from "../components/Header.js"
import HostEditor from "../components/HostEditor.js"
import VLanEditor from "../components/VLanEditor.js"
import VLanList from "../components/VLanList.js"

export const VlanContext = createContext()

const Vlan = () => {

    const { uid } = useParams();
    const [selected_vlan, setSelectedVlan] = useState(undefined)

    return (
        <>
        <Header />
        <VlanContext.Provider value={{selected_vlan, setSelectedVlan}}>
            <VLanList />
            {selected_vlan === undefined ? <div style={{height: '15vh', textAlign:'center', padding: "300px 0", fontSize:"2em"}}>Waiting vlan</div> : 
            <>
            <VLanEditor />
            <HostEditor vlan={uid} />
            </>
            }
        </VlanContext.Provider>
        <Footer />
        </>
    )

}

export default Vlan