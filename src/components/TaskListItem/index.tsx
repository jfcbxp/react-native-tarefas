import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React from "react";
import { Task } from "../../models/Task";
import Ionicons from "@expo/vector-icons/Ionicons";

type Props = {
  data: Task;
  deleteItem(item: Task): void;
  editItem(item: Task): void;
};

const TaskListItem = (props: Props) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={{ marginRight: 10 }}
        onPress={() => props.deleteItem(props.data)}
      >
        <Ionicons name="trash" size={20} color="white" />
      </TouchableOpacity>
      <View>
        <TouchableWithoutFeedback onPress={() => props.editItem(props.data)}>
          <Text style={{ color: "#FFF", paddingRight: 10 }}>
            {props.data.nome}
          </Text>
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
};

export default TaskListItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#121212",
    alignItems: "center",
    marginBottom: 10,
    padding: 10,
    borderRadius: 4,
  },
});
