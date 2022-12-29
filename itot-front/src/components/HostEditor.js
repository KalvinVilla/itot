import '../assets/css/components/HostTable.css'
import { useContext, useEffect, useState } from 'react';
import { VlanContext } from '../pages/Vlan.js';
import SelectInput from './native/CustomSelectInput.js';
import ControlledInput from './native/ControlledInput.js';
import CustomSelect from './native/CustomSelect.js';


let Netmask = require('netmask').Netmask

const HostEditor = () => {

    const vlan = useContext(VlanContext)

    const [changeList, setChangeList] = useState({});

    const header = ["ip", "name", "type", "mac", "parent", "room", "desc"]

    const [host, setHost] = useState(undefined)
    const [type, setType] = useState([])

    useEffect(() => {
        const fetchData = async () => {

            fetch("/db/type/get", {
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
                    setType(response.result.map(type => {
                        return {value: type.id, text: type.name}
                    }))
                    console.log(type)
                    return;
                })
            })
        }

       fetchData()
        
        return;
    }, [])

    useEffect(() => {
        const fetchData = async () => {
                    const { selected_vlan } = vlan
                    const { uid, network, mask } = selected_vlan
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
                            setHost([])
                            return;
                        }
                        await resp.json().then(({result}) => {
                            const tab = []
                            netmask.forEach((el, key) => {
                                if(el === vlan.selected_vlan.gateway) {
                                    tab.push({ip: el, name: "Gateway", id: key, gateway: true})
                                    return
                                }
                                const ho = result.find(e => e.ip === el) ? {...result.find(e => e.ip === el), exist: true} : {id: key, ip: el, exist:false, edited: false}
                            
                                tab.push(ho)

                             });
                            setHost(tab)
                            return;
                        })
                    })
        }

        if(vlan.selected_vlan !== undefined) fetchData()


        
        return;

    }, [vlan])

    const handleBlur = ({target}, ip, exist) => {
        const { value, defaultValue, name } = target

        const action = exist ? 'update' : 'create'

        host.forEach(row => {
            if(row.ip !== ip) return;
            if (value !== defaultValue) {
                console.log("change")
              setChangeList(prevChangeList => ({
                ...prevChangeList,
                [action]: {
                    ...prevChangeList[action],
                    [ip]: {
                  ...prevChangeList[ip],
                  [name]: value,
                    },
                }
              }));
      
            } else {
                console.log("remove change")
              setChangeList(prevChangeList => {

                const copy = prevChangeList[action][ip]
                delete copy[name]

                return {...prevChangeList, [action]: {[ip]: copy}}
              });
            }
          })
    }

    const handleSave = () => {
        //if(saveNeeded.length !== 0) {
            if(0 === 0) {
            const saveData = async (exist, body) => {


                if(exist === true) {
                    fetch("/db/host/update/", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: body
                    }).then(async resp => {
                        if(!resp.ok) {
                            console.log("API error")
                        }
                        await resp.json().then(({result}) => {
                            console.log(result)
                            return;
                        })
                    })
                } else {
                    fetch("/db/host/new/", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: body
                    }).then(async resp => {
                        if(!resp.ok) {
                            console.log("API error")
                        }
                        await resp.json().then(({result}) => {
                            console.log(result)
                            return;
                        })
                    })
                }
            }

            // saveNeeded.forEach(el => {
            //     const [ip] = Object.keys(el)
            //     const [{exist, name, type_id, mac, parent, room_id, commentary}] = Object.values(el)


            //     console.log(JSON.stringify({ip, name, vlan_uid: vlan.selected_vlan.uid, type_id, mac, parent, room_id, commentary}))
            //     saveData(exist, JSON.stringify({ip, name, vlan_uid: vlan.selected_vlan.uid, type_id, mac, parent, room_id, commentary}))

            // })
        } 
    }

    const HandleView = () => {
        return host.map(({ip, name, type_id, mac, parent, room, commentary , gateway, exist}) => {
            return <tr key={ip} data-key={ip} className="htbl" onBlur={(e) => handleBlur(e, ip, exist)}>
            <td>{ip}</td>
            <td><input className="host-table-input" type='text' name="name" defaultValue={name ?? ""} /></td>
            <td>
            <CustomSelect list={type} name="type_id" defaultValue={type_id ?? ""} />
            </td>
            <td><input className="host-table-input" type='text' name="mac" defaultValue={mac ?? ""} /></td>
            <td><input className="host-table-input" type='text' name="parant" defaultValue={parent ?? ""} /></td>
            <td><select className="host-table-input">
                <option>{room}</option>
                <option>LT01</option>
                <option>LT02</option>
            </select></td>
            <td>
                <textarea className="host-table-input area" name="commentary" cols="20" defaultValue={commentary ?? ""}></textarea>
            </td>
        </tr>
        })
    }

    const Header = () => {
        return header.map((item, key) => {
           return <th className="hthc" key={key}>{item}</th>
        })
    }

    const handleRefresh = () => {
        window.location.reload(true) 
    }

    return (
        <>
        <div className="hmenu-container">
            <ul className="hmenu">
                <li><button className="button-61" onClick={handleSave} id="save">Save</button></li>
                <li><button className="button-61" onClick={handleRefresh}>Refresh</button></li>
                <li><button className="button-61" id="delete">Delete</button></li>
            </ul>
        </div>
        {host === undefined ? <h1>Loading</h1> : 
        <div className="twrapper">
            <div className="tscroll">
                <table className="ht">
                    <thead className="hth">
                        <tr className="hthl">
                        <Header />
                        </tr>
                    </thead>
                    <tbody>
                        <HandleView/>
                    </tbody>
                </table> 
            </div>
        </div>
        }
        </>
    )

}

export default HostEditor