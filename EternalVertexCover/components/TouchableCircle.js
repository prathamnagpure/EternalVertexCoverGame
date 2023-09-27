import { Image, StyleSheet, Pressable, View, Alert } from "react-native";
import images from "../assets/Images";
import { React, Component } from 'react'

export default class TouchableCircle extends Component {

    constructor(props){
        super(props);

        this.state = {
            guardPresent: false,
        }
    }

    styles = StyleSheet.create({
        circleContainer: {
            position: 'absolute',
            top: this.props.y - this.props.radius,
            left: this.props.x - this.props.radius,
            width: 2 * this.props.radius,
            height: 2 * this.props.radius,
            borderRadius: this.props.radius,
            backgroundColor: 'blue',
            alignItems: 'center',
            paddingVertical: 5
        },
    });

    render() {
        let content = null;

        if (this.state.guardPresent == true){
            content = <Image source={images.guard} style={{ width:this.props.radius*1.5, height: this.props.radius*1.5, resizeMode: 'stretch'}}/>
        }

        const showGuard = () => {
            let change = 0;
            if (this.state.guardPresent == true){
                this.setState({ guardPresent: false });
                change = 1;
            } else {
                this.setState({ guardPresent: true });
                change = -1;
            }
            if (this.props.onPressIn != null){
                this.props.onPressIn(change);
            }
        }

        return (
            <Pressable onPressIn={showGuard}>
                <View style={this.styles.circleContainer} >
                    {content}
                </View>
            </Pressable>
        );
    }
};