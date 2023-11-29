import React, {useState} from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Avatar, withTheme, Checkbox  } from 'react-native-paper';
import {images} from './Images'
import { asignarIndiceSegunPrimeraLetra } from './RandomImageURL';

const ListIntegrantes = ({avatarSource, content, theme, selectAll, handleInputChangeParticipantes, participante}) => {

  const index = asignarIndiceSegunPrimeraLetra(content)
  const [checked, setChecked] = useState(selectAll);

  const handleCheckChange = () => {
    if (!selectAll) {
      setChecked(!checked);
      handleInputChangeParticipantes(participante);
    }
  };

  return (
    <View style={styles.containerIntegrantes}>
      <View style={styles.containerImage}>
        <Avatar.Image
          size={40}
          style={[styles.avatar, { backgroundColor: theme.colors.background }]}
          source={images[index]}
          />
      </View>
      <View style={styles.containerData}>
        <Text 
          style={styles.h1} 
          variant="headlineMedium"
        >
          {content}
        </Text>
        <Checkbox.Android
          status={selectAll ? 'checked' : (checked ? 'checked' : 'unchecked')}
          onPress={handleCheckChange}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  containerIntegrantes: {
    flexDirection: 'row',
    alignItems:'center',
    justifyContent:'center',
    paddingVertical:8,
  },
  containerImage: {
    marginRight: 10,
  },
  containerData: {
    flex: 1,
    flexDirection: 'row',
    alignItems:'center',
    justifyContent:'space-between',
  },
  avatar: {
    width: 40,
    height: 40,
  },
  h1: {
    fontSize: 15,
  },
  h2: {
    fontSize: 13,
    color: 'grey',
    marginBottom: -7,
  },
  h3: {
    fontSize: 12,
    marginTop:-7
  },
});

export default withTheme (ListIntegrantes);
