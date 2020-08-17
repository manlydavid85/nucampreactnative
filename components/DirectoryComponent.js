import React, { Component } from 'react';
import { FlatList, View } from 'react-native';
import { Tile } from 'react-native-elements';
import { connect } from 'react-redux';
import * as Animatable from 'react-native-animatable';
import { baseUrl } from '../shared/baseUrl';
import Loading from './LoadingComponent';

class Directory extends Component{

    static navigationOptions = {
        title: 'Directory'
    }

    render(){    
        const { navigate } = this.props.navigation;
        const renderDirectoryItem = ({item}) =>{
        return(
            <Animatable.View animation='fadeInRightBig' duration={2000}>
                <Tile
                title={item.name}
                caption={item.description}
                featured
                onPress={() => navigate('CampsiteInfo', { campsiteId: item.id})}
                imageSrc={{uri: baseUrl+item.image}} 
                />
            </Animatable.View>
        )
        }
        if(this.props.campsites.isLoading){
            return <Loading/>;
        }
        if(this.props.campsites.errMess){
            return (
                <View>
                    <Text>{this.props.campsites.errMess}</Text>
                </View>
            );
        }
        return(
            <FlatList 
                data={this.props.campsites.campsites} 
                renderItem={renderDirectoryItem}
                keyExtractor={item => item.id.toString()} //extractor prop?
            />
        )
    }
}
const mapStateToProps = (state) => ({
    campsites: state.campsites
});
export default connect(mapStateToProps)(Directory);