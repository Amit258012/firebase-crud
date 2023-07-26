import { useEffect, useState } from "react";
import "./App.css";
import { db } from "./firebaseConfig";
import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	getDocs,
	updateDoc,
} from "firebase/firestore";

function App() {
	const [users, setUsers] = useState([]);
	const usersCollectionRef = collection(db, "users");
	const [newName, setNewName] = useState("");
	const [newAge, setNewAge] = useState(0);

	const deleteUser = async (id) => {
		const userDoc = doc(db, "users", id);
		await deleteDoc(userDoc);
	};

	const createUser = async () => {
		await addDoc(usersCollectionRef, {
			name: newName,
			age: Number(newAge),
		});
	};

	const updateAge = async (id, age) => {
		const userDoc = doc(db, "users", id);
		const newFields = { age: age + 1 };
		await updateDoc(userDoc, newFields);
	};

	useEffect(() => {
		const getUsers = async () => {
			const data = await getDocs(usersCollectionRef);

			setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
		};
		getUsers();
	}, []);
	return (
		<>
			<div className="App">
				<input
					type="text"
					placeholder="name"
					style={{
						padding: "20px",
						margin: "10px",
					}}
					onChange={(e) => setNewName(e.target.value)}
				/>
				<input
					type="number"
					placeholder="age"
					style={{ padding: "20px", margin: "10px" }}
					onChange={(e) => setNewAge(e.target.value)}
				/>
				<button onClick={createUser}>Create User</button>
				{users.map((user) => {
					return (
						<div key={user.id}>
							<h1>Name: {user.name}</h1>
							<h1>Age: {user.age}</h1>
							<button
								onClick={() => {
									updateAge(user.id, user.age);
								}}>
								Increase Age
							</button>
							<button
								onClick={() => {
									deleteUser(user.id);
								}}>
								Delete User
							</button>
						</div>
					);
				})}
			</div>
		</>
	);
}

export default App;
