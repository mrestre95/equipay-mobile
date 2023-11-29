import { theme } from 'native-base';
import { View, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { Text, Avatar, withTheme  } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { asignarIndiceSegunPrimeraLetra } from './RandomImageURL';
import {images} from './Images'

const ListSugerencias = ({avatarSource, content, theme, monto, action}) => {

  const index = asignarIndiceSegunPrimeraLetra(content)

  return (
    <TouchableWithoutFeedback onPress={action}>
      <View style={styles.containerSugerencias}>
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
            variant="titleSmall"
          >
            {content}
          </Text>
        </View>
        <View style={styles.containerData}>
          <Icon
            name="arrow-right" 
            size={25} 
            color={theme.colors.primary}
          />
          <View style={{alignItems:'flex-end'}}>
          <Text 
              style={{color:theme.colors.error}} 
              variant="labelSmall"
            >
              debes
            </Text>  
            <Text 
              style={{color:theme.colors.error}} 
              variant="titleSmall"
            >
              {monto}
            </Text>  
          </View>      
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  containerSugerencias: {
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

export default withTheme (ListSugerencias);
