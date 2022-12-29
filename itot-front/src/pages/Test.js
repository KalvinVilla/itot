import { useEffect, useState } from "react"
import ControlledInput from "../components/native/ControlledInput.js"
import CustomSelect from "../components/native/CustomSelect.js";
import SelectInput from "../components/native/CustomSelectInput.js";

const Test = () => {

    /*
     * EXEMPLE DE CHANGE LIST
     * {
     *  create: {
     *      host:
     *          10.25.140.3: {
     *              name: "Host 3",
     *              type_id: 1,
     *              mac: "EA-D6-86-CC-E5-10"
     *          },
     *      type: ["automate"]
     *
     *
     *
     *          
     *  },
     *  update: {
     *      
     *  },
     *  delete: {
     *  
     *  }
     * }
     */
    const [changeList, setChangeList] = useState({});

    const [type, setType] = useState([])

    const [host, setHost] = useState([])

    useEffect(() => {
        setTimeout(() => {
            setHost([
                {ip: "10.25.140.1", name: "gateway", exist: true},
                {ip: "10.25.140.2", name: "host 1", type_id: 1, mac: "EA-D6-86-CC-E5-65", exist: true},
                {ip: "10.25.140.3", exist: false},
                {ip: "10.25.140.4", exist: false},
                {ip: "10.25.140.5", exist: false},
                {ip: "10.25.140.6", exist: false},
                {ip: "10.25.140.7", name: "host 3", type_id: 2, mac: "EA-D6-86-CC-E5-6Z", exist: true},
                {ip: "10.25.140.8", name: "host 4", type_id: 2, mac: "CF-8E-C3-01-24-DA", exist: true},
            ])
        }, 100);

        setTimeout(() => {
            setType([
                {value: 1, text: "N/A" },
                {value: 2, text: "HOST" },
                ])
        }, 200);

        return
    }, [])

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

    useEffect(() => {
        console.log(changeList)
    }, [changeList])

    return (
        <>
            <table className="ht">
                <thead className="hth">
                    <tr className="hthl">
                        <th>ip</th>
                        <th>name</th>
                        <th>type</th>
                        <th>mac</th>
                    </tr>
                </thead>
                <tbody>
                    {host.map(({ip, name, type_id, mac, exist}) => {
                        return <tr key={ip} onBlur={(e) => handleBlur(e, ip, exist)}>
                            <td>{ip}</td>
                            <td><input type='text' name="name" defaultValue={name ?? ""} /></td>
                            <td><CustomSelect list={type} name="type_id" defaultValue={type_id ?? ""} /></td>
                            <td><input type='text' name="mac" defaultValue={mac ?? ""} /></td>
                        </tr> 
                    })}
                </tbody>
            </table> 
        </>
    )

}

export default Test