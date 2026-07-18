import "./App.css";
import { PeoplePage } from "./components/PeoplePage";
import Template from "./components/templates/template";

function App() {
	return (
		<>
			<Template children={<PeoplePage />} />
		</>
	);
}

export default App;
