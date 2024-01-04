import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, NativeModules } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import { createStackNavigator } from '@react-navigation/native-stack';
import SignInPage from './screens/signin_page';
import SignUpPage from './screens/signup_page';
import JadwalPage from './screens/jadwal_page';
import CariPage from './screens/cari_page';
import ProfilePage from './screens/profile_page';
import BuatJadwalPage from './screens/buatjadwal_page';
import UbahPasswordPage from './screens/ubahpassword_page';
import PartyChatPage from './screens/partychat_page';
import Ionicons from 'react-native-vector-icons/Ionicons';
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
export default class App extends Component {

  state = {
    islogin: false
  }
  CustomDrawerContent(props) {
    return (
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
        <DrawerItem label={() => <Text>Logout</Text>}
          onPress={() => {
            AsyncStorage.removeItem('email');
            AsyncStorage.removeItem('photoUrl');
            AsyncStorage.removeItem('fullName');
            AsyncStorage.removeItem('userId');
            alert('logged out');
            NativeModules.DevSettings.reload();
          }}
        />
      </DrawerContentScrollView>
    );
  }
  doLogout = async () => {
    try {
      await AsyncStorage.removeItem('email');
      alert('logged out');
      NativeModules.DevSettings.reload();
    } catch (e) {
    }
  }
  cekLogin = async () => {
    try {
      const value = await AsyncStorage.getItem('email');
      if (value !== null) {
        global.activeuser = value;
        return value;
      }
    } catch (e) {
      console.log(value);
    }
  }
  constructor(props) {
    super(props);
    this.cekLogin().then((item) => {
      if (item != null) {
        this.setState(
          this.state = {
            islogin: true
          })
      }
    })
  }

  render() {
    if (!this.state.islogin) {
      return (
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="SignIn" component={SignInPage} />
            <Stack.Screen name="SignUp" component={SignUpPage} />
            <Stack.Screen name="Jadwal" component={JadwalPage} />
            <Stack.Screen name="BuatJadwal" component={BuatJadwalPage} options={{ title: 'Buat Jadwal' }} />

          </Stack.Navigator>
        </NavigationContainer>);
    } else {
      return (
        <NavigationContainer>
          <Drawer.Navigator initialRouteName="SignIn" drawerContent={props => <this.CustomDrawerContent {...props} />}>
            <Drawer.Screen name="Jadwal" component={Nav1}
              options={{ headerShown: true }} />
            <Drawer.Screen name="Cari" component={CariPage} />
            <Drawer.Screen name="Profile" component={ProfilePage} />
          </Drawer.Navigator>
        </NavigationContainer>


      );
    }
  }
}

function Nav1() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          var iconName;
          if (route.name == 'Jadwal') {
            iconName = 'calendar';
            var iconColor = (focused) ? 'blue' : 'gray';
          }
          if (route.name === 'Cari') {
            iconName = focused ? 'search' : 'search-outline';
          }
          if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }
          return <Ionicons name={iconName} size={30} color={iconColor} />;
        },
        tabBarActiveTintColor: 'blue',
        tabBarInactiveTintColor: 'gray',
      })}>
      <Tab.Screen name="Jadwal" component={Nav2}
        options={{ headerShown: false }} />
      <Tab.Screen name="Cari" component={CariPage} options={{ headerShown: false }}/>
      <Tab.Screen name="Profile" component={Nav3} options={{ headerShown: false }}  />
    </Tab.Navigator>
  )
}
function Nav2() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Jadwal" component={JadwalPage} options={{ headerShown: false }} />
      <Stack.Screen name="BuatJadwal" component={BuatJadwalPage} options={{ title: 'Buat Jadwal' }} />
      <Stack.Screen name="PartyChat" component={PartyChatPage} options={{ title: 'Party Chat' }} />
    </Stack.Navigator>
  );
}
function Nav3() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Profile" component={ProfilePage} options={{ headerShown: false }} />
      <Stack.Screen name="UbahPassword" component={UbahPasswordPage} options={{ title: 'Ubah Password' }} />
    </Stack.Navigator>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0066ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
