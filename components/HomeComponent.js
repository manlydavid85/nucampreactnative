import React, {Component} from 'react';
import {View, Text, ScrollView} from 'react-native';
import {Card} from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import Loading from './LoadingComponent';

function RenderItemComponent(props){
    const {item} = props;
    if(props.isLoading){
        return(
            <Loading/>
        )
    }
    if(props.errMes){
        return(
            <View>
                <Text>{props.errMes}</Text>
            </View>
        )
    }
    if(item){
        return(
            <Card
                featuredTitle={item.name}
                image={{uri: baseUrl+item.image}}>
                <Text style={{margin: 10}}>
                    {item.description}
                </Text>
            </Card>
        )
    }return <View/>
}

class Home extends Component{

    static navigationOptions  = {
        title: 'Home'
    }

    render(){
        return(
            <ScrollView>
                <RenderItemComponent 
                    item={this.props.campsites.campsites.filter(campsite => campsite.featured)[0]}
                    isLoading={this.props.campsites.isLoading}
                    errMess={this.props.campsites.errMess}/>
                <RenderItemComponent 
                    item={this.props.promotions.promotions.filter(promotion => promotion.featured)[0]}
                    isLoading={this.props.promotions.isLoading}
                    errMess={this.props.promotions.errMess}/>
                <RenderItemComponent 
                    item={ this.props.partners.partners.filter(partner => partner.featured)[0]}
                    isLoading={ this.props.partners.isLoading}
                    errMess={this.props.partners.errMess}/>
            </ScrollView>
        );
    }
}
const mapStateToProps = (state) => ({
    campsites: state.campsites,
    promotions: state.promotions,
    partners: state.partners
});
export default connect(mapStateToProps)(Home);


