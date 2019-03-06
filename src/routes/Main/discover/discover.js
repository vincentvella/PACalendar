import { Tab, Tabs } from "native-base";
import React, { Component } from 'react';
import { View, Platform } from 'react-native';
import { SearchBar } from "react-native-elements";
import Category from "./category";
import Organization from "./organization";
import { colors } from "../../../config/styles";


export default class Discover extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchString: '',
    };
  }

  render() {
    const { navigation } = this.props;
    const { searchString } = this.state;
    const tabProps = { navigation, searchString };
    return (
      <View style={{ backgroundColor: colors.background, flexGrow: 1 }}>
        <SearchBar
          placeholder="Search"
          platform={Platform.OS}
          onChangeText={(searchString) => this.setState({ searchString })}
        />
        <Tabs tabBarTextStyle={{ fontSize: 10 }} locked>
          <Tab heading="Organization">
            <Organization{...tabProps}/>
          </Tab>
          <Tab heading="Category">
            <Category{...tabProps}/>
          </Tab>
        </Tabs>
      </View>
    );
  }
}
