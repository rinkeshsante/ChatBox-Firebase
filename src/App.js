import React, { useState } from "react";
import "./App.css";

import firebase from "firebase/app";

import "firebase/firestore";
import "firebase/auth";

import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import "bootstrap/dist/css/bootstrap.css";

firebase.initializeApp({
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional

  apiKey: "AIzaSyCy_GTWMhf_POoQSXGNdz34wfKbOLYuNvc",
  authDomain: "mychatbox-b090e.firebaseapp.com",
  databaseURL: "https://mychatbox-b090e.firebaseio.com",
  projectId: "mychatbox-b090e",
  storageBucket: "mychatbox-b090e.appspot.com",
  messagingSenderId: "309543771997",
  appId: "1:309543771997:web:ff854280015b31ee2d52b4",
  measurementId: "G-9717VWRZ3F",
});

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <section>{user ? <ChatRoom /> : <SignUp />}</section>
    </div>
  );
}

function SignUp() {
  const SignUpWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  };

  return <button onClick={SignUpWithGoogle}>Sign Up With Google</button>;
}

function SignOut() {
  return (
    auth.currentUser && <button onClick={() => auth.signOut()}>SignOut</button>
  );
}

function ChatRoom() {
  const dummy = React.useRef();
  const msgRef = firestore.collection("messages");
  const query = msgRef.orderBy("createdAt", "desc").limit(25);

  const [messages] = useCollectionData(query, { idField: "id" });

  const [formValue, setFormValue] = useState("");

  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    const val = {
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL,
    };

    console.log(val);

    await msgRef.add(val);

    setFormValue("");
    dummy.current.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <div>
      <SignOut></SignOut>
      <div>
        {messages &&
          messages
            .reverse()
            .map((msg) => <ChatMessage key={msg.id} message={msg} />)}

        <span ref={dummy}></span>
      </div>

      <form onSubmit={sendMessage}>
        <input
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
        />
        <button type="submit">Go</button>
      </form>
    </div>
  );
}

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const msgClass = uid === auth.currentUser.uid ? "sent" : "received";

  return (
    <p className={`message ${msgClass}`}>
      <img src={photoURL} />
      {text} , {msgClass}
    </p>
  );
}

export default App;
