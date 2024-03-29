import {
  Button,
  Image,
  Input,
  Link,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Slider,
} from "@nextui-org/react";
import { useState } from "react";
import Image1 from "../../lib/bgs/numbers-dont-lie.png";

export default function ByTheNumbers() {
  const [annualIncome, setAnnualIncome] = useState(65000);
  const threePercent = (annualIncome * 0.03).toFixed();
  const fourPercent = (annualIncome * 0.04).toFixed();
  const cashbackRewards = `$${threePercent} to $${fourPercent}+`;

  const handleInputChange = (e) => {
    let value = Number(e.target.value);
    // Check if the input value exceeds 300,000
    if (value > 300000) {
      value = 300000; // Cap the value at 300,000
    }
    setAnnualIncome(value);
  };

  const handleSliderChange = (value) => {
    // Since the slider value is already a number, we can directly use it
    // Ensure the slider value does not exceed the maximum when converted
    const incomeValue = value * 1000 > 300000 ? 300000 : value * 1000;
    setAnnualIncome(incomeValue);
  };

  const popoverContext = (
    <div className="px-1 py-2">
      <div className="text-small font-bold">How we calculate cashback?</div>
      <div className="text-small" style={{ maxWidth: 300 }}>
        Typically, the average American credit card user, if utilizing cashback
        options, earns between 1 to 2 percent cashback on purchases. However,
        credit card issuers offer numerous deals with potential cashback rates
        exceeding 20 percent. Our rewards calculation method incorporates an
        estimated additional cashback of 2 to 5 percent of the annual spend,
        leveraging these deals offered by credit card companies and banks.
      </div>
    </div>
  );

  return (
    <div>
      <div
        className="mt-24 relative bg-no-repeat" // Ensure the background image does not repeat
        style={{
          backgroundImage: `url(${Image1})`, // Set the background image using the imported image
          backgroundPosition: "center bottom 10px", // Move the image to the right and bottom with some offset
          backgroundSize: "900px", // Scale the image to be smaller, adjust the size as needed
        }}
      >
        <h2 className="uppercase text-slate-800 color text-2xl font-black w-full text-center mb-4">
          Numbers don't lie
        </h2>
        <div
          className="w-full max-w-md p-6 m-4 bg-white shadow-[0px_5px_0px_0px_#1a202c] rounded-lg"
          style={{
            margin: "0 auto",
            border: "1px solid #1a202c",
            maxWidth: 448,
            width: "95vw",
          }}
        >
          <h1 className="text-2xl font-bold text-center mb-4 flex items-center justify-center">
            Cashback Calculator{" "}
            <Popover
              showArrow
              backdrop={"opaque"}
              offset={10}
              placement="bottom"
              motionProps={{
                variants: {
                  enter: {
                    y: 0,
                    opacity: 1,
                    duration: 0.1,
                    transition: {
                      opacity: {
                        duration: 0.15,
                      },
                    },
                  },
                  exit: {
                    y: "10%",
                    opacity: 0,
                    duration: 0,
                    transition: {
                      opacity: {
                        duration: 0.1,
                      },
                    },
                  },
                },
              }}
            >
              <PopoverTrigger>
                <Button
                  isIconOnly
                  size="sm"
                  variant="bordered"
                  className="ml-2"
                >
                  ?
                </Button>
              </PopoverTrigger>
              <PopoverContent>{popoverContext}</PopoverContent>
            </Popover>
          </h1>
          <p className="text-center mb-12">
            Estimate how much you could have earned in cashback with a credit
            card accelerator based on your annual spend.
          </p>

          <Input
            maxValue={300000}
            type="number"
            labelPlacement="outside"
            value={annualIncome}
            onChange={handleInputChange}
            startContent={
              <div className="pointer-events-none flex items-center">
                <span className="text-default-400 text-small">$</span>
              </div>
            }
          />
          <div className="mt-2">
            {/* buttons to change annualIncome value to 50k, 65k, 75k, and 90k */}
            <Slider
              size="lg"
              showTooltip
              step={5}
              color="foreground"
              label="Annual Spend"
              showSteps={true}
              getValue={(value) => value + "k USD"}
              maxValue={100}
              minValue={10}
              value={annualIncome / 1000} // Ensure the slider reflects the current state
              className="max-w-md"
              onChange={handleSliderChange}
            />
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-bold text-center">
              Estimated Cashback
            </h2>
            <p className="text-3xl font-bold text-center mt-2">
              {cashbackRewards}
            </p>
            <div className="mt-4 text-center">
              <Button
                as={Link}
                href="https://forms.gle/kcRvqnSBm1XSQVfa7"
                target="__blank"
                className="shadow-[0px_3px_0px_0px_#1a202c] "
                style={{ border: "2px solid #1a202c" }}
                variant="bordered"
              >
                Get Cashback
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
