import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Paragraph, List, Button } from 'react-native-paper';

const DetailsScreen = ({ route, navigation }) => {
  // Get the results and source from the route params, or use placeholder data if none
  const { 
    results = { 
      message: 'No analysis data available',
      recommendations: ['Sample recommendation 1', 'Sample recommendation 2']
    },
    source = 'fertilizer'
  } = route.params || {};

  // Determine display title and icon based on the source
  const getScreenInfo = () => {
    if (source === 'disease') {
      return {
        title: 'Plant Disease Analysis',
        icon: 'bug',
        buttonText: 'New Disease Analysis'
      };
    } else {
      return {
        title: 'Soil Fertilizer Analysis',
        icon: 'leaf',
        buttonText: 'New Fertilizer Analysis'
      };
    }
  };

  const { title, icon, buttonText } = getScreenInfo();

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>{title}</Title>
          <Paragraph>{results.message}</Paragraph>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Recommendations</Title>
          {results.recommendations && results.recommendations.map((recommendation, index) => (
            <List.Item
              key={index}
              title={recommendation}
              left={props => <List.Icon {...props} icon={icon} />}
            />
          ))}
        </Card.Content>

        <Card.Actions style={styles.actions}>
          <Button 
            mode="contained" 
            onPress={() => {
              // Navigate back to the appropriate tab
              navigation.navigate('Main', { 
                screen: source === 'disease' ? 'Disease' : 'Fertilizer' 
              });
            }}
            style={styles.button}
          >
            {buttonText}
          </Button>
        </Card.Actions>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  card: {
    marginVertical: 8,
  },
  actions: {
    justifyContent: 'center',
    marginVertical: 8,
  },
  button: {
    margin: 8,
  },
});

export default DetailsScreen; 