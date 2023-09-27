import { Alert, StyleSheet, Pressable, View } from "react-native";
import { React, Component } from 'react';

export default class TouchableLine extends Component{

    constructor(props){
        super(props)
    }

    render(){
        const length = Math.sqrt(Math.pow(this.props.x2 - this.props.x1, 2) + Math.pow(this.props.y2 - this.props.y1, 2));
        const angle = Math.atan2(this.props.y2 - this.props.y1, this.props.x2 - this.props.x1) * (180 / Math.PI);

        const styles = StyleSheet.create({
            line: {
                position: 'absolute',
                left: this.props.x1 + (length / 2) * Math.cos(angle * Math.PI / 180) - length / 2,
                top: (this.props.y1 + this.props.y2) / 2,
                width: length,
                height: this.props.thickness,
                backgroundColor: 'white',
                transform: [{ rotate: `${angle}deg` }],   
            },
        });

        return (
            <Pressable onPressIn={() => { }} style={styles.touchableArea}>
                <View style={styles.line} />
            </Pressable>
        );
    }
};