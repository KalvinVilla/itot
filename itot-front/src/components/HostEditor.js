import '../assets/css/components/HostTable.css'
import { useContext, useEffect, useState } from 'react';
import { VlanContext } from '../pages/Vlan.js';
import SelectInput from './SelectInput.js';


let Netmask = require('netmask').Netmask

const HostEditor = (uid) => {

    const vlan = useContext(VlanContext)

    const [saveDisable, setSaveDisable] = useState(true)

    const header = ["","ip", "name", "type", "mac", "parent", "room", "desc"]

    let saveNeeded = []

    const list = [
        {
          value: 1,
          text: "Switch"
        },
        {
          value: 2,
          text: "Routeur of the routeur de la mort"
        },
        {
          value: 3,
          text: "Serveur"
        },
      ]


    const [host, setHost] = useState(undefined)

    // const upsert = (array, key, name, value) => {
    //     const i = array.findIndex(_element => _element[key] !== undefined);
    //     if (i > -1) 
    //         return array.map(_element =>
    //         _element[key] !== undefined
    //         ? { [key] :{..._element[key], [name]: value} } : _element
    //     );
    //     else return [array.push({[key]: {[name]:value}})]

    // }

    useEffect(() => {
        const fetchData = async () => {
            console.log(uid)
                    if(vlan.selected_vlan === undefined) return 
                    const { uid, network, mask } = vlan.selected_vlan
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
                                    tab.push({ip: el, name: "Gateway", id: key, gateway: ''})
                                    return
                                }
                                const h = result.find(e => e.ip === el) ?? {id: key, ip: el}
                                tab.push(h)

                             });
                            setHost(tab)
                            return;
                        })
                    })
        }

        fetchData()


        
        return;

    }, [uid])

    const handleChange = (e) => {
        const { value, defaultValue, valueDefault, name } = e.target
        const parent = e.target.closest(".htbl")
        const key = parent.getAttribute("data-key")
        const action = parent.getAttribute("data-action")

        if(defaultValue !== value || valueDefault !== value) {
            const i = saveNeeded.findIndex(_element => _element[key] !== undefined);
            if (i > -1) 
            saveNeeded = saveNeeded.map(_element =>
                _element[key] !== undefined
                ? { [key] :{..._element[key], [name]: value} } : _element
            );
            else saveNeeded.push({[key]: {action: action, [name]:value}});
            e.target.classList.add("modified")
        }

        console.log(saveNeeded)

    }

    const handleSave = () => {
        if(saveNeeded.length !== 0) {
            const saveData = async (action, body) => {


                if(action === 'update') {
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

            saveNeeded.forEach(el => {
                const [ip] = Object.keys(el)
                const [{action, name, type_id, mac, parent, room_id, commentary}] = Object.values(el)


                console.log(JSON.stringify({ip, name, vlan_uid: vlan.selected_vlan.uid, type_id, mac, parent, room_id, commentary}))
                saveData(action, JSON.stringify({ip, name, vlan_uid: vlan.selected_vlan.uid, type_id, mac, parent, room_id, commentary}))

            })
        } 
    }

    const HandleView = () => {
        return host.map(({ip, name, type_id, mac, parent, room, commentary , gateway}) => {
            return <tr key={ip} data-key={ip} className="htbl" data-action={name !== undefined ? 'update' : 'create'}>
            <td><div className="state"></div></td>
            <td>{ip}</td>
            <td><input className="host-table-input" onBlur={(e) => handleChange(e)}  type="text" name='name' defaultValue={name}/></td>
            <td>
            <SelectInput className="host-table-select" blur={(e) => handleChange(e)} name="type_id" valueDefault={type_id} list={list} placeholder="Choose a type" value={type_id} />
                {/* <select className="host-table-select" onBlur={(e) => handleChange(e)} name="type_id">
                <option>{type_id !== undefined ? type_id.toString() : 0}</option>
                <option>1</option>
                <option>Server</option>
            </select> */}
            </td>
            <td><input className="host-table-input" onBlur={(e) => handleChange(e)} name='mac' type="text" defaultValue={mac}/></td>
            <td><input className="host-table-input" onBlur={(e) => handleChange(e)} name="parent" type="text" defaultValue={parent}/></td>
            <td><select className="host-table-input" onBlur={(e) => handleChange(e)} name="room_id">
                <option>{room}</option>
                <option>LT01</option>
                <option>LT02</option>
            </select></td>
            <td>
                <textarea className="host-table-input area" onBlur={(e) => handleChange(e)} name="commentary" cols="20" defaultValue={commentary}></textarea>
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