import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, View } from "react-native";
import {connect} from "react-redux";

class AuthLoadingPage extends Component {
  constructor(props){
    super(props);

    this.state = {
      bookmarks: {},
      favorites: {},
      userData: {},
      authedId: '',
      fcm_token: '',
    };
  }

  componentWillMount() {
    if(this.props.isAuthed) {
      this.props.navigation.navigate('Loading');
    } else {
      this.props.navigation.navigate('Login');
    }
  }

  render() {
    return (
      <View style={styles.container}>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  image: {
    height: 400,
    width: 400
  },
});

const mapStateToProps = (state) => {
  return {
    uid: state.Auth.authedId,
    isAuthed: state.Auth.isAuthed,
  };
};

AuthLoadingPage.propTypes = {
  uid: PropTypes.string,
  isAuthed: PropTypes.bool,
};

export default connect(mapStateToProps)(AuthLoadingPage);
