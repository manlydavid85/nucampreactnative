import React, {Component} from 'react';
import Directory from './DirectoryComponent';
import Home from './HomeComponent';
import CampsiteInfo from './CampsiteInfoComponent';
import About from './AboutComponent';
import Contact from './ContactComponent';
import {View, Platform} from 'react-native';
import { createStackNavigator, createDrawerNavigator } from 'react-navigation';

const AboutNavigator = createStackNavigator(
    {
        About: { screen: About}
    },
    {
        navigationOptions: {
            headerStyle: {
                backgroundColor: '#5637DD'
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                color: '#fff'
            }
        }        
    }
);

const ContactNavigator = createStackNavigator(
    {
        Contact: { screen: Contact}
    },
    {
        navigationOptions: {
            headerStyle: {
                backgroundColor: '#5637DD'
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                color: '#fff'
            }
        }
    }
);

const DirectoryNavigator = createStackNavigator(
    {
        Directory: { screen: Directory},
        CampsiteInfo: { screen: CampsiteInfo}
    },
    {
        initialRouteName: 'Directory',
        navigationOptions: {
            headerStyle: {
                backgroundColor: '#5637DD'
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                color: '#fff'
            }
        }
    }
);

const HomeNavigator = createStackNavigator(
    {
        Home: { screen: Home}
    },
    {
        navigationOptions: {
            headerStyle: {
                backgroundColor: '#5637DD'
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                color: '#fff'
            }
        }
    }
);

const MainNavigator = createDrawerNavigator(
    {
        Home: { screen: HomeNavigator},
        Directory: { screen: DirectoryNavigator},
        About: { screen: AboutNavigator},
        Contact: { screen: ContactNavigator}
    },
    {
        drawerBackgroundColor: '#CEC8FF'
    }
);


class Main extends Component{

    render(){
        return(
            <View style={{
                flex: 1, 
                paddingTop: Platform.OS === 'ios' ? 0 : Expo.Constants.statusBarHeight 
            }}>
                <MainNavigator/> 
            </View>
        )
    }
}
export default Main;

