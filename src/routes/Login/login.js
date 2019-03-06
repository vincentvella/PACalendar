import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import Config from 'react-native-config';
import { Button } from "react-native-elements";
import { LoginManager } from "react-native-fbsdk";
import Icon from 'react-native-vector-icons/FontAwesome';
import { GoogleSignin, statusCodes } from 'react-native-google-signin';
import { View, Text, Image, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { colors, fontSizes } from "../../config/styles";
import { firebaseAuth } from "../../config/config";
import { handleFacebookAuth, handleGoogleAuth, onAuthChanged } from "../../actions/auth";

const Spinner = require('react-native-spinkit');
const { width } = Dimensions.get('window');

class Login extends Component {
  constructor(props) {
    super(props);
    this.signInWithGoogle = this.signInWithGoogle.bind(this);
    this.signInWithFacebook = this.signInWithFacebook.bind(this);
  }

  componentWillMount() {
    GoogleSignin.configure({
      iosClientId: Config.CLIENT_ID,
      webClientId: Config.CLIENT_ID_WEB,
      forceConsentPrompt: true,
    });
  }

  componentDidMount() {
    firebaseAuth.onAuthStateChanged((user) => this.props.dispatch(onAuthChanged(user)));
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.uid && nextProps.isAuthed) {
      this.props.navigation.navigate('AuthLoading');
    }
  }

  async signInWithGoogle() {
    try {
      await GoogleSignin.hasPlayServices();
      const user = await GoogleSignin.signIn();
      this.props.dispatch(handleGoogleAuth(user));
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
        console.log('Sign in cancelled');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (f.e. sign in) is in progress already
        console.log('Sign in in-progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
        console.log('No play services');
      } else {
        // some other error happened
        console.log('UNKNOWN', error.code, error);
      }
    }
  };

  async signInWithFacebook() {
    try {
      let result = await LoginManager.logInWithReadPermissions(["public_profile"]);
      if (result.isCancelled) {
        console.log("Login cancelled");
      } else {
        this.props.dispatch(handleFacebookAuth());
      }
    } catch (error) {
      console.log("Login fail with error: " + error);
    }
  }

  render() {
    return (
      <ScrollView contentContainerStyle={styles.container} scrollEnabled={false}>
        <Image style={styles.image} source={require('../../../_assets_/pacalendar.png')}/>
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.title}>PACalendar</Text>
          <Text style={styles.assuranceText}>Supporting the Arts since 2018!</Text>
        </View>
        <View style={{ alignItems: 'center' }}>
          {this.props.isAuthenticating &&
          <Spinner size={60} type={'WanderingCubes'} color={colors.blue}/>
          }
        </View>
        <View style={styles.loginContainer}>
          <View style={styles.oauthButton}>
            <Button
              title="Login with Facebook"
              onPress={this.signInWithFacebook}
              icon={<Icon name="facebook" color="#ffffff" size={16}/>}
              titleProps={{adjustsFontSizeToFit: true, numberOfLines: 1}}
              buttonStyle={{paddingHorizontal: 10, backgroundColor: "#3b5998"}}
            />
          </View>
          <View style={styles.oauthButton}>
            <Button
              title="Sign in with Google"
              onPress={this.signInWithGoogle}
              icon={<Icon name="google" color="#ffffff" size={16}/>}
              titleProps={{adjustsFontSizeToFit: true, numberOfLines: 1}}
              buttonStyle={{paddingHorizontal: 15, backgroundColor: "#db3236"}}
            />
          </View>
        </View>
      </ScrollView>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticating: state.Auth.isAuthenticating,
  isAuthed: state.Auth.isAuthed,
  uid: state.Auth.authedId,
});

Login.propTypes = {
  isAuthenticating: PropTypes.bool,
  isAuthed: PropTypes.bool,
  uid: PropTypes.string,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: 'space-between',
  },
  image: {
    resizeMode: 'contain',
    width,
    height: width, //Because the image is square I can do this ;)
  },
  loginContainer: {
    paddingBottom: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  oauthButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  title: {
    color: colors.blue,
    fontSize: 40,
    textAlign: 'center',
  },
  assuranceText: {
    paddingTop: 15,
    color: colors.secondary,
    fontSize: fontSizes.secondary,
  },
});

export default connect(mapStateToProps)(Login);
