import '../assets/css/components/HostTable.css'
import { useContext, useEffect, useState } from 'react';
import { VlanContext } from '../pages/Vlan.js';


let Netmask = require('netmask').Netmask

const HostTable = () => {

    const vlan = useContext(VlanContext)

    const [saveDisable, setSaveDisable] = useState(true)

    const header = ["","ip", "name", "type", "mac", "parent", "room", "desc"]

    let saveNeeded = []


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

    }, [vlan.selected_vlan])

    const handleChange = (e) => {
        const { value, defaultValue, name } = e.target
        const parent = e.target.closest(".htbl")
        const key = parent.getAttribute("data-key")

        if(defaultValue !== value) {
            const i = saveNeeded.findIndex(_element => _element[key] !== undefined);
            if (i > -1) 
            saveNeeded = saveNeeded.map(_element =>
                _element[key] !== undefined
                ? { [key] :{..._element[key], [name]: value} } : _element
            );
            else saveNeeded.push({[key]: {[name]:value}});
            console.log(saveNeeded)
        }

    }

    const handleSave = () => {
        if(saveNeeded.length !== 0) {
            const saveData = async (body) => {



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
            }

            saveNeeded.forEach(el => {
                const [ip] = Object.keys(el)
                const [{name, type, mac, parent, room, desc}] = Object.values(el)
                // console.log(ip)
                // console.log({name, type})

                console.log(JSON.stringify({ip, name, type, mac, parent, room, desc}))
                saveData(JSON.stringify({ip, name, type, mac, parent, room, desc}))

            })


            //saveData();
        } 
    }

    const HandleView = () => {
        return host.map(({ip, name, type_id, mac, parent, room, desc}) => {
            return  <tr key={ip} data-key={ip} className="htbl" state={name !== undefined ? 'saved' : 'none'}>
            <td><div className="state"></div></td>
            <td>{ip}</td>
            <td><input className="host-table-input" onBlur={(e) => handleChange(e)}  type="text" name='name' defaultValue={name}/></td>
            <td><select className="host-table-select" onBlur={(e) => handleChange(e)} name="type">
                <option>{type_id !== undefined ? type_id.toString() : 0}</option>
                <option>Switch</option>
                <option>Server</option>
            </select></td>
            <td><input className="host-table-input" onBlur={(e) => handleChange(e)} name='mac' type="text" defaultValue={mac}/></td>
            <td><input className="host-table-input" onBlur={(e) => handleChange(e)} name="parent" type="text" defaultValue={parent}/></td>
            <td><select className="host-table-input" onBlur={(e) => handleChange(e)} name="room">
                <option>{room}</option>
                <option>LT01</option>
                <option>LT02</option>
            </select></td>
            <td>
                <textarea className="host-table-input area" onBlur={(e) => handleChange(e)} name="desc" cols="20">{desc}</textarea>
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
        <>{vlan.selected_vlan === undefined ? "Waiting selected vlan" : (
        
        <div className='content'>
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

                
                </span>


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
        }         </div>)}

        </>
    )

}

export default HostTable