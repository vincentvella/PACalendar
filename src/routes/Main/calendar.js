import moment from "moment";
import { connect } from "react-redux";
import { PropTypes } from 'prop-types';
import React, { Component } from 'react';
import { Calendar } from 'react-native-calendars';
import Icon from "react-native-vector-icons/FontAwesome";
import { List, ListItem, Overlay } from "react-native-elements";
import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import { colors, fontSizes } from "../../config/styles";

const {height, width} = Dimensions.get('window');

const vocal =         { key: 'vocal',          color: 'red',     selectedColor: 'orange', displayName: 'A Cappella/Vocal'   };
const dance =         { key: 'dance',          color: 'green',   selectedColor: 'orange', displayName: 'Dance'              };
const theatre =       { key: 'theatre',        color: 'blue',    selectedColor: 'orange', displayName: 'Theatre'            };
const writing =       { key: 'writing',        color: 'orange',  selectedColor: 'orange', displayName: 'Writing'            };
const comedy =        { key: 'comedy',         color: 'gold',    selectedColor: 'orange', displayName: 'Comedy'             };
const visualArts =    { key: 'visualArts',     color: 'purple',  selectedColor: 'orange', displayName: 'Visual Arts'        };
const instrumental =  { key: 'instrumental',   color: 'grey',    selectedColor: 'orange', displayName: 'Music/Instrumental' };

class CalendarComponent extends Component {

  static addBubble(category) {
    switch (category) {
      case 'A Cappella/Vocal':
        return vocal;
      case 'Dance':
        return dance;
      case 'Theatre':
        return theatre;
      case 'Music/Instrumental':
        return instrumental;
      case 'Writing':
        return writing;
      case 'Comedy':
        return comedy;
      case 'Visual Arts':
        return visualArts;
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      selected: moment(new Date()),
    };

    this.getDates = this.getDates.bind(this);
    this.onDateChange = this.onDateChange.bind(this);
    this.getEventCards = this.getEventCards.bind(this);
    this.getMarkedDates = this.getMarkedDates.bind(this);
  }

  onDateChange(date) {
    this.setState({ selected: moment(date.dateString) });
  }

  getMarkedDates() {
    return ({
      [this.state.selected.format('YYYY-MM-DD')]: { selected: true, disableTouchEvent: true, selectedColor: 'orange' },
      ...this.getDates(),
    });
  }

  getEventsForDay(dateString) {
    if (this.props.events[dateString]) {
      return this.props.events[dateString];
    }
    return [];
  }

  getDates() {
    let dateDots = {};
    Object.keys(this.props.events).map((key) => {
      this.props.events[key].map((event) => {
        if (event.category && event.category.length && event.category.length > 0) {
          event.category.map((genre) => {
            let bubble = CalendarComponent.addBubble(genre.value);
            if (dateDots[key]) {
              if (dateDots[key].dots.filter(dot => dot === bubble).length === 0) {
                dateDots[key].dots.push(bubble);
              }
            } else {
              dateDots = {
                [key]: { dots: [bubble], selected: this.state.selected.format('YYYY-MM-DD') === key },
                ...dateDots,
              };
            }
          });
        }
      });
    });
    return dateDots;
  }

  getEventCards(events) {
    if (events && events.length > 0) {
      return (
        events.map((event, i) => {
          let performedString = '';
          let optionalProps = {};
          if (event && event.orgs) {
            performedString = event.orgs.reduce((performingString, org, index) => {
              if (event.orgs.length === index + 1) {
                performingString = performingString.concat(`${org.label}`);
              } else {
                performingString = performingString.concat(`${org.label}, `);
              }
              return performingString;
            }, "");
            optionalProps = {
              ...optionalProps,
              subtitle: <Text style={{ fontSize: 12 }}>{`Performed by: ${performedString}`}</Text>,
            }
          }
          return (
            <ListItem
              {...optionalProps}
              key={i}
              chevron
              topDivider
              bottomDivider
              title={event.title}
              onPress={() => this.props.navigation.navigate('Listing', { event })}
            />
          );
        }));
    } else {
      return (
        <View style={styles.emptyEvent}>
          <Text style={styles.emptySentence}>There are no events for the selected date</Text>
        </View>
      );
    }
  }

  render() {
    const genres = [vocal, dance, theatre, writing, comedy, visualArts, instrumental];
    this.events = this.getEventsForDay(this.state.selected.format('YYYY-MM-DD'));
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.container} scrollEnabled={false}>
          <Calendar
            onDayPress={this.onDateChange}
            markingType={'multi-dot'}
            markedDates={this.getMarkedDates()}
            displayLoadingIndicator
            theme={{
              backgroundColor: colors.white,
              calendarBackground: colors.white,
              selectedDayBackgroundColor: 'orange',
              selectedDayTextColor: colors.white,
              todayTextColor: colors.blue,
              selectedDotColor: colors.white,
              arrowColor: 'orange',
              monthTextColor: colors.blue,
              textSectionTitleColor: '#b6c1cd',
              textDisabledColor: '#d9e1e8',
              dayTextColor: '#2d4150',
            }}
            minDate={'2018-01-01'}
          />
          <View>
            <TouchableOpacity
              style={{ paddingLeft: 5, flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-end' }}
              onPress={() => {
                this.setState({ showKey: true });
              }}>
              <Text>Calendar Key</Text>
              <Icon
                style={{ padding: 5 }}
                color='dimgrey'
                size={20}
                name='question-circle-o'
              />
            </TouchableOpacity>
          </View>
          <View>
            <View>
              <Text style={styles.eventTitle}>Events</Text>
            </View>
            <Text style={styles.dateTitle}>
              {this.state.selected.format('MMMM Do YYYY')}
            </Text>
          </View>
          <ScrollView contentInset={{ top: 0 }} overScrollMode={'never'} automaticallyAdjustContentInsets={false}>
            {this.getEventCards(this.getEventsForDay(this.state.selected.format('YYYY-MM-DD')))}
          </ScrollView>
          {this.state.showKey &&
          <Overlay isVisible={this.state.showKey} width={width * .6} height="auto">
            <View style={{ flexDirection: 'column' }}>
              <View style={{ position: 'absolute', right: 0, top: 0, zIndex: 50 }}>
                <TouchableOpacity onPress={() => this.setState({ showKey: false })}>
                  <Icon style={{ padding: 5 }} color='dimgrey' size={20} name='close' />
                </TouchableOpacity>
              </View>
              <View style={{ justifyContent: 'center', paddingTop: 3, zIndex: 10 }}>
                {genres.map((genre) => (
                  <View style={{ flexDirection: 'row', alignItems: 'center' }} key={genre.key}>
                    <Icon style={{ padding: 5 }} color={genre.color} size={20} name='circle'/>
                    <Text>{` - ${genre.displayName}`}</Text>
                  </View>
                ))}
              </View>
            </View>
          </Overlay>
          }
        </ScrollView>
      </View>
    );
  }
}

CalendarComponent.propTypes = {
  toggleSettings: PropTypes.func,
};

CalendarComponent.defaultProps = {
  toggleSettings: () => {},
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  eventTitle: {
    textAlign: 'center',
    fontSize: fontSizes.primary,
  },
  dateTitle: {
    textAlign: 'center',
    fontSize: fontSizes.secondary,
    paddingBottom: 10,
  },
  emptyEvent: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptySentence: {
    height: 80,
    color: colors.secondary,
  }
});

const mapStateToProps = (state) => {
  return {
    orgs: state.Organization.orgs,
    events: state.Events.eventsByDate,
  }
};

export default connect(mapStateToProps)(CalendarComponent)
