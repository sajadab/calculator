import React, {FC, useEffect} from "react";
import {THEME_DARK, THEME_LIGHT} from "./CONSTANTS";
import './style/App.scss'
import {CalcButtonComponent} from "./component/calcButton.component";

import {create, all, number} from 'mathjs'
import {CalcImageButtonComponent} from "./component/calcImageButton.component";
import TransformIcon from '@material-ui/icons/Transform';
import BackspaceOutlinedIcon from '@material-ui/icons/BackspaceOutlined';
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';
import RemoveOutlinedIcon from '@material-ui/icons/RemoveOutlined';
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import DragHandleOutlinedIcon from '@material-ui/icons/DragHandleOutlined';
import {LastStackModel} from "./model/calculator.model";
import {Fade, TextareaAutosize} from "@material-ui/core";


export const Calculator: FC = () => {

    // const config = {
    //     angles: 'deg',
    // }
    // let replacements: any = []
    const math: any = create(all)

    // let replacements:any = {}
    //
    // // our extended configuration options
    // const config = {
    //     angles: 'deg' // 'rad', 'deg', 'grad'
    // }
    //
    // // create trigonometric functions replacing the input depending on angle config
    // const fns1 = ['sin', 'cos', 'tan', 'sec', 'cot', 'csc']
    // fns1.forEach(function(name) {
    //     const fn = math[name] // the original function
    //
    //     const fnNumber = function (x:any) {
    //         // convert from configured type of angles to radians
    //         switch (config.angles) {
    //             case 'deg':
    //                 return fn(x / 360 * 2 * Math.PI)
    //             case 'grad':
    //                 return fn(x / 400 * 2 * Math.PI)
    //             default:
    //                 return fn(x)
    //         }
    //     }
    //
    //     // create a typed-function which check the input types
    //     replacements[name] = math.typed(name, {
    //         'number': fnNumber,
    //         'Array | Matrix': function (x:any) {
    //             return math.map(x, fnNumber)
    //         }
    //     })
    // })


    // math.config = config
    // math.import(numeric, {wrap: true, silent: true})
    // // create trigonometric functions replacing the input depending on angle config
    // const fns1 = ['sin', 'cos', 'tan', 'sec', 'cot', 'csc']
    // fns1.forEach(function (name: string) {
    //     const fn = math[name] // the original function
    //
    //     const fnNumber = function (x: any) {
    //         // convert from configured type of angles to radians
    //         switch (config.angles) {
    //             case 'deg':
    //                 return fn(x / 360 * 2 * Math.PI)
    //             case 'grad':
    //                 return fn(x / 400 * 2 * Math.PI)
    //             default:
    //                 return fn(x)
    //         }
    //     }
    //
    //     // create a typed-function which check the input types
    //     replacements[name] = math.typed(name, {
    //         'number': fnNumber,
    //         'Array | Matrix': function (x: any) {
    //             return math.map(x, fnNumber)
    //         }
    //     })
    // })
    // //
    // // // import all replacements into math.js, override existing trigonometric functions
    // math.import(replacements);
    // console.log("test")
    // console.log(math.sin("30"))

    const [darkMode, setDarkMode] = React.useState<boolean>(false);
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
        handleResult();
    }, [stackText])

    const handleClickNumber = (num: string) => {
        const last: LastStackModel = {
            name: num,
            isNumber: true,
            isActuator: false,
            isSecondActuator: false,
            isLeftParentheses: false,
            isRightParentheses: false,
            isTriangular: false,
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
            isLeftParentheses: false,
            isRightParentheses: false,
            isTriangular: false
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
            isLeftParentheses: false,
            isRightParentheses: false,
            isTriangular: isTriangular
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

    const handleClickPowerActuator = (act: string, hasParentheses: boolean, isTriangular: boolean) => {
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
            isLeftParentheses: false,
            isRightParentheses: false,
            isTriangular: isTriangular
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

    function removeLastChar(str: string) {
        return str.substring(0, str.length - 1);
    }

    function removeLastCharWithIndex(str: string, index: number) {
        return str.substring(0, str.length - index);
    }

    function removeCharFromString(str: string, index: number) {
        return str.substring(0, index) + str.substring(index + 1);
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
        // setLastRightParentheses(getStringCount(stack, ")") == getStringCount(stack, "("));
        // setLastNumber(isLastCharacterDigit(stack.substring(stack.length - 1)));
        if (stack.trim() == "") {
            setResultText("0")
        }
        setStackText(stack);
    }

    function isLastCharacterDigit(str: string): boolean {
        return /^\d+$/.test(str);
    }

    function getStringCount(str: string, char: string): number {
        let result = 0, i = 0;
        for (i; i < str.length; i++) if (str[i] == char) result++;
        return result;
    }

    const handleResult = () => {
        if (leftParenthesesCount === 0 && lastStack?.isNumber) {
            calculateResult(false);
        }
    }

    function calculateResult(updateStack: boolean) {
        try {
            const stack = stackText.replace("π", "PI")
                .replace("√", "sqrt")
                .replace("ln(", "log(e,");
            const result = (Math.round((math.evaluate(stack) ? math.evaluate(stack) : 0) * 100 + Number.EPSILON) / 100).toString();
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

    const onFocusChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setStackFocused(true);
    };


    function handleClickDegreeRadian() {
        setIsDegree(!isDegree);
    }

    return (
        <div className={`App ${darkMode ? THEME_DARK : THEME_LIGHT}`}>
            <div
                className="d-flex flex-column w-100 position-fixed fixed-bottom align-items-center justify-content-center">
                <div className="d-flex flex-column sideFrame">
                    <div className="w-100 d-flex flex-column container-md">
                        <div className="w-100 fs-4 ps-2 pe-2 pb-2">{resultText}</div>
                        <TextareaAutosize ref={stackRef} value={stackText}
                                          className="w-100 mb-2 ps-2 pe-2 text-start d-flex stackText fs-5 textarea"
                                          onChange={onChangeTitle} onFocus={onFocusChange}/>
                    </div>
                    <div className="d-flex flex-column align-items-center justify-content-center w-100 ps-1 pe-1">
                        <div className="d-flex flex-row rowHeight">
                            {expanded ?
                                <CalcButtonComponent onClick={() => handleClickSecondLevelActuator("lg(", true, false)}
                                                     text={"2nd"}/>
                                : null}
                            <CalcButtonComponent onClick={() => handleClickDegreeRadian()}
                                                 text={isDegree ? "deg" : "rad"}/>
                            <CalcButtonComponent onClick={() => handleClickSecondLevelActuator("sin(", true, true)}
                                                 text={"sin"}/>
                            <CalcButtonComponent onClick={() => handleClickSecondLevelActuator("cos(", true, true)}
                                                 text={"cos"}/>
                            <CalcButtonComponent onClick={() => handleClickSecondLevelActuator("tan(", true, true)}
                                                 text={"tan"}/>
                        </div>
                        <div className="d-flex flex-row rowHeight">
                            {expanded ?
                                <CalcImageButtonComponent
                                    onClick={() => handleClickPowerActuator("^(", true, false)}>
                                    x<sup>y</sup>
                                </CalcImageButtonComponent>
                                : null}
                            <CalcButtonComponent onClick={() => handleClickSecondLevelActuator("log(", true, false)}
                                                 text={"lg"}/>
                            <CalcButtonComponent onClick={() => handleClickSecondLevelActuator("ln(", true, false)}
                                                 text={"ln"}/>
                            <CalcButtonComponent onClick={() => handleClickOpenParentheses()} text={"("}/>
                            <CalcButtonComponent onClick={() => handleClickCloseParentheses()} text={")"}/>
                        </div>
                        <div className="d-flex flex-row rowHeight">
                            {expanded ?
                                <CalcButtonComponent onClick={() => handleClickSecondLevelActuator("√(", true, false)}
                                                     text={"√x"}/>
                                : null}
                            <CalcButtonComponent colored={true} onClick={() => handleClickClear()} text={"C"}/>
                            <CalcImageButtonComponent onClick={() => handleClickDelete()}>
                                <BackspaceOutlinedIcon className="orangeColor" fontSize={"medium"}/>
                            </CalcImageButtonComponent>
                            <CalcButtonComponent colored={true} onClick={() => handleClickActuator("%")} text={"%"}/>
                            <CalcButtonComponent colored={true} onClick={() => handleClickActuator("/")} text={"/"}/>
                        </div>
                        <div className="d-flex flex-row rowHeight">
                            {expanded ?
                                <CalcButtonComponent onClick={() =>
                                    handleClickNumber("!")} text={"x!"}/>
                                : null}
                            <CalcButtonComponent bold={true} onClick={() => handleClickNumber("7")} text={"7"}/>
                            <CalcButtonComponent bold={true} onClick={() => handleClickNumber("8")} text={"8"}/>
                            <CalcButtonComponent bold={true} onClick={() => handleClickNumber("9")} text={"9"}/>
                            <CalcImageButtonComponent onClick={() => handleClickActuator("*")}>
                                <CloseOutlinedIcon className="orangeColor" fontSize={"medium"}/>
                            </CalcImageButtonComponent>
                        </div>
                        <div className="d-flex flex-row rowHeight">
                            {expanded ?
                                <CalcButtonComponent
                                    onClick={() => handleClickPowerActuator("^(-1)", false, false)}
                                    text={"1/x"}/>
                                : null}
                            <CalcButtonComponent bold={true} onClick={() => handleClickNumber("4")} text={"4"}/>
                            <CalcButtonComponent bold={true} onClick={() => handleClickNumber("5")} text={"5"}/>
                            <CalcButtonComponent bold={true} onClick={() => handleClickNumber("6")} text={"6"}/>
                            <CalcImageButtonComponent onClick={() => handleClickActuator("-")}>
                                <RemoveOutlinedIcon className="orangeColor" fontSize={"medium"}/>
                            </CalcImageButtonComponent>
                        </div>
                        <div className="d-flex flex-row rowHeight">
                            {expanded ?
                                <CalcButtonComponent onClick={() => handleClickNumber("π")}
                                                     text={"π"}/>
                                : null}
                            <CalcButtonComponent bold={true} onClick={() => handleClickNumber("1")} text={"1"}/>
                            <CalcButtonComponent bold={true} onClick={() => handleClickNumber("2")} text={"2"}/>
                            <CalcButtonComponent bold={true} onClick={() => handleClickNumber('3')} text={"3"}/>
                            <CalcImageButtonComponent onClick={() => handleClickActuator("+")}>
                                <AddOutlinedIcon className="orangeColor" fontSize={"medium"}/>
                            </CalcImageButtonComponent>
                        </div>
                        <div className="d-flex flex-row rowHeight">
                            {expanded ?
                                <CalcButtonComponent onClick={() => handleClickNumber("e")}
                                                     text={"e"}/>
                                : null}
                            <CalcImageButtonComponent onClick={() => handleClickTransform()}>
                                <TransformIcon fontSize={"medium"} className={expanded ? "orangeColor" : ""}/>
                            </CalcImageButtonComponent>
                            <CalcButtonComponent onClick={() => handleClickNumber("0")} text={"0"}/>
                            <CalcButtonComponent onClick={() => handleClickNumber(".")} text={"."}/>
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