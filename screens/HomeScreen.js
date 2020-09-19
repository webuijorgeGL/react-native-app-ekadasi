import React, { useState, useEffect, useRef, Component } from 'react';
import { Image, Platform, StyleSheet, Text, View, Vibration } from 'react-native';
import { Card, Button, Overlay } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import { thisYear2020 } from '../components/data/data-array'
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';



Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});



function LocalNotifs() {

  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {

    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  return (null)

}


export default class HomeScreen extends Component {

  GetAll = () => {
    const month = new Date().getMonth();
    const dayOfMonth = new Date().getDate();
    const dayOfMonthPlusOne = dayOfMonth + 1


    return (
      thisYear2020.filter(data => Number(data.monthId) === month && data.dayInMonth >= dayOfMonth).map((data, index) => {

        const monthIdEqualsMonth = Number(data.monthId) === month;
        const dataDayInMonth = Number(data.dayInMonth);

        if (monthIdEqualsMonth && dataDayInMonth === dayOfMonth) {
          return (
            <View key={index} >
              <Button
                buttonStyle={{ backgroundColor: "#15c240" }}
                containerStyle={{ marginBottom: 20 }}
                titleStyle={{ color: 'white', fontSize: 30, marginBottom: 10 }}
                title="Today is Ekadasi"
              />
              <Text style={styles.displayEkadasi}>
                {data.dayOfWeek}, {data.monthName} {data.dayInMonth}: {data.ekadasiName}
              </Text>
            </View>
          )

        }


        if ((monthIdEqualsMonth && dataDayInMonth === dayOfMonthPlusOne) && index === 0) {
          Notifications.scheduleNotificationAsync({
            content: {
              title: "Hare Krsna! Friendly reminder:",
              body: `Tomorrow is Ekadasi.`,
            },
            trigger: {
              repeats: false,
              year: 2020,
              month: month + 1,
              day: dataDayInMonth - 1,
              hour: 11,
              minute: 6,
              second: 35,
            }
          });

          return (
            <View key={index} >
              <Text style={styles.displayEkadasi}>
                {data.dayOfWeek}, {data.monthName} {data.dayInMonth}: {data.ekadasiName}
              </Text>

              <Button
                buttonStyle={{ backgroundColor: "#f7ebc4" }}
                containerStyle={{ marginBottom: 20, marginTop: 20 }}
                titleStyle={{ color: '#12121c', fontSize: 20, marginBottom: 5 }}
                title="Tomorrow is Ekadasi."
              />
            </View>
          )

        }


        if ((monthIdEqualsMonth && dataDayInMonth > dayOfMonth) && index === 0) {
          return (
            <View key={index} >
              <Text style={styles.displayEkadasi}>
                {data.dayOfWeek}, {data.monthName} {data.dayInMonth}: {data.ekadasiName}
              </Text>
            </View>
          )
        }

      })

    )
  }


  OverlayNote = () => {
    const [visible, setVisible] = useState(false);

    const toggleOverlay = () => {
      setVisible(!visible);
    };

    return (

      <View>

        <Button buttonStyle={[styles.codeHighlightContainer]} title="Tap for important notice..." titleStyle={styles.codeHighlightText} onPress={toggleOverlay} />

        <Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
          <Text style={styles.overlayBoxArea}  >NOTE: All dates are for Vrndavana, India. For your local dates tap "Resources" below and tap "Pure Bhakti Calendar." Configure your local time on purebhatki.com.</Text>
        </Overlay>

      </View>
    );

  }


  render() {

    return (
      < View style={styles.container} >
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>

          <View style={styles.welcomeContainer}>
            <Image
              source={require('../assets/images/bhaktabhandav.png')}
              style={styles.welcomeImage}
            />

          </View>

          <LocalNotifs />

          <Card containerStyle={{ backgroundColor: 'rgb(248, 211, 110)' }}>
            <Card.Title>The Next Ekadasi is...</Card.Title>
            <Card.Divider />
            {<this.GetAll />}
          </Card>

        </ScrollView >

        <View style={styles.tabBarInfoContainer}>
          <this.OverlayNote />
        </View>

      </View >
    );
  }
}


async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;

    console.log('this is token:', token)

  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }
  return token;
}




HomeScreen.navigationOptions = {
  header: null,
};


const styles = StyleSheet.create({

  overlayBoxArea: {
    paddingTop: 30,
    paddingBottom: 30,
    paddingLeft: 12,
    paddingRight: 12,
    fontSize: 19,
  },

  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  displayEkadasi: {
    fontSize: 25,
  },

  todayIsEkadasiStyle: {
    fontSize: 25,
    color: 'white',
    alignSelf: 'center',
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
    marginLeft: 20,
    marginRight: 20
  },

  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginBottom: 30
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});






