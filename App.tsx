import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Text,
  FlatList,
  ListRenderItem,
  Keyboard,
} from "react-native";
import Login from "./src/components/Login";
import TaskListItem from "./src/components/TaskListItem";
import { Task } from "./src/models/Task";
import { realtime, firebaseAuth } from "./src/services/firebase.service";

export default function App() {
  const [user, setUser] = useState("");
  const [newTask, setNewTask] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);

  const handleDelete = (item: Task) => {
    alert("deletou");
  };

  const handleEdit = (item: Task) => {
    alert("editou");
  };

  const handleAdd = () => {
    if (newTask) {
      let tarefas = realtime.ref("tarefas").child(user);
      let chave = tarefas.push().key;

      chave &&
        tarefas
          .child(chave)
          .set({
            nome: newTask,
          })
          .then((result) => {
            let data: Task = { key: chave!, nome: newTask };
            setTasks((oldValue) => [...oldValue, data]);
            Keyboard.dismiss();
            setNewTask("");
          });
    }
  };

  const renderItem: ListRenderItem<Task> = ({ item }) => (
    <TaskListItem data={item} deleteItem={handleDelete} editItem={handleEdit} />
  );
  const keyItem: (item: Task) => string = (item: Task) => item.key.toString();

  if (!user) {
    return <Login changeStatus={(user: string) => setUser(user)} />;
  } else {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="auto" />
        <View style={styles.containerTask}>
          <TextInput
            style={styles.input}
            placeholder="O que vai fazer hoje?"
            value={newTask}
            onChangeText={(text) => setNewTask(text)}
          />
          <TouchableOpacity style={styles.buttonAdd} onPress={handleAdd}>
            <Text style={styles.buttonAddText}>+</Text>
          </TouchableOpacity>
        </View>

        <FlatList data={tasks} keyExtractor={keyItem} renderItem={renderItem} />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 25,
    paddingHorizontal: 10,
    backgroundColor: "#F2f6fc",
  },
  containerTask: {
    flexDirection: "row",
  },
  input: {
    flex: 1,
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderRadius: 4,
    borderColor: "#141414",
    height: 45,
  },
  buttonAdd: {
    backgroundColor: "#141414",
    height: 45,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 5,
    paddingHorizontal: 14,
    borderRadius: 4,
  },
  buttonAddText: {
    color: "#FFF",
    fontSize: 22,
  },
});
