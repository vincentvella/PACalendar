import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { colors, fontSizes } from "../../config/styles";

DrawerTab.propTypes = {
  title: PropTypes.string.isRequired,
  selected: PropTypes.bool.isRequired,
  onPress: PropTypes.func.isRequired,
  iconName: PropTypes.string.isRequired,
}

export default function DrawerTab (props) {
  const color = props.selected === true ? colors.blue : colors.primary
  return (
    <TouchableOpacity style={styles.container} onPress={props.onPress}>
      <Icon
        name={props.iconName}
        size={35}
        color={color}
      />
      <Text style={[{color}, styles.titleText]}>{props.title}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    margin: 10,
    marginLeft: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleText: {
    fontSize: fontSizes.secondary,
    marginLeft: 10,
  }
})
