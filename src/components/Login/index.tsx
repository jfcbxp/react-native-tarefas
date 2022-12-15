import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { firebaseAuth } from "../../services/firebase.service";
type Props = {
  changeStatus: Function;
};

const Login = (props: Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setLogin] = useState(true);

  const handleLogin = () => {
    if (isLogin) {
      firebaseAuth
        .signInWithEmailAndPassword(email, password)
        .then((result) => {
          props.changeStatus(result.user?.uid);
        })
        .catch((error) => {
          alert("Erro ao efetuar login");
        });
    } else {
      firebaseAuth
        .createUserWithEmailAndPassword(email, password)
        .then((result) => {
          props.changeStatus(result.user?.uid);
        })
        .catch((error) => {
          if (error.code === "auth/weak-password") {
            alert("Senha informada invalida, digite uma senha mais forte.");
          }
          if (error.code === "auth/invalid-email") {
            alert("Email invalido");
          }
          if (error.code === "auth/email-already-in-use") {
            alert("Email já cadastrado");
          }
        });
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        placeholder="Seu email"
        style={styles.input}
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        placeholder="*****"
        secureTextEntry={true}
        style={styles.input}
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      <TouchableOpacity
        style={[
          styles.btnLogin,
          { backgroundColor: isLogin ? "#3ea6f2" : "#141414" },
        ]}
        onPress={handleLogin}
      >
        <Text style={styles.btnLoginText}>
          {isLogin ? "Acessar" : "Cadastrar"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setLogin((oldValue) => !oldValue)}>
        <Text style={{ textAlign: "center" }}>
          {isLogin ? "Criar uma conta" : "Já possuo uma conta"}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: "#F2f6fc",
    paddingHorizontal: 10,
  },
  input: {
    marginBottom: 10,
    backgroundColor: "#FFF",
    borderRadius: 4,
    height: 45,
    padding: 10,
    borderWidth: 1,
    borderColor: "#141414",
  },
  btnLogin: {
    alignItems: "center",
    justifyContent: "center",
    height: 45,
    marginBottom: 10,
  },
  btnLoginText: {
    color: "#FFF",
    fontSize: 17,
  },
});
