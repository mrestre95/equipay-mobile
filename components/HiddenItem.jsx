import { theme } from 'native-base';
import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text, Button, Divider, Avatar, IconButton, withTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


const HiddenItem = ({content, bgcolor, textColor, theme, iconButton}) => {

  return (
    <View style={[styles.containerNotification]}>
      <Icon name={iconButton} size={22} color={theme.colors.background}/>
      <Text
          style={{ color: theme.colors.background}}
          variant="labelLarge"
        >
          {content}
      </Text>

    </View>
  );
};

const styles = StyleSheet.create({
  containerNotification: {
    flex: 1,
    flexDirection: 'row',
    justifyContent:"flex-end", 
    alignItems:"center",
    backgroundColor:'#EF4444',
    paddingHorizontal:18,
  },
  rightButton:{
    backgroundColor:theme.colors.primary, 
    flex:1,
    height:'100%',
    justifyContent:"center", 
    alignItems:"flex-end",
    paddingHorizontal:18,
    paddingTop:16
  },
  leftButton:{
    backgroundColor:theme.colors.tertiary, 
    flex:1,
    height:'100%',
    justifyContent:"center", 
    alignItems:"flex-start",
    paddingHorizontal:26,
    paddingTop:10
  },
});

export default withTheme(HiddenItem);
