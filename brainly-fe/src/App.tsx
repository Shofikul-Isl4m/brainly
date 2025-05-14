import { useState } from "react";
import { Button } from "./components/Button";
import { Card } from "./components/Card";
import { CreateContentModal } from "./components/CreateContentModal";
import { PlusIcon } from "./icons/PlusIcon";
import { ShareIcon } from "./icons/ShareIcon";

function App() {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <div className="p-4">
      <CreateContentModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
        }}
      />

      <div className="flex justify-end gap-4">
        <Button
          onClick={() => setModalOpen(true)}
          variant="primary"
          text="Add content"
          startIcon={<PlusIcon />}
        />
        <Button
          variant="secondary"
          text="Share Brain"
          startIcon={<ShareIcon />}
        />
      </div>
      <div className="flex gap-4">
        <Card
          type="twitter"
          link="https://x.com/RiazIslam117277/status/1865391698173706247"
          title="First tweet"
        />
        <Card
          type="youtube"
          link="https://www.youtube.com/watch?v=IGfJj2k_xe4"
          title="First video"
        />
      </div>
    </div>
  );
}

export default App;
