import React, {FC, useEffect} from "react";
import {THEME_DARK, THEME_LIGHT} from "./CONSTANTS";
import {CalcButtonComponent} from "./component/calcButton.component";

import {create, all} from 'mathjs'
import {CalcImageButtonComponent} from "./component/calcImageButton.component";
import TransformIcon from '@material-ui/icons/Transform';
import BackspaceOutlinedIcon from '@material-ui/icons/BackspaceOutlined';
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';
import RemoveOutlinedIcon from '@material-ui/icons/RemoveOutlined';
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import DragHandleOutlinedIcon from '@material-ui/icons/DragHandleOutlined';
import {LastStackModel} from "./model/calculator.model";
import {TextareaAutosize} from "@material-ui/core";
import {CSSTransition} from "react-transition-group";
import NightsStayIcon from '@material-ui/icons/NightsStay';
import WbSunnyIcon from '@material-ui/icons/WbSunny';
import {
    getStringCount,
    isLastCharacterDigit,
    removeCharFromString,
    removeLastChar,
    removeLastCharWithIndex
} from "./calculator.utils";
import {getDarkMode, saveDarkMode} from "./calculator.storage";
import {NextPage} from "next";


const Calculator: NextPage = () => {

    const math: any = create(all)
    const [darkMode, setDarkMode] = React.useState<boolean>();
    const [isLastTriangle, setLastTriangle] = React.useState(false);
    const [lastStack, setLastStack] = React.useState<LastStackModel>();
    const [leftParenthesesCount, setLeftParenthesesCount] = React.useState(0);
    const [stackText, setStackText] = React.useState("");
    const [resultText, setResultText] = React.useState("0");
    const [expanded, setExpanded] = React.useState(false);
    const [isDegree, setIsDegree] = React.useState(true);
    const [secondClick, setSecondClick] = React.useState(false);
    const [stackFocused, setStackFocused] = React.useState(false);
    const stackRef = React.useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        setDarkMode(getDarkMode())
        handleResult();
    }, [stackText])

    const handleClickNumber = (num: string) => {
        const last: LastStackModel = {
            name: num,
            isNumber: true,
            isActuator: false,
            isSecondActuator: false,
        }
        setLastStack(last);
        if (stackFocused) {
            setStackFocused(false);
            setStackText(stackText.substring(0, stackRef?.current?.selectionStart) + num + stackText.substring(stackRef?.current?.selectionStart ?? 0));
        } else {
            setStackText(`${stackText}${num}`);
        }
    }

    const handleClickActuator = (act: string) => {
        let stack = stackText
        if (!lastStack?.isNumber) {
            if (lastStack?.isSecondActuator) {
                stack = removeLastCharWithIndex(stack, lastStack?.name.length);
            } else {
                stack = removeLastChar(stack);
            }
        }
        const last: LastStackModel = {
            name: act,
            isNumber: false,
            isActuator: true,
            isSecondActuator: false,
        }
        setLastStack(last);
        if (stackFocused) {
            setStackFocused(false);
            setStackText(stackText.substring(0, stackRef?.current?.selectionStart) + act + stackText.substring(stackRef?.current?.selectionStart ?? 0));
        } else {
            setStackText(stack + act);
        }
    }

    const handleClickSecondLevelActuator = (act: string, hasParentheses: boolean, isTriangular: boolean) => {
        let stack = stackText
        if (lastStack?.isSecondActuator) {
            stack = removeLastCharWithIndex(stack, lastStack?.name.length);
        }
        if (lastStack?.isNumber && stack.length > 0) {
            stack = stack + "*"
        }
        const last: LastStackModel = {
            name: act,
            isNumber: false,
            isActuator: false,
            isSecondActuator: true,
        }
        setLastStack(last);
        setLastTriangle(isTriangular);
        if (hasParentheses) {
            setLeftParenthesesCount(leftParenthesesCount + 1);
        }
        if (stackFocused) {
            setStackFocused(false);
            setStackText(stackText.substring(0, stackRef?.current?.selectionStart) + act + stackText.substring(stackRef?.current?.selectionStart ?? 0));
        } else {
            setStackText(stack + act);
        }
    }

    const handleClickPowerActuator = (act: string, hasParentheses: boolean) => {
        let stack = stackText
        if (lastStack?.isSecondActuator) {
            stack = removeLastCharWithIndex(stack, lastStack?.name.length);
        }
        if (lastStack?.isActuator) {
            stack = removeLastChar(stack);
        }
        const last: LastStackModel = {
            name: act,
            isNumber: false,
            isActuator: false,
            isSecondActuator: true,
        }
        setLastStack(last);
        if (hasParentheses) {
            setLeftParenthesesCount(leftParenthesesCount + 1);
        }
        if (stackFocused) {
            setStackFocused(false);
            setStackText(stackText.substring(0, stackRef?.current?.selectionStart) + act + stackText.substring(stackRef?.current?.selectionStart ?? 0));
        } else {
            setStackText(stack + act);
        }
    }

    const handleClickOpenParentheses = () => {
        setLeftParenthesesCount(leftParenthesesCount + 1);
        setStackText(stackText + "*(");
    }

    const handleClickCloseParentheses = () => {
        setLeftParenthesesCount(leftParenthesesCount - 1);
        setLastTriangle(false);
        if (isLastTriangle && isDegree) {
            setStackText(stackText + " deg)");
        } else {
            setStackText(stackText + ")");
        }
    }

    const handleClickTransform = () => {
        setExpanded(!expanded);
    }

    const handleClickClear = () => {
        setLeftParenthesesCount(0);
        setResultText("")
        setStackText("")
    }



    const handleClickDelete = () => {
        let stack = stackText;
        if (stackFocused) {
            setStackFocused(false);
            stack = removeCharFromString(stack, (stackRef?.current?.selectionStart ?? 1) - 1);
        } else {
            stack = removeLastChar(stack);
        }
        setLeftParenthesesCount(getStringCount(stack, "("));
        if (stack.trim() == "") {
            setResultText("0")
        }
        setStackText(stack);
    }


    const handleResult = () => {
        if (leftParenthesesCount === 0 &&
            (isLastCharacterDigit(stackText.substring(stackText.length - 1)) || stackText.substring(stackText.length - 1) == ")")) {
            calculateResult(false);
        }
    }

    function calculateResult(updateStack: boolean) {
        try {
            const stack = stackText.replace("π", "PI")
                .replace("√", "sqrt")
                .replace("ln(", "log(e,")
                .replace("log(", "log(10,");
            const result = (Math.round((math.evaluate(stack) ? math.evaluate(stack) : 0) * 1000 + Number.EPSILON) / 1000).toString();
            setResultText(result);
            if (updateStack) {
                setStackText(result);
            }
        } catch (e) {
            setResultText("خطا");
        }
    }

    const clickResult = () => {
        calculateResult(true);
    }

    const onChangeTitle = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setStackText(event.currentTarget.value);
    };


    function handleClickDegreeRadian() {
        setIsDegree(!isDegree);
    }

    function handleClickSecondItem() {
        setSecondClick(!secondClick);
    }

    function changeDarkMode(isDark:boolean) {
        setDarkMode(isDark);
        saveDarkMode(isDark);
    }

    return (
        <div className={`App ${darkMode ? THEME_DARK : THEME_LIGHT}`}>
            <div
                className="d-flex flex-column w-100 position-fixed fixed-bottom align-items-center justify-content-center">
                <div className="d-flex flex-column sideFrame position-relative">
                    {darkMode ?
                        <WbSunnyIcon className="position-absolute top-0 end-0" fontSize={"large"}
                                     onClick={() => changeDarkMode(false)}/>
                        :
                        <NightsStayIcon className="position-absolute top-0 end-0" fontSize={"large"}
                                        onClick={() => changeDarkMode(true)}/>
                    }
                    <div className="w-100 d-flex flex-column container-md">
                        <div className="w-100 fs-4 ps-2 pe-2 pb-2 mText">{resultText}</div>
                        <TextareaAutosize ref={stackRef} value={stackText} aria-label={"result"}
                                          className="w-100 mb-2 ps-2 pe-2 text-start d-flex stackText fs-5 textarea mText"
                                          onChange={onChangeTitle} onFocus={()=>setStackFocused(true)}/>
                    </div>
                    <div className="d-flex flex-column align-items-center justify-content-center w-100 ps-1 pe-1">
                        <div className="d-flex flex-row rowHeight">
                            <CSSTransition
                                in={expanded}
                                timeout={500}
                                classNames="fade"
                                unmountOnExit
                                appear>
                                <CalcButtonComponent colored={secondClick} onClick={() => handleClickSecondItem()}
                                                     text={"2nd"}/>
                            </CSSTransition>
                            <CalcButtonComponent onClick={() => handleClickDegreeRadian()}
                                                 text={isDegree ? "deg" : "rad"}/>
                            {secondClick ?
                                <CalcImageButtonComponent
                                    onClick={() => handleClickSecondLevelActuator("asin(", true, false)}>
                                    sin<sup>-1</sup>
                                </CalcImageButtonComponent>
                                :
                                <CalcButtonComponent onClick={() => handleClickSecondLevelActuator("sin(", true, true)}
                                                     text={"sin"}/>
                            }
                            {secondClick ?
                                <CalcImageButtonComponent
                                    onClick={() => handleClickSecondLevelActuator("acos(", true, false)}>
                                    cos<sup>-1</sup>
                                </CalcImageButtonComponent>
                                :
                                <CalcButtonComponent onClick={() => handleClickSecondLevelActuator("cos(", true, true)}
                                                     text={"cos"}/>
                            }
                            {secondClick ?
                                <CalcImageButtonComponent
                                    onClick={() => handleClickSecondLevelActuator("atan(", true, false)}>
                                    tan<sup>-1</sup>
                                </CalcImageButtonComponent>
                                :
                                <CalcButtonComponent onClick={() => handleClickSecondLevelActuator("tan(", true, true)}
                                                     text={"tan"}/>
                            }
                        </div>
                        <div className="d-flex flex-row rowHeight">
                            <CSSTransition
                                in={expanded}
                                timeout={500}
                                classNames="fade"
                                unmountOnExit
                                appear>
                                <CalcImageButtonComponent
                                    onClick={() => handleClickPowerActuator("^(", true)}>
                                    x<sup>y</sup>
                                </CalcImageButtonComponent>
                            </CSSTransition>
                            <CalcButtonComponent onClick={() => handleClickSecondLevelActuator("log(", true, false)}
                                                 text={"lg"}/>
                            <CalcButtonComponent onClick={() => handleClickSecondLevelActuator("ln(", true, false)}
                                                 text={"ln"}/>
                            <CalcButtonComponent onClick={() => handleClickOpenParentheses()} text={"("}/>
                            <CalcButtonComponent onClick={() => handleClickCloseParentheses()} text={")"}/>
                        </div>
                        <div className="d-flex flex-row rowHeight">
                            <CSSTransition
                                in={expanded}
                                timeout={500}
                                classNames="fade"
                                unmountOnExit
                                appear>
                                <CalcButtonComponent onClick={() => handleClickSecondLevelActuator("√(", true, false)}
                                                     text={"√x"}/>
                            </CSSTransition>
                            <CalcButtonComponent colored={true} onClick={() => handleClickClear()} text={"C"}/>
                            <CalcImageButtonComponent onClick={() => handleClickDelete()}>
                                <BackspaceOutlinedIcon className="orangeColor" fontSize={"medium"}/>
                            </CalcImageButtonComponent>
                            <CalcButtonComponent colored={true} onClick={() => handleClickActuator("%")} text={"%"}/>
                            <CalcButtonComponent colored={true} onClick={() => handleClickActuator("/")} text={"/"}/>
                        </div>
                        <div className="d-flex flex-row rowHeight">
                            <CSSTransition
                                in={expanded}
                                timeout={500}
                                classNames="fade"
                                unmountOnExit
                                appear>
                                <CalcButtonComponent onClick={() =>
                                    handleClickNumber("!")} text={"x!"}/>
                            </CSSTransition>
                            <CalcButtonComponent bold={true} onClick={() => handleClickNumber("7")} text={"7"}/>
                            <CalcButtonComponent bold={true} onClick={() => handleClickNumber("8")} text={"8"}/>
                            <CalcButtonComponent bold={true} onClick={() => handleClickNumber("9")} text={"9"}/>
                            <CalcImageButtonComponent onClick={() => handleClickActuator("*")}>
                                <CloseOutlinedIcon className="orangeColor" fontSize={"medium"}/>
                            </CalcImageButtonComponent>
                        </div>
                        <div className="d-flex flex-row rowHeight">
                            <CSSTransition
                                in={expanded}
                                timeout={500}
                                classNames="fade"
                                unmountOnExit
                                appear>
                                <CalcButtonComponent
                                    onClick={() => handleClickPowerActuator("^(-1)", false)}
                                    text={"1/x"}/>
                            </CSSTransition>
                            <CalcButtonComponent bold={true} onClick={() => handleClickNumber("4")} text={"4"}/>
                            <CalcButtonComponent bold={true} onClick={() => handleClickNumber("5")} text={"5"}/>
                            <CalcButtonComponent bold={true} onClick={() => handleClickNumber("6")} text={"6"}/>
                            <CalcImageButtonComponent onClick={() => handleClickActuator("-")}>
                                <RemoveOutlinedIcon className="orangeColor" fontSize={"medium"}/>
                            </CalcImageButtonComponent>
                        </div>
                        <div className="d-flex flex-row rowHeight">
                            <CSSTransition
                                in={expanded}
                                timeout={500}
                                classNames="fade"
                                unmountOnExit
                                appear>
                                <CalcButtonComponent onClick={() => handleClickNumber("π")}
                                                     text={"π"}/>
                            </CSSTransition>
                            <CalcButtonComponent bold={true} onClick={() => handleClickNumber("1")} text={"1"}/>
                            <CalcButtonComponent bold={true} onClick={() => handleClickNumber("2")} text={"2"}/>
                            <CalcButtonComponent bold={true} onClick={() => handleClickNumber('3')} text={"3"}/>
                            <CalcImageButtonComponent onClick={() => handleClickActuator("+")}>
                                <AddOutlinedIcon className="orangeColor" fontSize={"medium"}/>
                            </CalcImageButtonComponent>
                        </div>
                        <div className="d-flex flex-row rowHeight">
                            <CSSTransition
                                in={expanded}
                                timeout={500}
                                classNames="fade"
                                unmountOnExit
                                appear>
                                <CalcButtonComponent onClick={() => handleClickNumber("e")}
                                                     text={"e"}/>
                            </CSSTransition>
                            <CalcImageButtonComponent onClick={() => handleClickTransform()}>
                                <TransformIcon fontSize={"medium"} className={expanded ? "orangeColor" : ""}/>
                            </CalcImageButtonComponent>
                            <CalcButtonComponent bold={true} onClick={() => handleClickNumber("0")} text={"0"}/>
                            <CalcButtonComponent bold={true} onClick={() => handleClickNumber(".")} text={"."}/>
                            <CalcImageButtonComponent onClick={() => clickResult()}>
                                <DragHandleOutlinedIcon className="orangeColor" fontSize={"medium"}/>
                            </CalcImageButtonComponent>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Calculator