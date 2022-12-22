import React, { useState } from 'react';

export const InputTable = () => {


    
  // Création d'un tableau d'objets qui contient les valeurs par défaut des inputs
  const defaultValues = [
    { key: 'input1', value: 'Valeur par défaut 1' },
    { key: 'input2', value: 'Valeur par défaut 2' },
    { key: 'input3', value: 'Valeur par défaut 3' },
  ];

  // Création d'un tableau vide qui va contenir les valeurs modifiées des inputs
  const [modifiedValues, setModifiedValues] = useState([]);

  // Fonction qui va être appelée lorsque la valeur d'un input est modifiée
  const handleChange = (key, value) => {
    // Si la valeur de l'input a été modifiée, on l'ajoute dans le tableau modifiedValues
    console.log("test")
    setModifiedValues(prevValues => [...prevValues, { key, value }]);
    console.log(modifiedValues)
  };

  return (
    <div>
      {defaultValues.map(item => (
        // Pour chaque élément du tableau defaultValues, on crée un input
        <input
          key={item.key}
          defaultValue={item.value}
          onChange={event => handleChange(item.key, event.target.value)}
        />
      ))}
    </div>
  );
};