import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Icon from "react-native-vector-icons/FontAwesome";
import { Avatar, Button, Card } from "react-native-elements";
import ImageViewer from "react-native-image-zoom-viewer/built/image-viewer.component";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Linking,
  Modal,
  Dimensions,
  ImageBackground, FlatList
} from 'react-native';
import { colors, fontSizes } from "../config/styles";
import { connect } from "react-redux";

let Spinner = require('react-native-spinkit');
const { height } = Dimensions.get('window');

class Organization extends Component {
  static renderWhen(startDateTime, endDateTime) {
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

  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
      viewImageModal: false,
      buttonColor: colors.blue,
    };
    this.expandDescription = this.expandDescription.bind(this);
    this.renderImageOverlay = this.renderImageOverlay.bind(this);
  }

  getStringAcronym(string) {
    return string.match(/[A-Z]/g).join('').substring(0,2);
  }

  expandDescription() {
    this.setState({ expanded: !this.state.expanded }, () => {
      if (this.state.expanded) {
        for (let i = 0; i < 90; i++) {
          this.setState({ rotation: i });
        }
      } else {
        for (let i = 90; i > 0; i--) {
          this.setState({ rotation: i });
        }
      }
    });
  }

  renderImageOverlay(org) {
    return (
      <View>
        <Modal visible={this.state.viewImageModal} onRequestClose={() => this.setState({ viewImageModal: false })}>
          <ImageViewer
            imageUrls={[{ url: org.imageURL }]}
            renderIndicator={() => <View/>}
            renderHeader={() => (
              <TouchableOpacity
                style={{ paddingTop: 40, marginRight: 5, alignItems: 'flex-end' }}
                onPress={() => {
                  this.setState({ viewImageModal: false });
                }}>
                <Icon style={{ padding: 5 }} color='white' size={20} name='close'/>
              </TouchableOpacity>
            )}
            loadingRender={() => (
              <View style={{ height, alignSelf: 'center', justifyContent: 'center' }}>
                <Spinner size={80} type={'FadingCircleAlt'} color={'#ffffff'}/>
              </View>
            )}
          />
        </Modal>
        <Avatar
          size="large"
          title={this.getStringAcronym(org.name)}
          source={!!(org.imageURL && org.imageURL !== '') ? { uri: org.imageURL } : {}}
          onPress={() => this.setState({ viewImageModal: true })}
          activeOpacity={0.7}
        />
      </View>
    );
  }

  renderOrganizationName(org) {
    return (
      <View style={{ flexDirection: 'row' }}>
        <Text style={{ fontSize: 22, paddingBottom: 10 }}>{org.name}</Text>
      </View>
    )
  }

  renderOrganizationButton(org, buttonColor) {
    return (
      <View style={{ flexDirection: 'row' }}>
        <Button
          title='Organization Website'
          titleStyle={{ fontWeight: "400", fontSize: 14, paddingHorizontal: 15 }}
          icon={<Icon size={15} name={'globe'} color={'white'} style={{ paddingLeft: 10 }}/>}
          buttonStyle={{ backgroundColor: `${buttonColor}`, }}
          onPress={() => Linking.openURL(org.website)}
        />
      </View>
    )
  }

  _keyExtractor = (item, index) => {
    return item.eventKey;
  };

  getSortedArray(events, orgKey) {
    let sortedEvents = [];
    Object.keys(events).sort((a, b) => (a - b)).forEach(key => {
      events[key].forEach((event) => {
        if (event.orgs) {
          event.orgs.forEach((org) => {
            if (orgKey === org.value) {
              sortedEvents.push(event);
            }
          });
        }
      });
    });
    return sortedEvents;
  }

  render() {
    const { org } = this.props.navigation.state.params;
    let sortedArray = this.getSortedArray(this.props.events, org.key);
    const { buttonColor } = this.state;
    return (
      <View style={styles.container}>
        <ScrollView>
          {org &&
          <Card containerStyle={{ padding: 0 }}>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              {this.renderImageOverlay(org)}
              <View style={{ flex: 1, paddingLeft: 5 }}>
                {org.name && this.renderOrganizationName(org)}
                {!!(org.website && org.website !== '') && this.renderOrganizationButton(org, buttonColor)}
              </View>
            </View>
          </Card>
          }
          {sortedArray.length > 0 ?
            <FlatList
              data={sortedArray}
              keyExtractor={this._keyExtractor}
              renderItem={({ item }) => {
                let performedString = '';
                if (item.orgs) {
                  performedString = item.orgs.reduce((performingString, org, index) => {
                    if (item.orgs.length === index + 1) {
                      performingString = performingString.concat(`${org.label}`);
                    } else {
                      performingString = performingString.concat(`${org.label}, `);
                    }
                    return performingString;
                  }, "");
                }
                return (
                  <TouchableOpacity onPress={() => this.props.navigation.navigate('Listing', { event: item })}>
                    <Card containerStyle={{ backgroundColor: 'white' }}>
                      <ImageBackground
                        source={{ uri: item.url !== '' ? item.url : 'https://upload.wikimedia.org/wikipedia/commons/5/59/Empty.png' }}
                        style={{ flex: 1 }} resizeMode="contain" key={item.eventKey}
                        imageStyle={{ opacity: .075 }}
                      >
                        <View style={{ flex: 1 }}>
                          <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 1 }}>
                              <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{item.title}</Text>
                              <Text style={{
                                paddingBottom: 10,
                                fontSize: 16,
                                fontWeight: 'bold'
                              }}>{performedString && performedString}</Text>
                            </View>
                          </View>
                          {Organization.renderWhen(item.startDateTime, item.endDateTime)}
                          <View style={{ flexDirection: 'row' }}>
                            <View style={{ flexDirection: 'column', flex: 1 }}>
                              <Text>Description:</Text>
                            </View>
                            <View style={{ flexDirection: 'column', flex: 3 }}>
                              <Text style={{ marginBottom: 10 }} numberOfLines={3}>{item.description}</Text>
                            </View>
                          </View>
                        </View>
                      </ImageBackground>
                    </Card>
                  </TouchableOpacity>
                )
              }}
            /> :
            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingTop: 10}}>
              <Text style={{fontSize: 25, color: 'darkgrey'}}>No Upcoming Events</Text>
            </View>
          }
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    events: state.Events.eventsByEpoch,
  }
};

Organization.defaultProps = {
  navigation: {
    state: {
      params: {
        org: {
          name: '',
          genres: [],
          website: '',
          imageURL: '',
        }
      }
    }
  }
};

Organization.propTypes = {
  navigation: PropTypes.shape({
    state: PropTypes.shape({
      params: PropTypes.shape({
        org: PropTypes.shape({
          name: PropTypes.string,
          genres: PropTypes.array,
          website: PropTypes.string,
          imageURL: PropTypes.string,
        })
      })
    })
  }),
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  logout: {
    backgroundColor: colors.blue,
    borderRadius: 25,
    margin: 5,
    padding: 10,
  },
  logoutText: {
    color: colors.white,
    fontSize: fontSizes.secondary,
    textAlign: 'center',
  },
  buttonActive: {
    borderWidth: 3,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
    backgroundColor: colors.blue,
    borderRadius: 50,
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
    flexDirection: 'row',
  },
  orgBar: {
    borderWidth: 1,
    borderColor: '#e1e8ee',
    margin: 15,
    marginBottom: 0,
    padding: 0,
    marginTop: 0,
    shadowColor: 'rgba(0,0,0,.2)',
    shadowOffset: { height: 0, width: 0 },
    shadowOpacity: 1,
    shadowRadius: 1,
    backgroundColor: colors.white,
  },
  title: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '300',
  },
});

export default connect(mapStateToProps)(Organization);
