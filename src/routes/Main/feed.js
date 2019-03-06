import { connect } from "react-redux";
import { PropTypes } from 'prop-types';
import React, { Component } from 'react';
import { Card } from "react-native-elements";
import { View, Text, Dimensions, FlatList, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { colors } from "../../config/styles";
import { concert } from "../../../_assets_/index";

const { width, height } = Dimensions.get('window');

class Feed extends Component {
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
      activeElement: '',
    };
    this.getSortedArray = this.getSortedArray.bind(this);
  }

  _keyExtractor = (item, index) => {
    return item.eventKey;
  };

  getSortedArray(events) {
    let sortedEvents = [];
    Object.keys(events).sort((a,b) => (a-b)).forEach(key => {
      events[key].forEach((event) => {
        sortedEvents.push(event);
      });
    });
    return sortedEvents;
  }

  render() {
    let sortedArray = this.getSortedArray(this.props.events);
    if (sortedArray.length > 0) {
      return (
        <ImageBackground source={concert} style={styles.container} imageStyle={{opacity: .1}} blurRadius={2}>
        <View>
          <FlatList
            data={sortedArray}
            keyExtractor={this._keyExtractor}
            renderItem={({item}) => {
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
                <TouchableOpacity onPress={() => this.props.navigation.navigate('Listing', {event: item})}>
                  <Card containerStyle={{backgroundColor: 'white'}}>
                    <ImageBackground
                      source={{uri: item.url !== '' ? item.url : 'https://upload.wikimedia.org/wikipedia/commons/5/59/Empty.png'}}
                      style={{flex: 1}} resizeMode="contain" key={item.eventKey}
                      imageStyle={{opacity: .075}}
                    >
                      <View style={{flex: 1}}>
                        <View style={{flexDirection: 'row'}}>
                          <View style={{flex: 1}}>
                            <Text style={{fontSize: 20, fontWeight: 'bold'}}>{item.title}</Text>
                            <Text style={{paddingBottom: 10, fontSize: 16, fontWeight: 'bold'}}>{performedString && performedString}</Text>
                          </View>
                        </View>
                        {Feed.renderWhen(item.startDateTime, item.endDateTime)}
                        <View style={{flexDirection: 'row'}}>
                          <View style={{flexDirection: 'column', flex: 1}}>
                            <Text>Description:</Text>
                          </View>
                          <View style={{flexDirection: 'column', flex: 3}}>
                            <Text style={{marginBottom: 10}} numberOfLines={3}>{item.description}</Text>
                          </View>
                        </View>
                      </View>
                    </ImageBackground>
                  </Card>
                </TouchableOpacity>
              )
            }

            }
          />
        </View>
        </ImageBackground>
      )
    } else {
      return (
        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{fontSize: 25, color: 'darkgrey'}}>No Upcoming Events</Text>
        </View>
      )
    }

  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  buttonActive: {
    borderWidth:3,
    borderColor:'#fff',
    alignItems:'center',
    justifyContent:'center',
    width:50,
    height:50,
    backgroundColor: colors.blue,
    borderRadius:50,
    marginTop: 30,
  },
  button: {
    borderWidth:3,
    borderColor:'#fff',
    alignItems:'center',
    justifyContent:'center',
    width:50,
    height:50,
    backgroundColor: 'lightgrey',
    borderRadius:50,
    marginTop: 30,
  },
  buttonBar: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
  },
});

const mapStateToProps = (state) => {
  return {
    orgs: state.Organization.orgs,
    events: state.Events.eventsByEpoch,
  }
};

export default connect(mapStateToProps)(Feed)
