import { createContext, useState } from "react"
import Footer from "../components/Footer.js"
import Header from "../components/Header.js"
import HostTable from "../components/HostTable.js"
import VLanList from "../components/VLanList.js"

export const VlanContext = createContext()

const Vlan = () => {

    const [selected_vlan, setSelectedVlan] = useState(undefined)

    return (
        <>
        <Header />
        <VlanContext.Provider value={{selected_vlan, setSelectedVlan}}>
            <VLanList />
            <HostTable />
        </VlanContext.Provider>
        <Footer />
        </>
    )

}

export default Vlan