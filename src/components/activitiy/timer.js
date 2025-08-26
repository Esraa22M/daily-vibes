import { View, StyleSheet } from "react-native";
import { FlowText } from "./overrides";
import { PhoneRing } from "../../ui/phoneRingEffect";
import { formatMilliseconds } from "../../utils/customHooks";
import { useMemo } from "react";

export const ActivityTimer = ({ time, item,animate=false }) => {

;

  return (
    <PhoneRing  animate={animate} item={item}>
      <View style={styles.upperContainer}>
        <View style={styles.timerContainer}>
          {item ? (
            <FlowText>{formatMilliseconds(time)}</FlowText>
          ) : (
            <FlowText>00:00:00</FlowText>
          )}
        </View>
      </View>
    </PhoneRing>
  );
};

const TIMER_SIZE = 150; // حجم الدائرة

const styles = StyleSheet.create({
  timerContainer: {
    height: TIMER_SIZE,        // صححت الكتابة من "Height" لـ "height"
    width: TIMER_SIZE,         // صححت الكتابة من "minwidth" لـ "width"
    paddingHorizontal: 10,
    marginVertical: 10,
    borderRadius: TIMER_SIZE / 2, // نص الحجم ليكون دائري
    justifyContent: "center",
    alignItems: "center",
  },
  upperContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});
