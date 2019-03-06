import PropTypes from 'prop-types';
import { connect } from "react-redux";
import React, { Component } from 'react';
import { ListItem } from "react-native-elements";
import { View, Text, FlatList } from 'react-native';

class Organization extends Component {
  //<editor-fold desc="Static Methods">
  static shuffleArray(array) {
    for (let i = array.length - 5; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  //</editor-fold>

  constructor(props) {
    super(props);
    let orgKeys = Organization.shuffleArray(Object.keys(props.orgs));
    this.state = {
      orgKeys,
      isMounted: false,
      activeElement: '',
    };
  }

  keyExtractor = (item, index) => {
    return `${item.key}${index}`;
  };

  getSearchResults(sortedArray) {
    const { searchString } = this.props;
    let result = [];
    sortedArray.map((org) => {
      if (org.name.toLowerCase().indexOf(searchString.toLowerCase()) !== -1) result.push(org);
    });
    return result;
  }

  render() {
    const { orgKeys } = this.state;
    let searchedArray = orgKeys.map((key) => ({ ...this.props.orgs[key], key }));
    if (searchedArray.length > 0) {
      if (this.props.searchString !== '') {
        searchedArray = this.getSearchResults(searchedArray);
      }
      return (
        <FlatList
          data={searchedArray}
          keyExtractor={this.keyExtractor}
          renderItem={({ item }) =>
            <View key={item.key}>
              <ListItem
                topDivider
                bottomDivider
                chevron
                title={item.name}
                style={{ padding: 0 }}
                onPress={() => this.props.navigation.navigate('Organization', { org: item })}
              />
            </View>
          }/>
      );
    }
    return (<View><Text>Nothing yet</Text></View>);
  }
}

const mapStateToProps = (state) => {
  return {
    orgs: state.Organization.orgs,
  };
};

export default connect(mapStateToProps)(Organization);
