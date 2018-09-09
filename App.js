import React from "react"
import {StyleSheet, Text, View, ScrollView} from "react-native"
import moment from 'moment'

const DATA = {
    timer: 1234567,
    laps: [1234, 234, 6542, 3453534]
}

function Timer({interval, style}) {
    const duration = moment.duration(interval)
    const centiseconds = Math.floor(duration.milliseconds() / 10)

    return (
        <Text style={style}>
            {duration.minutes()}:{duration.seconds()},{centiseconds}
        </Text>
    )
}


function RoundButton({title, color, background}) {
    return (
        <View style={[styles.button, {backgroundColor: background}]}>
            <View style={styles.buttonBorder}>
                <Text style={[styles.buttonTitle, {color}]}>
                    {title}
                </Text>
            </View>
        </View>
    )
}

function ButtonRow({children}) {
    return (
        <View style={styles.buttonRow}>{children}</View>
    )
}

function Lap({number, interval}) {
    return (
        <View style={styles.lap}>
            <Text style={styles.lapText}>Lap {number}</Text>
            <Timer style={styles.lapText} interval={interval}/>
        </View>
    )
}

function LabsTable({laps}) {
    return (
        <ScrollView style={styles.scrollView}>
            {laps.map((lap, index) => (
                <Lap number={laps.length - index}
                     key={laps.length - index}
                     interval={lap}/>
            ))}
        </ScrollView>
    )
}

export default class App extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <Timer interval={DATA.timer} style={styles.timer}/>
                <ButtonRow>
                    <RoundButton title='Start' color='#50D167' background='#1B361F'/>
                    <RoundButton title='Reset' color='#FFFFFF' background='#3D3D3D'/>
                </ButtonRow>
                <LabsTable laps={DATA.laps}></LabsTable>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0D0D0D",
        alignItems: "center",
        paddingTop: 130,
        paddingHorizontal: 20
    },
    timer: {
        color: "#FFFFFF",
        fontSize: 76,
        fontWeight: "200"
    },
    button: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: "center",
        alignItems: "center"
    },
    buttonTitle: {
        fontSize: 18
    },
    buttonBorder: {
        width: 76,
        height: 76,
        borderRadius: 38,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2
    },
    buttonRow: {
        flexDirection: "row",
        alignSelf: "stretch",
        justifyContent: "space-between",
        marginTop: 80,
        marginBottom: 30
    },
    lapText: {
        color: "#FFFFFF",
        fontSize: 18,
        borderColor: "#151515",
        borderTopWidth: 1,
        paddingVertical: 10
    },
    lap: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    scrollView: {
        alignSelf: "stretch"
    }
})