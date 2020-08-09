import React, { Component } from 'react';
import { FlatList } from 'react-native';
import { ListItem } from 'react-native-elements';
import { CAMPSITES } from '../shared/campsites';

class Directory extends Component{
    state = { 
        campsites: CAMPSITES
    }

    static navigationOptions = {
        title: 'Directory'
    }

    render(){    
        const { navigate } = this.props.navigation;
        const renderDirectoryItem = ({item}) =>{
        return(
            <ListItem
               title={item.name}
               subtitle={item.description}
               onPress={() => navigate('CampsiteInfo', { campsiteId: item.id})}
               leftAvatar={{source: require('./images/react-lake.jpg')}} 
            />
        )
        }
        return(
            <FlatList 
                data={this.state.campsites} 
                renderItem={renderDirectoryItem}
                keyExtractor={item => item.id.toString()} //extractor prop?
            />
        )
    }
}
export default Directory;