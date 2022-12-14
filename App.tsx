import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
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
import { realtime } from "./src/services/firebase.service";

export default function App() {
  const [user, setUser] = useState("");
  const [newTask, setNewTask] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const inputRef = useRef<TextInput>(null);

  const handleDelete = (item: Task) => {
    realtime
      .ref("tarefas")
      .child(user)
      .child(item.key)
      .remove()
      .then(() => {
        let newTasks = tasks.filter((task) => task.key !== item.key);
        setTasks(newTasks);
      });
  };

  const handleEdit = (item: Task) => {
    //realtime.ref("tarefas").child(user).update({})
    handleDelete(item);
    setNewTask(item.nome);
    inputRef.current?.focus();
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

  useEffect(() => {
    if (user) {
      realtime
        .ref("tarefas")
        .child(user)
        .once("value", (snapshot) => {
          setTasks([]);
          snapshot.forEach((childItem) => {
            let data: Task = {
              key: childItem.key!,
              nome: childItem.val().nome,
            };
            setTasks((oldValue) => [...oldValue, data]);
          });
        });
    }
  }, [user]);

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
            ref={inputRef}
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
