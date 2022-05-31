import React, {FC, useEffect} from "react";
import {THEME_DARK, THEME_LIGHT} from "./CONSTANTS";
import './style/App.scss'
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
    const [isLastNumber, setLastNumber] = React.useState(true);
    const [isLastRightParentheses, setLastRightParentheses] = React.useState(true);
    const [isLastSecondActuator, setLastSecondActuator] = React.useState(false);
    const [lastStack, setLastStack] = React.useState<LastStackModel>();
    const [isLastActuatorTriangular, setLastActuatorTriangular] = React.useState(false);
    const [leftParenthesesCount, setLeftParenthesesCount] = React.useState(0);
    const [stackText, setStackText] = React.useState("");
    const [resultText, setResultText] = React.useState("");

    useEffect(() => {
        if (isLastNumber || isLastRightParentheses) {
            handleResult();
        }
    }, [stackText])

    const handleClickNumber = (num: number) => {
        const last: LastStackModel = {
            isNumber: true,
            isActuator: false,
            isSecondActuator: false,
            isLeftParentheses: false,
            isRightParentheses: false
        }
        setLastStack(last)
        setStackText(`${stackText}${num}`);
    }

    const handleClickActuator = (act: string) => {
        let stack = stackText
        if (!lastStack?.isNumber) {
            stack = (stack.replace(stack.substring(stack.length - 1), ""))
        }
        setStackText(stack + act);
        setLastSecondActuator(false);
        setLastNumber(false);
        const last: LastStackModel = {
            isNumber: true,
            isActuator: false,
            isSecondActuator: false,
            isLeftParentheses: false,
            isRightParentheses: false
        }
        setLastStack(last)
    }

    const handleClickSecondLevelActuator = (act: string, hasParentheses: boolean, isTriangular: boolean) => {
        setLastRightParentheses(false);
        let stack = stackText
        if (isLastSecondActuator) {
            stack = (stack.replace(stack.substring(stack.length - 1), ""))
        }
        if (isLastNumber) {
            stack = stack + "*"
        }
        setLastActuatorTriangular(isTriangular);
        setStackText(stack + act);
        setLastSecondActuator(true);
        if (hasParentheses) {
            setLeftParenthesesCount(leftParenthesesCount + 1);
        }
        setLastNumber(false);
    }

    const handleClickOpenParentheses = () => {
        setLeftParenthesesCount(leftParenthesesCount + 1);
        setLastRightParentheses(false);
        let stack = stackText
        stack = stack + "*";
        setStackText(stack + "(");
    }

    const handleClickCloseParentheses = () => {
        setLeftParenthesesCount(leftParenthesesCount - 1);
        setLastRightParentheses(true);
        if (isLastActuatorTriangular) {
            setStackText(stackText + " deg)");
        } else {
            setStackText(stackText + ")");
        }
        setLastActuatorTriangular(false);
    }

    const handleClickTransform = () => {
    }

    const handleClickClear = () => {
        setResultText("")
        setStackText("")
    }

    const handleClickDelete = () => {
        let stack = stackText;
        stack = (stack.replace(stack.substring(stack.length - 1), ""));
        setStackText(stack)
    }

    const handleResult = () => {
        if (leftParenthesesCount === 0) {
            setResultText((Math.round((math.evaluate(stackText) ? math.evaluate(stackText) : 0) * 100 + Number.EPSILON) / 100).toString());
        }
    }

    const handleClickResult = () => {
        setResultText(math.evaluate(stackText))
        setStackText(math.evaluate(stackText));
    }


    return (
        <div className={`App ${darkMode ? THEME_DARK : THEME_LIGHT}`}>
            <div className="d-flex flex-column w-100 position-fixed fixed-bottom">
                <div className="w-100 d-flex flex-column">
                    <div className="w-100 fs-4 fw-bold ps-3 pb-2">{resultText}</div>
                    <div className="w-100 fs-5 ps-3 pb-3">{stackText}</div>
                </div>
                <div className="w-100">
                    <div className="d-flex flex-column">
                        <div className="d-flex flex-column w-100 align-items-center justify-content-center">
                            <div className="d-flex flex-row bottomFrame">
                                <CalcButtonComponent onClick={() => handleClickSecondLevelActuator("lg(", true, false)}
                                                     text={"deg"}/>
                                <CalcButtonComponent onClick={() => handleClickSecondLevelActuator("sin(", true, true)}
                                                     text={"sin"}/>
                                <CalcButtonComponent onClick={() => handleClickSecondLevelActuator("cos(", true, true)}
                                                     text={"cos"}/>
                                <CalcButtonComponent onClick={() => handleClickSecondLevelActuator("tan(", true, true)}
                                                     text={"tan"}/>
                            </div>
                            <div className="d-flex flex-row bottomFrame">
                                <CalcButtonComponent onClick={() => handleClickSecondLevelActuator("lg(", true, false)}
                                                     text={"lg"}/>
                                <CalcButtonComponent onClick={() => handleClickSecondLevelActuator("ln(", true, false)}
                                                     text={"ln"}/>
                                <CalcButtonComponent onClick={() => handleClickOpenParentheses()} text={"("}/>
                                <CalcButtonComponent onClick={() => handleClickCloseParentheses()} text={")"}/>
                            </div>
                            <div className="d-flex flex-row bottomFrame">
                                <CalcButtonComponent onClick={() => handleClickClear()} text={"C"}/>
                                <CalcImageButtonComponent onClick={() => handleClickDelete()}>
                                    <BackspaceOutlinedIcon fontSize={"medium"}/>
                                </CalcImageButtonComponent>
                                <CalcButtonComponent onClick={() => handleClickActuator("%")} text={"%"}/>
                                <CalcButtonComponent onClick={() => handleClickActuator("/")} text={"/"}/>
                            </div>
                            <div className="d-flex flex-row bottomFrame">
                                <CalcButtonComponent onClick={() => handleClickNumber(7)} text={"7"}/>
                                <CalcButtonComponent onClick={() => handleClickNumber(8)} text={"8"}/>
                                <CalcButtonComponent onClick={() => handleClickNumber(9)} text={"9"}/>
                                <CalcImageButtonComponent onClick={() => handleClickActuator("*")}>
                                    <CloseOutlinedIcon fontSize={"medium"}/>
                                </CalcImageButtonComponent>
                            </div>
                            <div className="d-flex flex-row bottomFrame">
                                <CalcButtonComponent onClick={() => handleClickNumber(4)} text={"4"}/>
                                <CalcButtonComponent onClick={() => handleClickNumber(5)} text={"5"}/>
                                <CalcButtonComponent onClick={() => handleClickNumber(6)} text={"6"}/>
                                <CalcImageButtonComponent onClick={() => handleClickActuator("-")}>
                                    <RemoveOutlinedIcon fontSize={"medium"}/>
                                </CalcImageButtonComponent>
                            </div>
                            <div className="d-flex flex-row bottomFrame">
                                <CalcButtonComponent onClick={() => handleClickNumber(1)} text={"1"}/>
                                <CalcButtonComponent onClick={() => handleClickNumber(2)} text={"2"}/>
                                <CalcButtonComponent onClick={() => handleClickNumber(3)} text={"3"}/>
                                <CalcImageButtonComponent onClick={() => handleClickActuator("+")}>
                                    <AddOutlinedIcon fontSize={"medium"}/>
                                </CalcImageButtonComponent>
                            </div>
                            <div className="d-flex flex-row bottomFrame">
                                <CalcImageButtonComponent onClick={() => handleClickTransform()}>
                                    <TransformIcon fontSize={"medium"}/>
                                </CalcImageButtonComponent>
                                <CalcButtonComponent onClick={() => handleClickNumber(0)} text={"0"}/>
                                <CalcButtonComponent onClick={() => handleClickActuator(".")} text={"."}/>
                                <CalcImageButtonComponent onClick={() => handleClickResult()}>
                                    <DragHandleOutlinedIcon fontSize={"medium"}/>
                                </CalcImageButtonComponent>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}