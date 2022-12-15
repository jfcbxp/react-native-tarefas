import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Task } from "../../models/Task";

type Props = {
  data: Task;
};

const TaskListItem = (props: Props) => {
  return (
    <View>
      <Text>{props.data.nome}</Text>
    </View>
  );
};

export default TaskListItem;

const styles = StyleSheet.create({});
