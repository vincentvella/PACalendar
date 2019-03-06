import { connect } from "react-redux";
import { PropTypes } from 'prop-types';
import React, { Component } from 'react';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { Card, Divider, List, ListItem } from "react-native-elements";
import { View, Text, Dimensions, FlatList, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');
const vocal = require('../../../../_assets_/concert.jpg');
const dance = require('../../../../_assets_/dancer.jpg');
const theatre = require('../../../../_assets_/actor.jpg');
const instrumental = require('../../../../_assets_/band.jpg');
const writing = require('../../../../_assets_/writing.jpg');
const comedy = require('../../../../_assets_/comedy.jpg');
const visualArts = require('../../../../_assets_/visualArts.jpg');


class Category extends Component {
  //<editor-fold desc="Static Methods">
  static shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  static renderItem({ item, index }) {
    return (
      <Card image={item.image}>
        <Text>{item.title}</Text>
      </Card>
    );
  }
  //</editor-fold>

  constructor(props) {
    super(props);
    const entries = [
      { title: 'Vocal',         image: vocal,         genre: 'Dance'              },
      { title: 'Dance',         image: dance,         genre: 'A Capella/Vocal'    },
      { title: 'Theatre',       image: theatre,       genre: 'Theatre'            },
      { title: 'Instrumental',  image: instrumental,  genre: 'Music/Instrumental' },
      { title: 'Writing',       image: writing,       genre: 'Writing'            },
      { title: 'Visual Arts',   image: visualArts,    genre: 'Visual Arts'        },
      { title: 'Comedy',        image: comedy,        genre: 'Comedy'             },
    ];
    this.state = {
      activeSlide: 0,
      entries: Category.shuffleArray(entries),
    };
  }

  keyExtractor = (item, index) => {
    return `${item.eventKey}${index}`;
  };

  get pagination() {
    const { entries, activeSlide } = this.state;
    return (
      <Pagination
        dotsLength={entries.length}
        activeDotIndex={activeSlide}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
        containerStyle={{ paddingVertical: 10 }}
      />
    );
  }

  render() {
    const { events } = this.props;
    const { entries, activeSlide } = this.state;
    let reducedEvents = [];
    if (events && Object.keys(events)) {
      reducedEvents = Object.keys(events).reduce((resultingEvents, eventKey) => {
        if (events && events[eventKey] && events[eventKey].category && events[eventKey].category.length) {
          events[eventKey].category.forEach((cat) => {
            if (cat && cat.label && cat.label === entries[activeSlide].genre) {
              resultingEvents.push({ ...events[eventKey], eventKey });
            }
          });
        }
        return resultingEvents;
      }, []);
    }
    return (
      <View style={{flex: 1}}>
        <View>
          <Carousel
            data={entries}
            itemWidth={width / 2}
            sliderWidth={width}
            renderItem={Category.renderItem}
            onSnapToItem={(index) => this.setState({ activeSlide: index })}
          />
        </View>
        {this.pagination}
        <Divider/>
        {(reducedEvents && reducedEvents.length) ?
          <FlatList
            data={reducedEvents}
            keyExtractor={this.keyExtractor}
            renderItem={({ item }) =>
              <View key={item.eventKey}>
                <ListItem
                  topDivider
                  bottomDivider
                  chevron
                  title={item.title}
                  titleStyle={{ fontSize: 14 }}
                  style={{ padding: 0 }}
                  onPress={() => this.props.navigation.navigate('Listing', { event: { ...item, key: item.eventKey } })}
                />
              </View>
            }
          />
          : <View style={styles.emptyEventsContainer}><Text>No events for this genre</Text></View>
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  emptyEventsContainer: {
    paddingTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  }
});

const mapStateToProps = (state) => {
  return {
    events: state.Events.events,
  };
};

export default connect(mapStateToProps)(Category);
