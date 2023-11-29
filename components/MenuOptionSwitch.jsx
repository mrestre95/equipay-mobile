import React from "react";
import { View, StyleSheet, Text} from 'react-native';
import { Switch, withTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';

const MenuOptionSwitch = ({theme, isSwitchOn, onToggleSwitch, buttonName, color, iconName}) => {
	
    return (
			<View style={styles.container}>
				<Icon 
					name={iconName} 
					size={20} 
					color={color}>
				</Icon>
				<View style={styles.contentContainer}>
					<Text style={{ fontSize:16, fontWeight:"500", color:color }}>
						{buttonName}
					</Text>
					<Switch
						value={isSwitchOn}
						onValueChange={onToggleSwitch}
					/>
				</View>					
			</View>										
    )
}

const styles = StyleSheet.create({
	container:{
		flexDirection:'row',
		alignItems:"center",
		marginHorizontal:15,
		marginVertical:11
	},
	contentContainer:{
		flex:1,
		flexDirection:'row',
		justifyContent:"space-between",
		alignItems:"center",
		marginLeft:13,
	}

});

export default withTheme(MenuOptionSwitch);