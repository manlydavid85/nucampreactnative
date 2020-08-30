import React, { Component } from 'react';
import { Text, View, ScrollView, FlatList, Modal,
    Button, StyleSheet, Alert, PanResponder, Share } from 'react-native';
import { Card, Icon, Rating, Input } from 'react-native-elements';
import { connect } from 'react-redux';
import * as Animatable from 'react-native-animatable';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite, postComment } from '../redux/ActionCreators';

function RenderCampsite(props){
    const {campsite} = props;

    const view = React.createRef();

    const recognizeDrag = ({dx}) => (dx < -200) ? true : false;

    const recognizeComment = ({dx}) => (dx > 200) ? true : false;

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
            view.current.rubberBand(1000)
            .then(endState => console.log(endState.finshed ? 'finished' : 'canceled'));
        },  
        onPanResponderEnd: (e, gestureState) => {
            console.log('pan responder end',gestureState);
            if(recognizeDrag(gestureState)){
                Alert.alert(
                    'Add Favorite',
                    'Are you sure you wish to add' + campsite.name + ' to favorites?',
                    [
                        {
                            text: 'cancel',
                            style: 'cancel',
                            onPress: ()=> console.log('Cancel Pressed')
                        },
                        {
                            text: 'OK',
                            onPress: () => props.favorite ? console.log('Already set as favorite') : props.markFavorite()
                        }
                    ],
                    { cancelable: false }
                )
            } else if(recognizeComment(gestureState)){
                props.onShowModal();
            }
            return true;
        }    
    }) 

    const shareCampsite = (title, message, url) => {
        Share.share({
            title,
            message:`${title}: ${message} ${url}`,
            url
        },{
            dialogTitle:'Share ' + title
        });
    };

    if(campsite){
        return(
            <Animatable.View 
                animation='fadeInDown' 
                duration={2000} 
                delay={1000}
                ref={view}
                {...panResponder.panHandlers}>
                <Card 
                    featuredTitle={campsite.name}
                    image={{uri: baseUrl+campsite.image}}>
                    <Text style={{margin:10}}>
                        {campsite.description}
                    </Text>
                    <View style={styles.cardRow}>
                        <Icon
                            name={props.favorite ? 'heart' : 'heart-o'}
                            type='font-awesome'
                            color='#f50'
                            raised
                            reverse
                            onPress={() => props.favorite ? console.log('Already set as fav...') : props.markFavorite()}
                        />
                        <Icon
                            name={'pencil'}
                            type='font-awesome'
                            color='#5637DD'
                            raised
                            reverse
                            style={styles.cardItem}
                            onPress={() => props.onShowModal()}
                        />
                        <Icon
                            name={'share'}
                            type='font-awesome'
                            color='#5637DD'
                            raised
                            reverse
                            style={styles.cardItem}
                            onPress={() => shareCampsite(campsite.name, campsite.description, baseUrl+campsite.image)}
                        />
                    </View>
                </Card>
            </Animatable.View>
        )
    }
    return <View/>
}

const RenderComments = ({comments}) => {

    renderCommentItem = ({item}) => {
        return(
            <View style={{margin: 10}}>
                <Text style={{fontSize: 14}}>{item.text}</Text>
                <Rating startingValue={item.rating} readonly imageSize={10} style={{alignItems:'flex-start',paddingVertical:'5%'}} />
                <Text style={{fontSize: 12}}>{`-- ${item.author}, ${item.date}`}</Text>
            </View>
        )
    } 

    return(
        <Animatable.View animation='fadeInUp' duration={2000} delay={1000}>
            <Card title='Comments'>
                <FlatList data={comments}
                    renderItem={renderCommentItem}
                    keyExtractor={item => item.id.toString()}>
                </FlatList>
            </Card>
        </Animatable.View>
    )
}

class CampsiteInfo extends Component{
    state = { 
        showModal: false,
        rating: 5,
        author: '',
        text: ''
    }

    toggleModal = () => {
        this.setState({showModal: !this.state.showModal});
    }

    handleComment = (campsiteId) => {
        this.props.postComment(campsiteId, this.state.rating, this.state.author, this.state.text);
    }

    resetForm = () => {
        this.setState({
            rating: 5,
            author: '',
            text: ''
        });
    }

    markFavorite = (campsiteId) => {
        this.props.postFavorite(campsiteId);
    }

    static navigationOptions = {
        title: 'Campsite Information'
    }

    render(){
        const campsiteId = this.props.navigation.getParam('campsiteId');
        const campsite = this.props.campsites.campsites.filter(campsite => campsite.id === campsiteId)[0];
        const comments = this.props.comments.comments.filter(comment => comment.campsiteId === campsiteId);
        return(
            <ScrollView>
                <RenderCampsite 
                    campsite={campsite}
                    favorite={this.props.favorites.includes(campsiteId)}
                    markFavorite={()=> this.markFavorite(campsiteId)}
                    onShowModal={()=>this.toggleModal()}
                />
                <RenderComments comments={comments} />
                <Modal
                    animationType={'slide'}
                    transparent={false}
                    visible={this.state.showModal}
                    onRequestClose={()=>this.toggleModal()}>
                    <View style={styles.modal}>
                        <Rating
                            showRating
                            startingValue={this.state.rating}
                            imageSize={40}
                            onFinishRating={(rating)=>this.setState({rating:rating})}
                            style={{paddingVertical: 10}}
                        />
                        <Input 
                            placeholder='author name'
                            leftIcon={
                                <Icon
                                    name='user-o'
                                    type='font-awesome'
                                />
                            }
                            leftIconContainerStyle={{paddingRight:10}}
                            onChangeText={(inputText)=>this.setState({author:inputText})}
                            value={this.state.author}
                        />
                        <Input 
                            placeholder='comment text'
                            leftIcon={
                                <Icon
                                    name='comment-o'
                                    type='font-awesome'
                                />
                            }
                            leftIconContainerStyle={{paddingRight:10}}
                            onChangeText={(inputText)=>this.setState({text:inputText})}
                            value={this.state.text}
                        />
                        <View style={{margin: 10}}>
                            <Button 
                                onPress={()=>{
                                    this.handleComment(campsiteId);
                                    this.resetForm();
                                    this.toggleModal();
                                }}
                                color='#5637DD'
                                title='Submit'
                            />
                        </View>
                        <View style={{margin: 10}}>
                            <Button 
                                onPress={()=>{
                                    this.toggleModal();
                                    this.resetForm();
                                }}
                                color='#808080'
                                title='Cancel'
                            />
                        </View>
                    </View>    
                </Modal>
            </ScrollView>
        )
    }
}
const mapStateToProps = (state) => ({
    comments: state.comments,
    campsites: state.campsites,
    favorites: state.favorites
});
const mapDisptatchToProps = {
    postFavorite,
    postComment
}
const styles = StyleSheet.create({
    cardRow: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        flexDirection: 'row',
        margin: 20
    },
    cardItem: {
        flex: 1,
        margin: 10
    },
    modal: {
        justifyContent: 'center',
        margin: 20
    }
});
export default connect(mapStateToProps, mapDisptatchToProps)(CampsiteInfo);




