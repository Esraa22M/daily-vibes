import { View, Text, StyleSheet, Animated, PanResponder } from "react-native";
import { FlowRow, FlowText } from "./overrides";
import { FlowView } from "./overrides";
import { useRef } from "react";
import { COLORS } from "../../variables/styles";
import { LoadingDots } from "../../ui/loadingDots";
import { formatMilliseconds } from "../../utils/customHooks";

const threshold = 60;

export const ActivityItem = ({ title, id, isActive, onActivityChange, time }) => {
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      // السماح بالـ gesture فقط لو الحركة أفقية أكتر من العمودية
      onMoveShouldSetPanResponder: (event, gestureState) => {
        return Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
      },
      onPanResponderMove: (event, gestureState) => {
        const currentX = gestureState.dx;

        if (currentX > threshold) {
          onActivityChange({ id, state: true });
        }
        if (currentX < -threshold) {
          onActivityChange({ id, state: false });
        }

        Animated.event([null, { dx: pan.x, dy: pan.y }], {
          useNativeDriver: false,
        })(event, gestureState);
      },
      onPanResponderTerminationRequest: () => false,
      onPanResponderRelease: () => {
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;

  const itemBackgroundColor = isActive ? COLORS.activeBackground : COLORS.card;

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={{ touchAction: "none", transform: [{ translateX: pan.x }] }}
    >
      <FlowView
        style={{ ...styles.itemContainer, backgroundColor: itemBackgroundColor }}
      >
        <FlowRow style={styles.innerContainer}>
          <FlowText>{title}</FlowText>
          {isActive ? (
            <LoadingDots />
          ) : (
            <FlowText>{formatMilliseconds(time)}</FlowText>
          )}
        </FlowRow>
      </FlowView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  itemContainer: { marginBottom: 20, paddingVertical: 19 },
  innerContainer: { justifyContent: "space-between" },
});
