import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { useAuthenticator } from "@aws-amplify/ui-react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

function App() {
	const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
	const { user, signOut } = useAuthenticator();

	useEffect(() => {
		client.models.Todo.observeQuery().subscribe({
			next: (data) => setTodos([...data.items]),
		});
	}, []);

	function createTodo() {
		client.models.Todo.create({ content: window.prompt("Todo content") });
	}

	function deleteTodo(id: string) {
		client.models.Todo.delete({ id });
	}

	return (
		<main>
			<h1>My todos</h1>
			<h1>{user?.signInDetails?.loginId}'s todos</h1>
			<Button onClick={createTodo}>+ new</Button>
			<ul>
				{todos.map((todo) => (
					<li onClick={() => deleteTodo(todo.id)} key={todo.id}>
						{todo.content}
					</li>
				))}
			</ul>
			<button onClick={signOut}>Sign out</button>
			<div>
				🥳 the code works, nice
				<br />
				<a href="https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates">here is the tutorial</a>
			</div>
		</main>
	);
}

export default App;
