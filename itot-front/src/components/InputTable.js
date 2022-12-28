import React, { useEffect, useState } from 'react';
import SelectInput from './native/SelectInput.js';

function TableInputs() {

  const [changeList, setChangeList] = useState({});
  const [tableData, setTableData] = useState([
    { key: 'row1', name: 'John', profession:1, surname: 'Smith', exist: true, edited: false},
    { key: 'row2', name: '', surname: '', profession: 0, exist: false, edited: false},
    { key: 'row3', name: 'Bob', profession:1, surname: 'Smith', exist: true, edited: false},
  ])

  const handleChange = (event, key, type) => {
    const { value } = event.target;

    const NEW_VALUE = `default${type.charAt(0).toUpperCase() + type.slice(1)}`

    setTableData(prevTableData =>
      prevTableData.map(row => {
        if (row.key === key) {
          return { ...row, [type]: value };
        }
        return row;
      })
    );


  };

  const handleBlur = (event, key, type) => {
    const { value, defaultValue } = event.target;

    tableData.forEach(row => {
      if(row.key !== key) return;
      if (value !== defaultValue) {
        setChangeList(prevChangeList => ({
          ...prevChangeList,
          [key]: {
            ...prevChangeList[key],
            [type]: value,
          },
        }));

        setTableData(prevTableData =>
          prevTableData.map(row => {
            if (row.key === key) {
              return { ...row, edited: true };
            }
            return row;
          })
        );

      } else {
        setChangeList(prevChangeList => ({
          ...prevChangeList,
        }));
      }
    })
  }

  useEffect(() => {

    console.log("-- CHANGE LIST -- ")
    console.log(changeList)
    console.log("-- TABLE DATA -- ")
    console.log(tableData)

    if(Object.entries(changeList).length > 0) {
      // CAN SAVE
    }

  }, [changeList, tableData])

  return (
    <table>
      <tbody>
        {tableData.map(row => (
          <tr style={{ backgroundColor: row.edited === true ? 'orange' : 'white' }} key={row.key}>
            <td>
              <input
                type="text"
                defaultValue={row.name}
                onBlur={event => handleBlur(event, row.key, 'name')}
              />
            </td>
            <td>
              <input
                type="text"
                defaultValue={row.surname}

                onBlur={event => handleBlur(event, row.key, 'surname')}
              />
            </td>
            <td>
              <SelectInput list={[{value: 1, text:"artisans"}, {value: 2,  text:"peintre"}]} blur={event => handleBlur(event, row.key, 'profession')} placeholder="profession" value={row.profession} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default TableInputs