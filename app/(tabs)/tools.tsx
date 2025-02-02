import { StyleSheet } from 'react-native'

import { Collapsible } from '@/components/Collapsible'
import ParallaxScrollView from '@/components/ParallaxScrollView'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { IconSymbol } from '@/components/ui/IconSymbol'

export default function ToolsScreen() {
    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
            headerImage={
                <IconSymbol
                    size={310}
                    color="#808080"
                    name="drone"
                    style={styles.headerImage}
                />
            }
        >
            <ThemedView style={styles.titleContainer}>
                <ThemedText type="title">Drone Tools</ThemedText>
            </ThemedView>
            <ThemedView style={styles.container}>
                <Collapsible title="Flight Time Calculator">
                    <ThemedText>
                        Calculate your drone's estimated flight time based on: -
                        Battery capacity - Wind conditions - Temperature effects
                        - Drone weight
                    </ThemedText>
                    {/* Add calculator component here */}
                </Collapsible>

                <Collapsible title="No-Fly Zone Checker">
                    <ThemedText>
                        Check your location against: - Restricted airspace -
                        Temporary flight restrictions - Nearby airports and
                        helipads
                    </ThemedText>
                    {/* Add map component here */}
                </Collapsible>

                <Collapsible title="Drone Profiles">
                    <ThemedText>
                        Manage different drone profiles with custom weather
                        thresholds: - Save multiple drone configurations -
                        Import/export settings - Quick profile switching
                    </ThemedText>
                    {/* Add drone profile manager component here */}
                </Collapsible>

                <Collapsible title="Flight Logs">
                    <ThemedText>
                        Track your flights and analyze patterns: - Record flight
                        conditions - Generate weather reports - Export flight
                        history
                    </ThemedText>
                    {/* Add flight log component here */}
                </Collapsible>
            </ThemedView>
        </ParallaxScrollView>
    )
}

const styles = StyleSheet.create({
    headerImage: {
        color: '#808080',
        bottom: -90,
        left: -35,
        position: 'absolute',
    },
    titleContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    container: {
        padding: 16,
    },
})
