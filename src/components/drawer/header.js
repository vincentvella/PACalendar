import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Text, Image } from 'react-native';
import {colors, fontSizes} from "../../config/styles";

export default class Header extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.insideContainer}>
          <Image style={styles.image} source={{uri: this.props.userData && this.props.userData.photoURL}}/>
          <Text style={styles.text}>{this.props.userData && this.props.userData.displayName}</Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    paddingBottom: 20,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  insideContainer: {
    alignItems: 'center',
  },
  image: {
    height: 90,
    width: 90,
    borderRadius: 45,
  },
  text: {
    padding: 10,
    fontSize: fontSizes.secondary,
    color: colors.primary,
  }
});
