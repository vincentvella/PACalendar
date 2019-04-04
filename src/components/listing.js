import { Tabs, Tab } from 'native-base';
import { connect } from "react-redux";
import React, { Component, Fragment } from 'react';
import { ShareDialog } from 'react-native-fbsdk';
import Icon from "react-native-vector-icons/FontAwesome";
import { ImageViewer } from "react-native-image-zoom-viewer";
import * as AddCalendarEvent from "react-native-add-calendar-event";
import { Badge, Card, Divider, ListItem } from "react-native-elements";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  ScrollView,
  Linking,
  Dimensions,
  Image,
  Modal,
  Platform, ImageBackground
} from 'react-native';
import { colors, fontSizes } from "../config/styles";
import * as moment from "moment";
import { TabView, TabBar, SceneMap, PagerScroll, PagerAndroid } from 'react-native-tab-view';
import { concert } from "../../_assets_";

let Spinner = require('react-native-spinkit');
const { height, width } = Dimensions.get('window');

class Listing extends Component {

  //<editor-fold desc="Static Render Methods">
  static renderColumns(tag, value) {
    if (value) {
      return (
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 2, flexDirection: 'column' }}>
            <Text style={{ paddingBottom: 15 }}>{tag}</Text>
          </View>
          <View style={{ flex: 5, flexDirection: 'column' }}>
            <Text style={{ paddingBottom: 15 }}>{value}</Text>
          </View>
        </View>
      );
    }
    return null;
  }

  static renderWhen(startDateTime, endDateTime) {
    if (startDateTime && endDateTime) {
      return (
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 2, flexDirection: 'column' }}>
            <Text style={{ paddingBottom: 15 }}>When:</Text>
          </View>
          <View style={{ flex: 5, flexDirection: 'column' }}>
            {startDateTime.format('YYYY-MM-DD') !== endDateTime.format('YYYY-MM-DD') ?
              <Text
                style={{ paddingBottom: 5 }}>{startDateTime.format('MMMM Do') + ` - ${endDateTime.format('Do YYYY')}`}</Text> :
              <Text style={{ paddingBottom: 5 }}>{startDateTime.format('MMMM Do YYYY')}</Text>
            }
            <Text
              style={{ paddingBottom: 15 }}>{startDateTime.format('h:mm a') + ' - ' + endDateTime.format('h:mm a')}</Text>
          </View>
        </View>
      );
    }
    return null;
  }

  static renderDescription(description) {
    if (description) {
      return (
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 1, flexDirection: 'column' }}>
            <Text style={{ paddingVertical: 15 }}>{description}</Text>
          </View>
        </View>
      );
    }
    return null;
  }

  static renderSubtitle(subtitle) {
    if (subtitle) {
      return (
        <View style={{ flexDirection: 'row' }}>
          <Text style={{ fontSize: 14, paddingBottom: 15 }}>{subtitle}</Text>
        </View>
      );
    }
    return null;
  }

  static renderPaid(event) {
    if (event.free && event.free === 'paid') {
      return (
        <Fragment>
          <Badge value={'Paid'} containerStyle={{ marginVertical: 5 }} />
          {event.available &&
          <Badge
            value={`Tickets ${event.available === 'yes' ? '' : 'Not'} Available at Door`}
            containerStyle={{ marginVertical: 5 }}
          />}
          <View style={{ flexDirection: 'row', padding: 15 }}>
            <View style={{ flex: 2, flexDirection: 'column' }}>
              <Text>Ticket Details:</Text>
            </View>
            <View style={{ flex: 5, flexDirection: 'column' }}>
              <Text>{event.ticketDetails}</Text>
            </View>
          </View>
          {event.link &&
          <View style={{ flexDirection: 'row', padding: 15 }}>
            <View style={{ flex: 2, flexDirection: 'column' }}>
              <Text>Ticket Link:</Text>
            </View>
            <View style={{ flex: 5, flexDirection: 'column' }}>
              <Text style={{ color: 'blue', textDecorationLine: 'underline' }}
                    onPress={() => Linking.openURL(`${event.link}`)}>{event.link}</Text>
            </View>
          </View>
          }
        </Fragment>
      );
    }
    return null;
  }

  static renderTitle(title) {
    if (title) {
      return (
        <View style={{ flexDirection: 'row' }}>
          <Text style={{ fontSize: 22 }}>{title}</Text>
        </View>
      );
    }
    return null;
  }

  //</editor-fold>

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      shareVisible: false,
      viewImageModal: false,
      index: 0,
      routes: [
        { key: 'performers', title: 'Performer(s)' },
        { key: 'tickets', title: 'Tickets' },
        { key: 'share', title: 'Share' },
      ],
    };

    this.facebookShare = this.facebookShare.bind(this);
    this.addToCalendar = this.addToCalendar.bind(this);
    this.renderImageOverlay = this.renderImageOverlay.bind(this);
  }

  async facebookShare() {
    let event = this.props.navigation.state.params.event;
    const shareLinkContent = {
      contentType: 'link',
      contentUrl: `https://psupac.app.link/zACH7gTXWR`,
      contentDescription: 'Welcome to PACalendar. Do you love music, the arts, or are just looking for something fun to do on campus? Join us and see more!',
    };
    try {
      let canShow = await ShareDialog.canShow(shareLinkContent);
      if (canShow) {
        let result = await ShareDialog.show(shareLinkContent);
        if (result.isCancelled) {
          console.log('Share cancelled');
        } else {
          console.log('Share success with postId: ' + result.postId);
        }
      }
    } catch (error) {
      console.log('Share Fail with error: ' + error);
    }
  }

  addToCalendar() {
    const { event } = this.props.navigation.state.params;
    const eventConfig = {
      title: event.title,
      startDate: moment.utc(event.startDateTime).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
      endDate: moment.utc(event.endDateTime).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
      location: event.location,
      notes: event.description,
    };
    AddCalendarEvent.presentEventCreatingDialog(eventConfig)
    .then((eventInfo) => {
      if (eventInfo) {
        //TODO: dispatch a flash notification for confirmation
      }
    })
    .catch((error) => {
      //TODO: Investigate better error handling and notifications
      console.log('Calendar Error: ', error);
    });
  }

  renderImageOverlay(event) {
    if (event.url) {
      return (
        <View>
          <Modal visible={this.state.viewImageModal} onRequestClose={() => this.setState({ viewImageModal: false })}>
            <ImageViewer
              imageUrls={[{ url: event.url }]}
              renderIndicator={() => <View />}
              renderHeader={() => (
                <TouchableOpacity
                  style={{ paddingTop: 40, marginRight: 5, alignItems: 'flex-end' }}
                  onPress={() => {
                    this.setState({ viewImageModal: false });
                  }}>
                  <Icon style={{ padding: 5 }} color='white' size={20} name='close' />
                </TouchableOpacity>
              )}
              loadingRender={() => (
                <View style={{ height: height, alignSelf: 'center', justifyContent: 'center' }}>
                  <Spinner size={80} type={'FadingCircleAlt'} color={'#ffffff'} />
                </View>
              )}
            />
          </Modal>
          <TouchableOpacity onPress={() => this.setState({ viewImageModal: true })}>
            <Image
              resizeMode="contain"
              style={{ height: 200, width: 250, alignSelf: 'center' }}
              source={!!(event.url && event.url !== '') ? { uri: event.url } : {}}
            />
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  }


  render() {
    const { navigation, orgs } = this.props;
    let event = navigation.state.params.event;
    let categories = '';
    if (event && event.category && event.category.length > 0) {
      categories = event.category.reduce((categoryString, category, index) => {
        if (event.category.length === index + 1) {
          categoryString = categoryString.concat(`${category.label}`);
        } else {
          categoryString = categoryString.concat(`${category.label}, `);
        }
        return categoryString;
      }, "");
    }
    return (
      <ImageBackground source={concert} style={styles.container} imageStyle={{opacity: .1}} blurRadius={2}>
        {event &&
        <ScrollView>
          <Card containerStyle={{ paddingTop: 5, padding: 0, marginBottom: 25, borderRadius: 10 }}>
            <View>
            {this.renderImageOverlay(event)}
            <View style={{ width: width * .8, flex: 1, padding: 15 }}>
              {Listing.renderTitle(event.title)}
              {Listing.renderSubtitle(event.subtitle)}
              <Divider/>
              {Listing.renderDescription(event.description)}
              {Listing.renderWhen(event.startDateTime, event.endDateTime)}
              {Listing.renderColumns('Location:', event.location)}
              {Listing.renderColumns('Categories:', categories)}
            </View>
            <Divider />
            <View style={{ paddingTop: 10 }}>
              {(event.free && event.free === 'free') ? <Badge value="Free"/> : null}
              {Listing.renderPaid(event)}
            </View>
            <Divider />
            <View style={styles.buttonBar}>
              <TouchableHighlight style={styles.button} onPress={() => this.addToCalendar()}>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                  <Icon color="dimgrey" size={20} name={'calendar-plus-o'}/>
                </View>
              </TouchableHighlight>
              <TouchableHighlight style={styles.button} onPress={this.facebookShare}>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                  <Icon color="dimgrey" size={20} name={'facebook'}/>
                </View>
              </TouchableHighlight>
            </View>
            <Fragment>
              {event.orgs &&
              <Fragment>
                {event.orgs.map((org) => {
                  return (
                    <ListItem
                      key={org.value}
                      chevron
                      topDivider
                      bottomDivider
                      title={org.label}
                      onPress={() => navigation.navigate('Organization', {
                        org: {
                          ...orgs[org.value],
                          key: org.value
                        }
                      })}
                    />
                  );
                })}
              </Fragment>
              }
            </Fragment>
            </View>
          </Card>
        </ScrollView>
        }
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8db0d8',
  },
  scene: {
    flex: 1,
  },
  button: {
    borderWidth: 3,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
    backgroundColor: 'lightgrey',
    borderRadius: 50,
  },
  buttonBar: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
});

const mapStateToProps = (state) => {
  return {
    orgs: state.Organization.orgs,
  };
};

export default connect(mapStateToProps)(Listing);
