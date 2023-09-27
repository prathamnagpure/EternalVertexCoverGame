import { React, Component } from 'react';
import { View, Pressable, Text, StyleSheet, Alert, SafeAreaView } from 'react-native';
import Stage from './components/Stage';
import stages from './assets/Stages';

export default class App extends Component{
    constructor(props){
        super(props);
    }
    
    render(){
        return (
            <SafeAreaView style={styles.container}>
                <Stage stage={stages[0]} />
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});



