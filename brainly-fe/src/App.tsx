import { Button } from "./components/Button";
import { PlusIcon } from "./icons/PlusIcon";
import { ShareIcon } from "./icons/ShareIcon";

function App() {
  return (
    <div>
      <Button variant="primary" text="Add content" startIcon={<PlusIcon />} />
      <Button
        variant="secondary"
        text="Share Brain"
        startIcon={<ShareIcon />}
      />
    </div>
  );
}

export default App;
