import React from "react"
import {
    StyleSheet, Text, View, ScrollView, TouchableOpacity
} from "react-native"
import moment from 'moment'


function Timer({interval, style}) {
    const duration = moment.duration(interval)
    const centiseconds = Math.floor(duration.milliseconds() / 10)
    const pad = (n) => n < 10 ? '0' + n : n

    return (
        <View style={[styles.timerContainer]}>
            <Text style={style}>{pad(duration.minutes())}:</Text>
            <Text style={style}>{pad(duration.seconds())},</Text>
            <Text style={style}>{pad(centiseconds)}</Text>
        </View>
    )
}

function RoundButton({title, color, background, onPress, disabled}) {
    return (
        <TouchableOpacity
            onPress={() => !disabled && onPress()}
            activeOpacity={disabled ? 1.0 : 0.7}
            style={[styles.button, {backgroundColor: background}]}>
            <View style={styles.buttonBorder}>
                <Text style={[styles.buttonTitle, {color}]}>
                    {title}
                </Text>
            </View>
        </TouchableOpacity>
    )
}

function ButtonRow({children}) {
    return (
        <View style={styles.buttonRow}>{children}</View>
    )
}

function Lap({number, interval, fastest, slowest}) {
    const lapStyle = [
        styles.lapText,
        fastest && styles.fastest, // if fastest property is true styles.fastest will be set and the green color will be applied
        slowest && styles.slowest
    ]

    return (
        <View style={styles.lap}>
            <Text style={lapStyle}>Lap {number}</Text>
            <Timer style={[lapStyle, styles.lapTimer]} interval={interval}/>
        </View>
    )
}

function LabsTable({laps, timer}) {
    const finishedLaps = laps.slice(1) // remove current lap from list
    let min = Number.MAX_SAFE_INTEGER
    let max = Number.MIN_SAFE_INTEGER
    if (finishedLaps.length > 2) {
        finishedLaps.forEach(lap => {
            if (lap < min) min = lap
            if (lap > max) max = lap
        })
    }
    return (
        <ScrollView style={styles.scrollView}>
            {laps.map((lap, index) => (
                <Lap
                    number={laps.length - index}
                    key={laps.length - index}
                    interval={index === 0 ? timer + lap : lap}
                    slowest={lap === max}
                    fastest={lap === min}
                />
            ))}
        </ScrollView>
    )
}

export default class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            start: 0,
            now: 0,
            laps: [],
        }
    }

    componentWillUnmount(){
        clearInterval(this.timer)

    }

    start = () => {
        const now = new Date().getTime()
        this.setState({
            start: now,
            now,
            laps: [0]
        })
        this.timer = setInterval(() => {
            this.setState({now: new Date().getTime()})
        }, 100)
    }

    stop = () => {
        clearInterval(this.timer)
        const {laps, now, start} = this.state
        const [firstLap, ...other] = laps
        this.setState({
            laps: [firstLap + now - start, ...other],
            start: 0,
            now: 0
        })

    }
    lap = () => {
        const timestamp = new Date().getTime()
        const {laps, now, start} = this.state
        const [firstLap, ...other] = laps // TODO ?? WHAT ??
        this.setState({
            laps: [0, firstLap + now - start, ...other],
            start: timestamp,
            now: timestamp
        })
    }
    reset = () => {
        this.setState({
            laps: [],
            start: 0,
            now: 0
        })
    }

    resume = () => {
        const now = new Date().getTime()

        this.setState({
            start: now,
            now
        })
        this.timer = setInterval(() => {
            this.setState({now: new Date().getTime()})
        }, 100)
    }


    render() {
        const {now, start, laps} = this.state
        const timer = now - start

        return (
            <View style={styles.container}>
                <Timer
                    interval={laps.reduce((total, current) => total + current, 0) + timer}
                    style={styles.timer}/>

                {laps.length === 0 && (
                    <ButtonRow>
                        <RoundButton
                            title='Lap'
                            color='#8B8B90'
                            background='#151515'
                            disabled
                        />
                        <RoundButton
                            title='Start'
                            color='#50D167'
                            background='#1B361F'
                            onPress={this.start}
                        />
                    </ButtonRow>
                )}

                {start > 0 && (
                    <ButtonRow>
                        <RoundButton
                            title='Lap'
                            color='#FFFFFF'
                            background='#3D3D3D'
                            onPress={this.lap}
                        />
                        <RoundButton
                            title='Stop'
                            color='#E33935'
                            background='#3C1715'
                            onPress={this.stop}
                        />
                    </ButtonRow>
                )}
                {laps.length > 0 && start === 0 && (
                    <ButtonRow>
                        <RoundButton
                            title='Reset'
                            color='#FFFFFF'
                            background='#3D3D3D'
                            onPress={this.reset}
                        />
                        <RoundButton
                            title='Start'
                            color='#50D167'
                            background='#1B361F'
                            onPress={this.resume}
                        />
                    </ButtonRow>
                )}
                <LabsTable laps={laps} timer={timer}></LabsTable>
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
    timerContainer: {
        flexDirection: "row"
    },
    timer: {
        color: "#FFFFFF",
        fontSize: 76,
        fontWeight: "200",
        width: 110
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
        borderWidth: 1
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
    lapTimer: {
        width: 30
    },
    lap: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    scrollView: {
        alignSelf: "stretch"
    },
    fastest: {
        color: "#4BC05F"
    },
    slowest: {
        color: "#CC3531"
    }
})