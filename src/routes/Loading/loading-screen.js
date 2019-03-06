import moment from "moment";
import get from 'lodash.get';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import React, { Component } from 'react';
import { bindActionCreators } from "redux";
import { View, StyleSheet, Animated, Image, ScrollView, Dimensions } from 'react-native';
import actions from "../../actions";
import { colors } from '../../config/styles';
import { database, ref } from "../../config/config";
import { setEvents, setEventsByOrg, setEventsByDate, setEventsByEpoch } from "../../actions/events";

const { orgActions } = actions;
const { getOrgs } = orgActions;

const {width} = Dimensions.get('window');

class LoadingScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      rotation: new Animated.Value(0),
    };
    this.getOrgs = this.getOrgs.bind(this);
    this.getEvents = this.getEvents.bind(this);
    this.shakeLogo = this.shakeLogo.bind(this);
    this.getUserData = this.getUserData.bind(this);
    this.navigateHome = this.navigateHome.bind(this);
    this.startLoadingProcedure = this.startLoadingProcedure.bind(this);
  }

  componentWillMount() {
    this.startLoadingProcedure();
  }

  async getUserData() {
    const snapshot = await ref.child(`UserData/${this.props.uid}`).once('value');
    const userData = snapshot.val() || {};
    //TODO: add user data to redux here
  }

  async getOrgs() {
    const { getOrgs } = this.props;
    const snapshot = await database.ref(`Orgs/`).once('value');
    getOrgs((snapshot.val() || {}));
  }

  async getEvents() {
    const snapshot = await ref.child('Mobile/Events/').once('value');
    const events = snapshot.val() || {};
    let mappedEvents = {};
    let eventsByDate = {};
    let eventsByEpoch = {};
    const now = new Date().valueOf();
    Object.keys(events).map((eventKey) => {
      const startDateTime = moment(new Date(get(events, `${eventKey}.startDateTime`, new Date())));
      const endDateTime = moment(new Date(get(events, `${eventKey}.endDateTime`, new Date())));
      let event = { ...events[eventKey], endDateTime, startDateTime };
      const epochDate = event.startDateTime.valueOf();
      const templatedDate = event.startDateTime.format('YYYY-MM-DD');
      if (epochDate > now) {
        mappedEvents[eventKey] = { ...event };
        if (eventsByEpoch[epochDate]) {
          eventsByEpoch[epochDate].push({ ...event, eventKey });
        } else {
          eventsByEpoch[epochDate] = [{ ...event, eventKey }];
        }
      }
      if (eventsByDate[templatedDate]) {
        eventsByDate[templatedDate].push({ ...event, eventKey });
      } else {
        eventsByDate[templatedDate] = [{ ...event, eventKey }];
      }
    });
    this.props.setEvents(mappedEvents);
    this.props.setEventsByDate(eventsByDate);
    this.props.setEventsByEpoch(eventsByEpoch);
  }

  navigateHome() {
    const { navigation } = this.props;
    navigation.navigate('Main');
  }

  shakeLogo() {
    const { rotation } = this.state;
    const useNativeDriver = true;
    Animated.loop(
      Animated.sequence([
        Animated.timing(rotation, { toValue: -1, duration: 150, useNativeDriver }),
        Animated.timing(rotation, { toValue: 1, duration: 150, useNativeDriver }),
        Animated.timing(rotation, { toValue: 0, duration: 500, useNativeDriver }),
      ]), { iterations: 3, useNativeDriver }
    ).start(() => this.navigateHome());
  }

  getTransform() {
    const { rotation } = this.state;
    return {
      transform: [{
        rotate: rotation.interpolate({
          inputRange: [-1, 1],
          outputRange: ['-20deg', '20deg']
        })
      }]
    };
  }

  startLoadingProcedure() {
    this.getUserData().then(() => {
      this.getOrgs().then(() => {
        this.getEvents().then(() => {
          this.shakeLogo();
        });
      });
    });
  }

  render() {
    return (
      <ScrollView contentContainerStyle={styles.container} scrollEnabled={false}>
        <Image style={styles.image} source={require('../../../_assets_/pacalendar-blank.png')}/>
        <View style={{...StyleSheet.absoluteFillObject}}>
          <View style={styles.imageContainer}>
            <Animated.Image
              style={[styles.logo, this.getTransform()]}
              source={require('../../../_assets_/transparentLogo.png')}
            />
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  logo: {
    resizeMode: 'contain',
    width: width / 1.5,
  },
  image: {
    resizeMode: 'contain',
    width,
    height: width, //Because the image is square I can do this ;)
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

const mapDispachToProps = dispatch => bindActionCreators({
  setEventsByEpoch,
  setEventsByDate,
  setEventsByOrg,
  setEvents,
  getOrgs,
}, dispatch);


const mapStateToProps = (state) => {
  return {
    uid: state.Auth.authedId,
    events: state.Events.events,
    orgs: state.Organization.orgs,
    allEvents: state.Events.allEvents,
  };
};

LoadingScreen.propTypes = {
  uid: PropTypes.string.isRequired,
};

export default connect(mapStateToProps, mapDispachToProps)(LoadingScreen);
