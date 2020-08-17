import React, { Component } from 'react';
import { FlatList, View, Alert } from 'react-native';
import { ListItem } from 'react-native-elements';
import { connect } from 'react-redux';
import Swipeout from 'react-native-swipeout';
import * as Animatable from 'react-native-animatable';
import { Loading } from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';
import { deleteFavorite} from '../redux/ActionCreators';

class Favorites extends Component{
    static navigationOptions = {
        title: 'My Favorites'
    }

    render(){
        const { navigate } = this.props.navigation; //have access to this becuase this component is set as a Navigator in the MainComponent
        const renderFavoriteItem = ({item}) => {
            const rightButton = [
                {
                    text: 'Delete',
                    type: 'delete',
                    onPress: ()=>{ 
                        Alert.alert(
                            'Delete Favorite?',
                            'Are you sure you wish to delete the favorite campsite ' +item.name+'?',
                            [
                                {
                                    text: 'Cancel',
                                    onPress: () => console.log(item.name + ' Not Deleted'),
                                    style: 'cancel'
                                },
                                {
                                    text: 'OK',
                                    onPress:() => this.props.deleteFavorite(item.id)
                                }
                            ],
                            { cancelable: false }
                        )
                    }   
                }
            ];
            return(
                <Swipeout right={rightButton} autoClose={true}>
                    <Animatable.View animation='fadeInRightBig' duration={2000}>
                        <ListItem
                            title={item.name}
                            subtitle={item.description}
                            leftAvatar={{source: {uri: baseUrl+item.image}}}
                            onPress={() => navigate('CampsiteInfo', {campsiteId: item.id})}
                        />
                    </Animatable.View>
                </Swipeout>
            )
        }
        if(this.props.campsites.isLoading){
            return <Loading/>
        }
        if(this.props.campsites.errMess){
            return <View>{this.props.campsites.errMess}</View>
        }
        return(
            <FlatList
                data={this.props.campsites.campsites.filter(campsite => this.props.favorites.includes(campsite.id))}
                renderItem={renderFavoriteItem}
                keyExtractor={item => item.id.toString()}
            />
        )
    }

}
const mapStateToProps = state => {
    return {
        campsites: state.campsites,
        favorites: state.favorites
    }
}
const mapDispatchToProps = {
    deleteFavorite: campsiteId => (deleteFavorite(campsiteId))
    //Do you have to include the parameters here???
}
export default connect(mapStateToProps, mapDispatchToProps)(Favorites);