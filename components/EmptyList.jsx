import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { withTheme, Text, Button } from 'react-native-paper';

const EmptyList = ({ theme, message, heading, buttonName, button2Name, icon, action, action2, addButton, addButtons, image }) => {

  const images = {
    noData: require("../assets/images/no-data.png"),
    smile: require("../assets/images/smile.png"),
    notification:require("../assets/images/notification.png"),
  };

  return (
    <View style={styles.container}>
      <View style={styles.container2}>
        <Image
          source={images[image]} 
          style={styles.image}
        />
        <Text 
          style={[styles.text, {color:theme.colors.outline}]}
          variant="displaySmall"
        >
          {heading}
        </Text>
        <Text 
          style={[{color:theme.colors.outline}, {textAlign:'center'}]}
          variant="titleLarge"
          >
          {message}
        </Text>
        {addButton && 
          <Button 
            mode="contained"
            style={styles.buttonConfirm} 
            labelStyle={{fontSize:16}}
            icon={icon}
            onPress={action}
          >
            {buttonName}
          </Button>
        }
        {addButtons &&
          <>
            <Button 
              mode="contained"
              style={styles.buttonConfirm} 
              labelStyle={{fontSize:16}}
              icon={icon}
              onPress={action}
            >
              {buttonName}
            </Button>
            
            <Button 
              mode="outlined"
              style={styles.buttonUnirse} 
              labelStyle={{fontSize:16}}
              icon={icon}
              onPress={action2}
            >
              {button2Name}
            </Button>
          </>
        }
      </View>
    </View>
  )
}

const styles = StyleSheet.create({

  container:{
    marginHorizontal:20,
    justifyContent:'center',
    alignItems:'center',
  },
  container2:{
    alignItems:'center',
    marginTop:-60,
  },
  image:{
		width:350,
		height:350,
		marginBottom:-45
	},
	text:{
		marginVertical:10,
    textAlign:'center'
	},
	buttonConfirm:{
		width:160,
		margin:50,
    height:45

	},
  buttonUnirse:{
		width:160,
		margin:-35,
    height:45
	},
});

export default withTheme(EmptyList);
