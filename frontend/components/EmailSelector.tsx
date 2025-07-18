import { useState } from "react";
import { InputField } from "./InputField";
import { DarkButton } from "./buttons/DarkButton";

export const EmailSelector = ({
  setMetadata,
}: {
  setMetadata: (params: any) => void;
}) => {
  const [email, setEmail] = useState("");
  const [body, setBody] = useState("");
  return (
    <>
      <InputField
        label="To"
        type="text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <InputField
        label="Body"
        type="text"
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      <div className="p-4"></div>
      <DarkButton
        onClick={() => {
          setMetadata({ email, body });
        }}
      >
        <div className="flex flex-1 justify-center">Add</div>
      </DarkButton>
    </>
  );
};
