import React from "react";
import { Chip } from "@nextui-org/react";

const More = ({ cardData }) => (
  <div className="p-4">
    <h3 className="font-semibold mb-4">Key Information</h3>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <h4 className="font-semibold mb-2">Fees</h4>
        <div className="flex flex-wrap gap-2">
          {cardData.fees.map((fee, index) => (
            <Chip
              key={index}
              variant="flat"
            >{`${fee.name}: ${fee.value}`}</Chip>
          ))}
        </div>
      </div>
      <div>
        <h4 className="font-semibold mb-2">APR</h4>
        <div className="flex flex-wrap gap-2">
          <Chip variant="flat">{cardData.apr.range}</Chip>
          <Chip variant="flat" color="success">
            {cardData.apr.introApr}
          </Chip>
        </div>
      </div>
      <div>
        <h4 className="font-semibold mb-2">Rewards</h4>
        <div className="flex flex-wrap gap-2">
          {cardData.rewards.map((reward, index) => (
            <Chip
              key={index}
              variant="flat"
              color="primary"
            >{`${reward.name}: ${reward.value}`}</Chip>
          ))}
        </div>
      </div>
      <div>
        <h4 className="font-semibold mb-2">Credit Score</h4>
        <div className="flex flex-wrap gap-2">
          <Chip variant="flat" color="primary">
            {cardData.creditScoreRequired}
          </Chip>
        </div>
      </div>
    </div>

    <h3 className="font-semibold mt-4 mb-2">Additional Benefits</h3>
    <div className="flex flex-wrap gap-2">
      {cardData.additionalBenefits.map((benefit, index) => (
        <Chip key={index} variant="flat">
          {benefit}
        </Chip>
      ))}
    </div>
  </div>
);

export default React.memo(More);
