import React, { Component, Fragment } from 'react';
import Config from "react-native-config";
import CodePush from 'react-native-code-push';
import ProgressCircle from 'react-native-progress-circle';
import { StyleSheet, View, Dimensions, Text, Platform } from "react-native";

const { width } = Dimensions.get('window');

class CodePushScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      progress: false,
      dialogVisible: false,
    };
    this.navigateToAuthScreen = this.navigateToAuthScreen.bind(this);
    this.codePushStatusDidChange = this.codePushStatusDidChange.bind(this);
    this.codePushDownloadDidProgress = this.codePushDownloadDidProgress.bind(this);
  }

  componentWillMount() {
   let codePushKey = Platform.OS === 'ios' ? Config.CODEPUSH_KEY_ANDROID : Config.CODEPUSH_KEY_IOS;
    if (Config.LOCAL !== 'true') {
      CodePush.sync(
          {
            deploymentKey: codePushKey,
            installMode: CodePush.InstallMode.IMMEDIATE,
            updateDialog: {
              title: "App Update Available",
              mandatoryUpdateMessage: "A live update for our app is available and must be installed, click 'Continue' to automatically install the update."
            },
          },
          this.codePushStatusDidChange,
          this.codePushDownloadDidProgress,
      );
    } else {
      this.navigateToAuthScreen();
    }
  }

  navigateToAuthScreen() {
    const {navigation} = this.props;
    navigation.navigate('AuthLoading');
  }

  codePushStatusDidChange(syncStatus) {
    switch (syncStatus) {
      case CodePush.SyncStatus.CHECKING_FOR_UPDATE:
        this.setState({ syncMessage: "Checking for update." });
        break;
      case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
        this.setState({ syncMessage: "Downloading package." });
        break;
      case CodePush.SyncStatus.AWAITING_USER_ACTION:
        this.setState({ syncMessage: "Awaiting user action." });
        break;
      case CodePush.SyncStatus.INSTALLING_UPDATE:
        this.setState({ syncMessage: "Installing update." });
        break;
      case CodePush.SyncStatus.UP_TO_DATE:
        this.setState({ syncMessage: "App up to date.", progress: false }, () => {
          this.navigateToAuthScreen();
        });
        break;
      case CodePush.SyncStatus.UPDATE_IGNORED:
        this.setState({ syncMessage: "Update cancelled by user.", progress: false });
        break;
      case CodePush.SyncStatus.UPDATE_INSTALLED:
        this.setState({ syncMessage: "Update installed and will be applied on restart.", progress: false });
        break;
      case CodePush.SyncStatus.UNKNOWN_ERROR:
        this.setState({ syncMessage: "An unknown error occurred.", progress: false });
        break;
    }
  }

  codePushDownloadDidProgress(progress) {
    this.setState({ progress });
  }

  render() {
    const { progress } = this.state;
    return (
      <View style={styles.container}>
        {progress &&
        <Fragment>
          <View style={{ paddingBottom: 15 }}>
            <Text style={{ fontSize: 22 }}>
              PACalendar is updating...
            </Text>
          </View>
          <ProgressCircle
            borderWidth={8}
            color={"#3399FF"}
            shadowColor="#999"
            radius={width / 4}
            percent={(progress.receivedBytes / progress.totalBytes) * 100}
          >
            <Text style={{ fontSize: 18 }}>
              {`${Math.ceil((progress.receivedBytes / progress.totalBytes) * 100)}%`}
            </Text>
          </ProgressCircle>
        </Fragment>
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
});

export default CodePushScreen;
