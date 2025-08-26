import React, { useRef } from "react";
import {
  View,
  StyleSheet,
  Animated,
  PanResponder,
  Pressable,
} from "react-native";
import { FlowRow, FlowText, FlowView } from "./overrides";
import { COLORS } from "../../variables/styles";
import { LoadingDots } from "../../ui/loadingDots";
import { formatMilliseconds } from "../../utils/customHooks";

const threshold = 60;

export const ActivityItem = React.memo(({
  title,
  id,
  isActive,
  onActivityChange,
  time,
  handleItemPress
}) => {
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) =>
        Math.abs(gestureState.dx) > Math.abs(gestureState.dy),
      onPanResponderMove: (evt, gestureState) => {
        const currentX = gestureState.dx;

        if (currentX > threshold) onActivityChange({ id, state: true });
        if (currentX < -threshold) onActivityChange({ id, state: false });

        Animated.event([null, { dx: pan.x, dy: pan.y }], {
          useNativeDriver: false,
        })(evt, gestureState);
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
      <Pressable onPress={handleItemPress}>
        <FlowView style={{ ...styles.itemContainer, backgroundColor: itemBackgroundColor }}>
          <FlowRow style={styles.innerContainer}>
            <FlowText>{title}</FlowText>
            {isActive ? (
              <LoadingDots />
            ) : (
              <FlowText style={{color:COLORS.borderColor}}>{formatMilliseconds(time)}</FlowText>
            )}
          </FlowRow>
        </FlowView>
      </Pressable>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  itemContainer: { marginBottom: 20, paddingVertical: 19 },
  innerContainer: { justifyContent: "space-between" },
});
