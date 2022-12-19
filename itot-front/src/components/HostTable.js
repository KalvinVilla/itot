import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';

let Netmask = require('netmask').Netmask

const HostTable = () => {

    const uid = "140"

    const header = ["ip", "name", "type", "mac", "parent", "room", "desc"]


    const [host, setHost] = useState(undefined)

    useEffect(() => {
        const fetchData = async () => {
            console.log(uid)

            fetch("/db/vlan/get/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    vlans: uid
                })
            }).then(async response => {
                if(!response.ok) {
                    console.log("API error")
                    //setHost([])
                    return;
                }

                await response.json().then(({result}) => {
                    const { uid, network, mask } = result[0]
                    const netmask = new Netmask(`${network}/${mask}`)

                    fetch("/db/host/get/", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            vlans: uid
                        })
                    }).then(async resp => {
                        if(!resp.ok) {
                            console.log("API error")
                            //setHost([])
                            return;
                        }
                        
                        await resp.json().then(({result}) => {

                            const tab = []

                            console.log(result)
                            
                            netmask.forEach((el, key) => {
                                const h = result.find(e => e.ip === el) ?? {id: key, ip: el}
                                tab.push(h)

                             });
                            
                            setHost(tab)
                            console.log(tab)
                            return;
                        })
                    })
                })
            })

            // fetch("/db/host/get/", {
            //     method: "POST",
            //     headers: {
            //         "Content-Type": "application/json"
            //     },
            //     body: JSON.stringify({
            //         vlans: VLAN.uid
            //     })
            // }).then(async resp => {
            //     if(!resp.ok) {
            //         console.log("API error")
            //         setHost([])
            //         return;
            //     }
                
            //     await resp.json().then(response => {
            //         console.log(response)
            //         setHost(response.result)
            //         return;
            //     })
            // })


        }

        fetchData()


        
        return;

    }, [])

    const HandleView = () => {
        return host.map(({ip, name, type, mac, parent, room, desc}) => {
            return <tr key={ip} style={name !== undefined ? {backgroundColor: "green"} : null}>
                <td>
                    {ip}
                </td>
                <td>
                    <input style={{background: 'transparent', border: 'none'}} defaultValue={name}  />
                </td>
                <td>
                    <input defaultValue={type} style={{background: 'transparent', color: "#fff", border: 'none'}} />
                </td>
                <td>
                    <input defaultValue={mac} style={{background: 'transparent', border: 'none'}}  />
                </td>
                <td>
                    <input defaultValue={parent} style={{background: 'transparent', border: 'none'}}  />
                </td>

            </tr>
        })
    }

    const Header = () => {
        return header.map((item, key) => {
           return <th key={key}>{item}</th>
        })
    }

    return (
        <>
            {host === undefined ? <h1>Loading</h1> : 
             <table>
                <thead>
             <tr>
               <Header />
             </tr>
             </thead>
             <tbody>
             <HandleView/>
             </tbody>
           </table> 
            }
        </>
    )

}

export default HostTable