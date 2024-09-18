import { jsx as _jsx } from "react/jsx-runtime";
import { useState } from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import SwipeableViews from "react-swipeable-views";
import { autoPlay } from "react-swipeable-views-utils";
const AutoPlaySwipeableViews = autoPlay(SwipeableViews);
const images = [
    {
        label: "San Francisco  Oakland Bay Bridge, United States",
        imgPath: "media/slider/img_mes3.jpg",
    },
    // {
    //   label: "San Francisco  Oakland Bay Bridge, United States",
    //   imgPath: "media/slider/img_mes2.png",
    // },
    // Add more image objects as needed
];
function SwipeableTextMobileStepper() {
    const theme = useTheme();
    const [activeStep, setActiveStep] = useState(0);
    const maxSteps = images.length;
    const handleNext = () => {
        setActiveStep((prevActiveStep) => (prevActiveStep + 1) % maxSteps);
    };
    const handleBack = () => {
        setActiveStep((prevActiveStep) => (prevActiveStep - 1 + maxSteps) % maxSteps);
    };
    const handleStepChange = (step) => {
        setActiveStep(step);
    };
    return (_jsx(Box, { sx: { flexGrow: 1, paddingLeft: 2, paddingRight: 2 }, children: _jsx(AutoPlaySwipeableViews, { axis: theme.direction === "rtl" ? "x-reverse" : "x", index: activeStep, onChangeIndex: handleStepChange, enableMouseEvents: true, children: images.map((step, index) => (_jsx("div", { children: Math.abs(activeStep - index) <= 2 ? (_jsx(Box, { component: "img", className: "w-full sm:h-auto md:h-[40vh] xl:h-[65vh]  block overflow-hidden", src: step.imgPath, alt: step.label })) : null }, step.label))) }) }));
}
export default SwipeableTextMobileStepper;
