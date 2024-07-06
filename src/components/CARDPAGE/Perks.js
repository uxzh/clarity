import React from "react";

const Perks = ({ perks, redemptionOptions }) => (
  <div className="p-4">
    <h3 className="font-semibold mb-2">Card Perks</h3>
    <ul className="list-disc list-inside mb-4">
      {perks.map((perk, index) => (
        <li key={index}>{perk}</li>
      ))}
    </ul>

    <h3 className="font-semibold mt-4 mb-2">Redemption Options</h3>
    <ul className="list-disc list-inside">
      {redemptionOptions.map((option, index) => (
        <li key={index}>{option}</li>
      ))}
    </ul>
  </div>
);

export default React.memo(Perks);
