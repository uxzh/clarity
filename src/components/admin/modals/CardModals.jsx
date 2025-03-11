// src/components/admin/modals/CardModals.jsx
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@heroui/react";
import { formatDate } from "../../../utils/dateFormatter";

export const CardDetailsModal = ({ isOpen, onClose, card }) => {
  return (
    <Modal size="3xl" isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>Card Details - {card?.cardName}</ModalHeader>
        <ModalBody>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <img
                src={card?.cardImageUrl}
                alt={card?.cardName}
                className="w-full h-48 object-contain mb-4"
              />
              <div className="space-y-2">
                <h3 className="font-semibold">Basic Info</h3>
                <p>Bank: {card?.bankName}</p>
                <p>Credit Score Required: {card?.creditScoreRequired}</p>
                <p>Created: {formatDate(card?.createdAt)}</p>
                <p>Average Rating: {card?.averageRating?.toFixed(1)} ⭐</p>
                <p>Review Count: {card?.reviewCount}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Cashback Percentages</h3>
                {card?.cashbackPercentages &&
                  Object.entries(card.cashbackPercentages).map(
                    ([category, percentage]) => (
                      <p key={category}>
                        {category}: {percentage}
                      </p>
                    )
                  )}
              </div>
              <div>
                <h3 className="font-semibold">APR Information</h3>
                <p>Range: {card?.apr?.range}</p>
                <p>Intro APR: {card?.apr?.introApr}</p>
              </div>
              <div>
                <h3 className="font-semibold">Fees</h3>
                {card?.fees?.map((fee) => (
                  <p key={fee.name}>
                    {fee.name}: {fee.value}
                  </p>
                ))}
              </div>
              <div>
                <h3 className="font-semibold">Rewards</h3>
                {card?.rewards?.map((reward) => (
                  <p key={reward.name}>
                    {reward.name}: {reward.value}
                  </p>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-4 space-y-4">
            <div>
              <h3 className="font-semibold">Perks</h3>
              <ul className="list-disc pl-4">
                {card?.perks?.map((perk) => (
                  <li key={perk}>{perk}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold">Redemption Options</h3>
              <ul className="list-disc pl-4">
                {card?.redemptionOptions?.map((option) => (
                  <li key={option}>{option}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold">Additional Benefits</h3>
              <ul className="list-disc pl-4">
                {card?.additionalBenefits?.map((benefit) => (
                  <li key={benefit}>{benefit}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold">Review from the Web</h3>
              <p className="text-sm">{card?.reviewFromTheWeb}</p>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onPress={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export const CardEditModal = ({ isOpen, onClose, card, onSave }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const cashbackPercentages = {
      Travel: formData.get("cashback-travel"),
      Dining: formData.get("cashback-dining"),
      Groceries: formData.get("cashback-groceries"),
      Gas: formData.get("cashback-gas"),
      Shopping: formData.get("cashback-shopping"),
      Other: formData.get("cashback-other"),
    };

    const fees = [
      { name: "Annual Fee", value: formData.get("annual-fee") },
      { name: "Foreign Fee", value: formData.get("foreign-fee") },
    ];

    const rewards = [
      { name: "Cash Back", value: formData.get("cash-back") },
      { name: "Sign-up Bonus", value: formData.get("sign-up-bonus") },
    ];

    onSave({
      cardName: formData.get("cardName"),
      bankName: formData.get("bankName"),
      cardImageUrl: formData.get("cardImageUrl"),
      creditScoreRequired: formData.get("creditScoreRequired"),
      cashbackPercentages,
      fees,
      rewards,
      apr: {
        range: formData.get("apr-range"),
        introApr: formData.get("intro-apr"),
      },
      perks: formData.get("perks").split("\n").filter(Boolean),
      redemptionOptions: formData
        .get("redemptionOptions")
        .split("\n")
        .filter(Boolean),
      additionalBenefits: formData
        .get("additionalBenefits")
        .split("\n")
        .filter(Boolean),
    });
  };

  return (
    <Modal size="4xl" isOpen={isOpen} onClose={onClose} scrollBehavior="inside">
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader>Edit Card</ModalHeader>
          <ModalBody>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <Input
                  label="Card Name"
                  name="cardName"
                  defaultValue={card?.cardName || ""}
                  required
                />
                <Input
                  label="Bank Name"
                  name="bankName"
                  defaultValue={card?.bankName || ""}
                  required
                />
                <Input
                  label="Card Image URL"
                  name="cardImageUrl"
                  defaultValue={card?.cardImageUrl || ""}
                  required
                />
                <Input
                  label="Credit Score Required"
                  name="creditScoreRequired"
                  defaultValue={card?.creditScoreRequired || ""}
                  required
                />
                <div>
                  <h3 className="text-sm font-semibold mb-2">
                    Cashback Percentages
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      label="Travel"
                      name="cashback-travel"
                      defaultValue={card?.cashbackPercentages?.Travel || ""}
                    />
                    <Input
                      label="Dining"
                      name="cashback-dining"
                      defaultValue={card?.cashbackPercentages?.Dining || ""}
                    />
                    <Input
                      label="Groceries"
                      name="cashback-groceries"
                      defaultValue={card?.cashbackPercentages?.Groceries || ""}
                    />
                    <Input
                      label="Gas"
                      name="cashback-gas"
                      defaultValue={card?.cashbackPercentages?.Gas || ""}
                    />
                    <Input
                      label="Shopping"
                      name="cashback-shopping"
                      defaultValue={card?.cashbackPercentages?.Shopping || ""}
                    />
                    <Input
                      label="Other"
                      name="cashback-other"
                      defaultValue={card?.cashbackPercentages?.Other || ""}
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold mb-2">Fees</h3>
                  <Input
                    label="Annual Fee"
                    name="annual-fee"
                    defaultValue={
                      card?.fees?.find((f) => f.name === "Annual Fee")?.value ||
                      ""
                    }
                  />
                  <Input
                    label="Foreign Fee"
                    name="foreign-fee"
                    defaultValue={
                      card?.fees?.find((f) => f.name === "Foreign Fee")
                        ?.value || ""
                    }
                  />
                </div>
                <div>
                  <h3 className="text-sm font-semibold mb-2">APR</h3>
                  <Input
                    label="APR Range"
                    name="apr-range"
                    defaultValue={card?.apr?.range || ""}
                  />
                  <Input
                    label="Intro APR"
                    name="intro-apr"
                    defaultValue={card?.apr?.introApr || ""}
                  />
                </div>
                <div>
                  <h3 className="text-sm font-semibold mb-2">Rewards</h3>
                  <Input
                    label="Cash Back"
                    name="cash-back"
                    defaultValue={
                      card?.rewards?.find((r) => r.name === "Cash Back")
                        ?.value || ""
                    }
                  />
                  <Input
                    label="Sign-up Bonus"
                    name="sign-up-bonus"
                    defaultValue={
                      card?.rewards?.find((r) => r.name === "Sign-up Bonus")
                        ?.value || ""
                    }
                  />
                </div>
              </div>
              <div className="col-span-2 space-y-4">
                <Textarea
                  label="Perks (one per line)"
                  name="perks"
                  defaultValue={card?.perks?.join("\n") || ""}
                  rows={4}
                />
                <Textarea
                  label="Redemption Options (one per line)"
                  name="redemptionOptions"
                  defaultValue={card?.redemptionOptions?.join("\n") || ""}
                  rows={4}
                />
                <Textarea
                  label="Additional Benefits (one per line)"
                  name="additionalBenefits"
                  defaultValue={card?.additionalBenefits?.join("\n") || ""}
                  rows={4}
                />
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Cancel
            </Button>
            <Button color="primary" type="submit">
              Save Changes
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export const CardDeleteModal = ({ isOpen, onClose, card, onConfirm }) => {
  return (
    <Modal size="sm" isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>Delete Card</ModalHeader>
        <ModalBody>
          <p>
            Are you sure you want to delete {card?.cardName || "this card"}?
            This action cannot be undone.
          </p>
        </ModalBody>
        <ModalFooter>
          <Button color="default" variant="light" onPress={onClose}>
            Cancel
          </Button>
          <Button color="danger" onPress={() => onConfirm(card?._id)}>
            Delete Card
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
