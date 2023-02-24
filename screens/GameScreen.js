import {
  View,
  StyleSheet,
  Alert,
  FlatList,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Title from "../components/ui/Title";
import { useState, useEffect } from "react";
import NumberContainer from "../components/game/NumberContainer";
import PrimaryButton from "../components/ui/PrimaryButton";
import InstructionText from "../components/ui/InstructionText";
import Card from "../components/ui/Card";
import GuessLogItem from "../components/game/GuessLogItem";

function generateRandomBetween(min, max, exclude) {
  const rndNum = Math.floor(Math.random() * (max - min)) + min;

  if (rndNum === exclude) {
    return generateRandomBetween(min, max, exclude);
  } else {
    return rndNum;
  }
}

let minBoundary = 1;
let maxBoundary = 100;

function GameScreen({ userNumber, onGameOver }) {
  const initialGuess = generateRandomBetween(1, 100, userNumber);
  const [currentGuess, setCurrentGuess] = useState(initialGuess);
  const [guessRounds, setGuessRounds] = useState([initialGuess]);
  const { width, height } = useWindowDimensions();

  useEffect(() => {
    if (currentGuess === userNumber) {
      onGameOver(guessRounds.length);
    }
  }, [currentGuess, userNumber, onGameOver]);

  useEffect(() => {
    minBoundary = 1;
    maxBoundary = 100;
  }, []);

  function nextGuessHandler(direction) {
    if (
      (direction === "lower" && currentGuess < userNumber) ||
      (direction === "greater" && currentGuess > userNumber)
    ) {
      return Alert.alert("Don't lue!", "You know that this is wrong...", [
        { text: "Sorry", style: "cancel" },
      ]);
    }
    //'lower', 'greater'
    if (direction === "lower") {
      maxBoundary = currentGuess;
    } else {
      minBoundary = currentGuess + 1;
    }
    console.log(minBoundary, maxBoundary);
    const newRndNumber = generateRandomBetween(
      minBoundary,
      maxBoundary,
      currentGuess
    );
    setCurrentGuess(newRndNumber);
    setGuessRounds((prevGuessRounds) => [newRndNumber, ...prevGuessRounds]);
  }

  const guessRoundsListLenght = guessRounds.length;

  // if (width > 500) {
  //   content = (
  //     <>
  //       <InstructionText style={styles.InstructionText}>
  //         Higher or Lower
  //       </InstructionText>
  //       <View>
  //         <View style={styles.buttonContainer}>
  //           <PrimaryButton onPress={nextGuessHandler.bind(this, "lower")}>
  //             <Ionicons name="md-remove" size={24} color="white" />
  //           </PrimaryButton>
  //         </View>
  //         <NumberContainer>{currentGuess}</NumberContainer>;
  //         <View style={styles.buttonContainer}>
  //           <PrimaryButton onPress={nextGuessHandler.bind(this, "greater")}>
  //             <Ionicons name="md-add" size={24} color="white" />
  //           </PrimaryButton>
  //         </View>
  //       </View>
  //     </>
  //   );
  // }

  {
    width > 500
      ? (content = (
          <>
            <InstructionText style={styles.InstructionText}>
              Higher or Lower
            </InstructionText>
            <View>
              <View style={styles.buttonContainer}>
                <PrimaryButton onPress={nextGuessHandler.bind(this, "lower")}>
                  <Ionicons name="md-remove" size={24} color="white" />
                </PrimaryButton>
              </View>
              <NumberContainer>{currentGuess}</NumberContainer>;
              <View style={styles.buttonContainer}>
                <PrimaryButton onPress={nextGuessHandler.bind(this, "greater")}>
                  <Ionicons name="md-add" size={24} color="white" />
                </PrimaryButton>
              </View>
            </View>
          </>
        ))
      : (content = (
          <>
            <NumberContainer>{currentGuess}</NumberContainer>
            <Card>
              <InstructionText style={styles.InstructionText}>
                Higher or Lower
              </InstructionText>
              <View style={styles.buttonsContainer}>
                <View style={styles.buttonContainer}>
                  <PrimaryButton onPress={nextGuessHandler.bind(this, "lower")}>
                    <Ionicons name="md-remove" size={24} color="white" />
                  </PrimaryButton>
                </View>
                <View style={styles.buttonContainer}>
                  <PrimaryButton
                    onPress={nextGuessHandler.bind(this, "greater")}
                  >
                    <Ionicons name="md-add" size={24} color="white" />
                  </PrimaryButton>
                </View>
              </View>
            </Card>
          </>
        ));
  }

  return (
    <View style={styles.screen}>
      <Title>Opponent's Guess</Title>
      {content}
      <View style={styles.listContainer}>
        <FlatList
          data={guessRounds}
          renderItem={(itemData) => (
            <GuessLogItem
              roundNumber={guessRoundsListLenght - itemData.index}
              guess={itemData.item}
            />
          )}
          keyExtractor={(item) => item}
        />
      </View>
    </View>
  );
}

export default GameScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 24,
    alignItems: "center",
  },
  InstructionText: {
    marginBottom: 12,
  },
  buttonsContainer: {
    flexDirection: "row",
  },
  buttonContainer: {
    flex: 1,
  },
  listContainer: {
    flex: 1,
    padding: 16,
  },
});
