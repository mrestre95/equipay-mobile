import React, { useState, useEffect } from "react";
import TopBar from "./TopBar";
import { TextInput, HelperText, Button, Text, withTheme } from 'react-native-paper';
import { StyleSheet, View, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { useToast } from "native-base";
import { useNavigation } from '@react-navigation/native';
import { useUserContext } from '../contexts/UserContext';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import ErrorMessage from "./ErrorMessage";
import { registroUsuario } from "../apis/authControllerAPI";

const RegistroUsuario = ({ theme }) => {
  const navigation = useNavigation();
  const { keyboardApparience } = useUserContext();
  const toast = useToast();
  const id = "registro-toast";
  const [isLoading, setIsLoading] = useState(false);

  const [inputValueNombre, setInputValueNombre] = useState("");
  const [showNombreError, setShowNombreError] = useState(false);

  const [inputValueApellido, setInputValueApellido] = useState("");
  const [showApellidoError, setShowApellidoError] = useState(false);

  const [inputValueEmail, setInputValueEmail] = useState("");
  const [showEmailError, setShowEmailError] = useState(false);

  const [inputValuePass, setInputValuePass] = useState("");
  const [showPasswordError, setShowPasswordError] = useState(false);

  const handleInputChangeNombre = (text) => {
    setInputValueNombre(text);
    setShowNombreError(text.trim() === "");
  };

  const handleInputChangeApellido = (text) => {
    setInputValueApellido(text);
    setShowApellidoError(text.trim() === "");
  };

  const handleInputChangeEmail = (text) => {
    setInputValueEmail(text);
    setShowEmailError(text.trim() === "");
  };

  const handleInputChangePass = (text) => {
    setInputValuePass(text);
    setShowPasswordError(text.trim() === "");
  };

  const handleSendData = async () => {
    try {
      setIsLoading(true);
      const response = await registroUsuario(inputValueEmail, inputValueNombre, inputValueApellido, inputValuePass);
      const confirmationScreenData = {
        id:'registro',
        heading: 'Genial !',
        content: 'Tu registro se ha completado exitosamente',
        buttonName: 'Iniciar sesion'
      }
      navigation.navigate("ConfirmationScreen", confirmationScreenData);
    } 
    catch (error) {
      if (error.response && !toast.isActive(id)) {
          toast.show({
            render: () => (
              <ErrorMessage
                message={`${error.response.data}`}
              />
            ),
            id,
            placement: "bottom",
            avoidKeyboard: true,
          });
        }
      }
    finally {
      setIsLoading(false);
    }
  };

  const handlePress = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (inputValueNombre.trim() === "" || inputValueApellido.trim() === "" || inputValueEmail.trim() === "" || inputValuePass.trim() === "") {
      if (!toast.isActive(id)) {
        toast.show({
          render: () => (
            <ErrorMessage
              message={'Debes introducir nombre, apellido, email y contraseña. Inténtalo de nuevo.'}
            />
          ),
          id,
          placement: "bottom",
          avoidKeyboard: true,
        });
      }
    }
    else if (!emailRegex.test(inputValueEmail)) {
      if (!toast.isActive(id)) {
        toast.show({
          render: () => (
            <ErrorMessage
              message={'El formato de mail ingresado no es correcto. Intentelo de nuevo.'}
            />
          ),
          id,
          placement: "bottom",
          avoidKeyboard: true,
        });
      }
    }
    else {
      toast.closeAll();
      handleSendData();
    }
  };

  return (
    <View style={styles.container}>
      <TopBar
        appBarTitle={"Registrarse"}
        showBackAction={true}
        mode={"center-aligned"}
      />
      <KeyboardAwareScrollView
        contentContainerStyle={styles.formContainer}
        resetScrollToCoords={{ x: 0, y: 0 }}
        enableOnAndroid={true}
        enableAutomaticScroll={true}
        keyboardOpeningTime={0}
        extraScrollHeight={100}
      >
        <View style={{ alignItems: "center" }}>
          <Image
            style={styles.image}
            source={require('../assets/images/signup3.png')}
          />
        </View>
        <Text
          style={[styles.heading, { color: theme.colors.onBackground, fontWeight: 'bold' }]}
          variant="headlineLarge"
        >
          Configura tu cuenta
        </Text>

        <TextInput
          style={styles.button}
          onChangeText={handleInputChangeNombre}
          value={inputValueNombre}
          mode="outlined"
          label="Nombre"
          placeholder="Ingrese su nombre"
          error={showNombreError}
          right={<TextInput.Icon icon="account" />}
          keyboardAppearance={keyboardApparience}
        />
        {showNombreError && (
          <HelperText
            type="error"
            style={styles.helperText}
          >
            Debe ingresar un nombre
          </HelperText>
        )}

        <TextInput
          style={styles.button}
          onChangeText={handleInputChangeApellido}
          value={inputValueApellido}
          mode="outlined"
          label="Apellido"
          placeholder="Ingrese su apellido"
          error={showApellidoError}
          right={<TextInput.Icon icon="account" />}
          keyboardAppearance={keyboardApparience}
        />
        {showApellidoError && (
          <HelperText
            type="error"
            style={styles.helperText}
          >
            Debe ingresar un apellido
          </HelperText>
        )}

        <TextInput
          style={styles.button}
          onChangeText={handleInputChangeEmail}
          value={inputValueEmail}
          mode="outlined"
          label="Correo electrónico"
          placeholder="Ingrese su correo electrónico"
          error={showEmailError}
          right={<TextInput.Icon icon="email" />}
          keyboardAppearance={keyboardApparience}
        />
        {showEmailError && (
          <HelperText
            type="error"
            style={styles.helperText}
          >
            Debe ingresar un correo electrónico
          </HelperText>
        )}

        <TextInput
          style={styles.button}
          onChangeText={handleInputChangePass}
          value={inputValuePass}
          secureTextEntry
          mode="outlined"
          label="Contraseña"
          placeholder="Ingrese su contraseña"
          error={showPasswordError}
          right={<TextInput.Icon icon="key-variant" />}
          keyboardAppearance={keyboardApparience}
        />
        {showPasswordError && (
          <HelperText
            type="error"
            style={styles.helperText}
          >
            Debe ingresar una contraseña
          </HelperText>
        )}

        <Button
          mode="contained"
          style={styles.buttonConfirm}
          labelStyle={{ fontSize: 16 }}
          onPress={handlePress}
          loading={isLoading}
          disabled={isLoading}
        >
          Confirmar
        </Button>
        <SafeAreaView style={styles.containerFooter}>
          <Text
            style={{ color: theme.colors.outline }}
            variant="titleSmall"
          >
            ¿Ya tienes una cuenta?
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('LoginForm')}
          >
            <Text
              style={{ color: theme.colors.primary, marginLeft: 4 }}
              variant="titleSmall"
            >
              Login
            </Text>
          </TouchableOpacity>
        </SafeAreaView>
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 15,
  },
  formContainer: {
    flex:1
  },
  button: {
    justifyContent: "center",
    marginVertical: 8,
  },
  buttonConfirm: {
    height: 45,
    marginVertical: 30,
  },
  heading: {
    marginTop: 10,
  },
  helperText: {
    marginTop: -10,
    marginBottom: -5,
  },
  containerFooter: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    marginHorizontal: 15,
    marginVertical: 15,
  },
  image: {
    width: 260,
    height: 260,
  }
});

export default withTheme(RegistroUsuario);
