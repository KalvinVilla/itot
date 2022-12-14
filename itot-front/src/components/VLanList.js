import { useEffect, useState } from "react"

export default () => {

    
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
                return;
            }
            
            await resp.json().then(response => {
                setVlan(response.result.map(el => {
                    return {
                        id: el.uid,
                        name: el.name,
                        network: el.network,
                        mask: el.mask,
                        gateway: el.gateway
                    }
                }))
                return;
            })
        })
    }

    fetchData()

    console.log("hello")

        
        return;
    }, [])


    return (
        <>
            {vlan === undefined ? <h1>Loading</h1> : vlan.map(el => {
                return <div><button className="vlan-menu" key={el.id}>{el.id} - {el.name}</button></div>
            })}


        </>
    )

}