import { connect } from "react-redux";
import React, { Component } from 'react';
import { bindActionCreators } from "redux";
import { Button } from "react-native-elements";
import { View, StyleSheet, ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from './header';
import { dancer } from "../../../_assets_";
import { colors } from "../../config/styles";
import { handleUnauth } from "../../actions/auth";


class Drawer extends Component {
  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);
  }

  logOut() {
    const { handleUnauth, navigation } = this.props;
    handleUnauth();
    navigation.navigate('AuthLoading');
  }

  render() {
    const { userData } = this.props;
    return (
      <ImageBackground source={dancer} style={styles.container} imageStyle={{ opacity: .2 }} blurRadius={2}>
        <View style={styles.innerContainer}>
          <Header userData={userData}/>
          <Button onPress={this.logOut} icon={<Icon name='logout' size={15} color='white'/>} title='Logout' buttonStyle={{ backgroundColor: colors.blue}}/>
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    marginHorizontal: 20,
  }
});

const mapDispachToProps = dispatch => bindActionCreators({
  handleUnauth,
}, dispatch);

const mapStateToProps = (state) => {
  return {
    userData: state.Auth.userData,
  };
};

export default connect(mapStateToProps, mapDispachToProps)(Drawer);
