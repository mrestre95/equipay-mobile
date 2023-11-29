import React from 'react';
import { View, StyleSheet, Image, TouchableWithoutFeedback } from 'react-native';
import { Text, Avatar, withTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import { asignarIndiceSegunPrimeraLetra } from './RandomImageURL';
import {images} from './Images'


const ListItem = ({avatarSource, content, date, addButton, addName, addSpent, addDescription, description, action, theme, color, owner, spent, spentColor, key, isNotification, remitente}) => {
  const fecha = new Date(date)
  const index = isNotification ? asignarIndiceSegunPrimeraLetra(remitente) : asignarIndiceSegunPrimeraLetra(content)

  return (
    <TouchableWithoutFeedback onPress={action}>
      <View key={key} style={[styles.containerItem, {backgroundColor:theme.colors.background}]}>
        <View style={styles.containerImage}>
        {addSpent ? (
          <Image
            style={[styles.avatar, { backgroundColor: theme.colors.background }]}
            source={avatarSource}
      />        
        ) : (
          <Avatar.Image
            size={40}
            style={[styles.avatar, { backgroundColor: theme.colors.background }]}
            source={images[index]}
          />
        )}        

        </View>
        <View style={styles.containerData}>
          <View>
            <Text 
              style={styles.h1} 
              variant="headlineMedium"
            >
              {content}
            </Text>

            {addDescription && (
              <Text 
                style={[styles.h2, { color: theme.colors.searchBarText, marginBottom:-13}]}
                variant="headlineMedium"
              >
                {description}
              </Text>
            )}
            {addSpent ? (
              <Text 
              style={[styles.h2, {fontSize:12}]} 
              variant="headlineMedium"
              >
                {`${fecha.getDate()}/${fecha.getMonth()+1}/${fecha.getFullYear()}`}
              </Text>
            ) : (
              <Text 
              style={[styles.h2, {fontSize:12}]} 
              variant="headlineMedium"
              >
                {`Creado el ${fecha.getDate()}/${fecha.getMonth()+1}/${fecha.getFullYear()}`}
              </Text>              
            )}
            
            {addName && (
              <Text 
                style={[styles.h3, { color: theme.colors.tertiary}]}
                variant="headlineMedium"
              >
                {owner}
              </Text>
            )}
          </View>
          {addButton && (
          <View style={styles.containerButton}>
            <Icon 
              name="chevron-forward-outline" 
              size={20} 
              color={color}/>
          </View>
          )}
          {addSpent && (
          <View>
            <Text
              style={{ color: spentColor}}
              variant="titleSmall"
            >
              {spent}
            </Text>
          </View>
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  containerItem: {
    flexDirection: 'row',
    alignItems:'center',
    justifyContent:'center',
    paddingHorizontal: 10,
    paddingVertical:5,
  },
  containerImage: {
    marginRight: 10,
  },
  containerData: {
    flex: 1,
    flexDirection: 'row',
    alignItems:'center',
    justifyContent:'space-between'
  },
  avatar: {
    width: 40,
    height: 40,
  },
  h1: {
    fontSize: 16,
    marginBottom: -7,
    marginTop:5,
    lineHeight:21
  },
  h2: {
    fontSize: 14,
    color: 'grey',
    marginBottom: -7,
  },
  h3: {
    fontSize: 13,
    marginTop:-7,
    color: 'grey',
  },
});

export default withTheme (ListItem);
