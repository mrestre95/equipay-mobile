import React, {useState} from 'react';
import { Appbar, Menu, Divider, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';


const TopBar = ({ appBarTitle, actionIcon, showBackAction, mode, actionIconColor, rippleColor, action, isMenu }) => {

  const navigation = useNavigation();

  const [menuVisible, setMenuVisible] = useState(false);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  return (
    <Appbar.Header style={{height:45}} mode={mode}>
      {showBackAction && <Appbar.BackAction size={18} onPress={() => navigation.goBack()}/>}
      <Appbar.Content title={appBarTitle} titleStyle={{ fontSize: 18}}/>

      {isMenu ? (
            <Menu
              visible={menuVisible}
              onDismiss={closeMenu}
              contentStyle={{ marginTop: 19 }}
              anchor={<Appbar.Action color={actionIconColor} icon={actionIcon} onPress={openMenu} rippleColor={rippleColor}/>}
            >
              <Menu.Item 
                leadingIcon="plus" 
                onPress={() => {
                  closeMenu()
                  navigation.navigate("CrearGrupo")
                }} 
                title="Nuevo" 
              />
              <Divider horizontalInset/>
              <Menu.Item  
                leadingIcon="account-multiple-plus" 
                onPress={() => {
                  closeMenu()
                  navigation.navigate("UnirseGrupo")
                }}                 
                title="Unirse" 
              />
            </Menu>
          ) : (
            <Appbar.Action color={actionIconColor} icon={actionIcon} onPress={action} rippleColor={rippleColor} />
          )}
    </Appbar.Header>
  );
}

export default TopBar;