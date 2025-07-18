import { useState } from "react";
import { InputField } from "./InputField";
import { DarkButton } from "./buttons/DarkButton";

export const SolanaSelector = ({
  setMetadata,
}: {
  setMetadata: (params: any) => void;
}) => {
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");
  return (
    <>
      <InputField
        label="Address"
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <InputField
        label="Amount"
        type="text"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <div className="p-4"></div>
      <DarkButton
        onClick={() => {
          setMetadata({ address, amount });
        }}
      >
        <div className="flex flex-1 justify-center">Add</div>
      </DarkButton>
    </>
  );
};
