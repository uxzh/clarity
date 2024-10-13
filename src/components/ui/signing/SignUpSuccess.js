import React from "react";
import {
  Card,
  Image,
  CardBody,
  CardFooter,
  Button,
  Spacer,
  Modal,
  ModalContent,
} from "@nextui-org/react";

export default function SignUpSuccess({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <Card className="w-[420px]">
          <CardBody className="px-3 pb-1">
            <Image
              alt="Success image"
              className="aspect-video w-full object-cover object-top"
              src="/path-to-your-success-image.png"
            />
            <Spacer y={2} />
            <div className="flex flex-col gap-2 px-2">
              <p className="text-large font-medium">
                Account Created Successfully!
              </p>
              <p className="text-small text-default-400">
                Congratulations! Your account has been created. Please check
                your email to verify your account.
              </p>
            </div>
          </CardBody>
          <CardFooter className="justify-end gap-2">
            <Button fullWidth variant="light" onPress={onClose}>
              Close
            </Button>
          </CardFooter>
        </Card>
      </ModalContent>
    </Modal>
  );
}
