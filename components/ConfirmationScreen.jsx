import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { withTheme, Text, Button } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import TopBar from './TopBar';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, { Easing, withSpring, useSharedValue, useAnimatedStyle, withRepeat } from 'react-native-reanimated';

const ConfirmationScreen = ({ theme, message, heading, buttonName, icon, action, addButton, image }) => {
  const navigation = useNavigation();
  const route = useRoute();
  const confirmationScreenData  = route.params;

  // Define un valor compartido animado para la escala del icono
  const scale = useSharedValue(0);

  // Configura la animación de resorte con escala de 0 a 1 y rebote rápido
  useEffect(() => {
    scale.value = withSpring(1, {
      damping: 6, // Ajusta la amortiguación para controlar la velocidad de rebote
      stiffness:120, // Ajusta la rigidez para controlar la velocidad de rebote
      velocity: 2, // Velocidad inicial de la animación
    });
  }, []);

  // Establece el estilo animado para el icono con el efecto de resorte
  const iconStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePress = () => {
    if(confirmationScreenData.id === 'registro')
      navigation.navigate("IniciarSesion")
    else{
      const groupData = {
        id: confirmationScreenData.groupId,
        nombre: confirmationScreenData.groupName
      };
      navigation.navigate("DetallesGrupo", groupData)
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <TopBar
        mode={"center-aligned"}
        actionIcon={'close'}
        action={handlePress}
      />
      <View style={styles.container}>
        <View style={styles.container2}>
          <Animated.View style={iconStyle}>
            <Icon
              name="check-circle"
              size={170}
              color={theme.colors.primary}
            />
          </Animated.View>
          <Text
            style={[styles.text, { color: theme.colors.outline }]}
            variant="displaySmall"
          >
            {confirmationScreenData.heading}
          </Text>
          <Text
            style={[{ color: theme.colors.outline }, { textAlign: 'center' }]
            }
            variant="titleLarge"
          >
            {confirmationScreenData.content}
          </Text>
          <Button
            mode="contained"
            style={styles.buttonConfirm}
            labelStyle={{ fontSize: 16 }}
            icon={icon}
            onPress={handlePress}
          >
            {confirmationScreenData.buttonName}
          </Button>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container2: {
    alignItems: 'center',
    marginTop: -60,
  },
  text: {
    marginTop: 30,
    marginBottom: 10
  },
  buttonConfirm: {
    width: 330,
    height: 45,
    margin: 50,
  },
});

export default withTheme(ConfirmationScreen);
