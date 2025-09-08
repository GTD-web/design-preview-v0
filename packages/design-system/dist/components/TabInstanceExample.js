"use client";
import React from "react";
import { useTabInstance, useTabInstanceLocalStorage, useCurrentTabInfo, } from "../hooks/useTabInstance";
/**
 * Tab Instance 기능을 보여주는 예시 컴포넌트
 * 각 탭 인스턴스가 독립적인 상태를 유지하는 것을 보여줍니다.
 */
export function TabInstanceExample() {
    // 현재 탭 정보 가져오기
    const { tabId, instanceKey, isUniqueTab, basePath, fullPath } = useCurrentTabInfo();
    // 탭 인스턴스별 메모리 상태 (페이지를 벗어나면 사라짐)
    const [counter, setCounter] = useTabInstance(0, "counter");
    const [inputValue, setInputValue] = useTabInstance("", "input");
    // 탭 인스턴스별 로컬 스토리지 상태 (브라우저를 닫아도 유지됨)
    const [notes, setNotes] = useTabInstanceLocalStorage("notes", "");
    const [favoriteColor, setFavoriteColor] = useTabInstanceLocalStorage("favoriteColor", "#3b82f6");
    return (React.createElement("div", { className: "p-6 space-y-6" },
        React.createElement("div", { className: "bg-white rounded-lg shadow-lg p-6" },
            React.createElement("h2", { className: "text-2xl font-bold mb-4" }, "\uD0ED \uC778\uC2A4\uD134\uC2A4 \uC608\uC2DC"),
            React.createElement("div", { className: "bg-gray-50 rounded-lg p-4 mb-6" },
                React.createElement("h3", { className: "font-semibold mb-3" }, "\uD604\uC7AC \uD0ED \uC815\uBCF4"),
                React.createElement("div", { className: "space-y-2 text-sm" },
                    React.createElement("div", null,
                        React.createElement("strong", null, "\uD0ED ID:"),
                        " ",
                        React.createElement("code", { className: "bg-gray-200 px-2 py-1 rounded" }, tabId || "없음")),
                    React.createElement("div", null,
                        React.createElement("strong", null, "\uC778\uC2A4\uD134\uC2A4 \uD0A4:"),
                        " ",
                        React.createElement("code", { className: "bg-gray-200 px-2 py-1 rounded" }, instanceKey)),
                    React.createElement("div", null,
                        React.createElement("strong", null, "\uACE0\uC720 \uD0ED \uC5EC\uBD80:"),
                        " ",
                        React.createElement("span", { className: `px-2 py-1 rounded text-xs ${isUniqueTab
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"}` }, isUniqueTab ? "고유 탭" : "일반 탭")),
                    React.createElement("div", null,
                        React.createElement("strong", null, "\uAE30\uBCF8 \uACBD\uB85C:"),
                        " ",
                        React.createElement("code", { className: "bg-gray-200 px-2 py-1 rounded" }, basePath)),
                    React.createElement("div", null,
                        React.createElement("strong", null, "\uC804\uCCB4 \uACBD\uB85C:"),
                        " ",
                        React.createElement("code", { className: "bg-gray-200 px-2 py-1 rounded" }, fullPath)))),
            React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6" },
                React.createElement("div", { className: "bg-blue-50 rounded-lg p-4" },
                    React.createElement("h3", { className: "font-semibold text-blue-800 mb-3" }, "\uBA54\uBAA8\uB9AC \uC0C1\uD0DC (\uD398\uC774\uC9C0\uBCC4 \uB3C5\uB9BD)"),
                    React.createElement("div", { className: "mb-4" },
                        React.createElement("label", { className: "block text-sm font-medium mb-2" },
                            "\uCE74\uC6B4\uD130: ",
                            counter),
                        React.createElement("div", { className: "flex space-x-2" },
                            React.createElement("button", { onClick: () => setCounter((prev) => prev + 1), className: "px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600" }, "+1"),
                            React.createElement("button", { onClick: () => setCounter((prev) => prev - 1), className: "px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600" }, "-1"),
                            React.createElement("button", { onClick: () => setCounter(0), className: "px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600" }, "\uCD08\uAE30\uD654"))),
                    React.createElement("div", null,
                        React.createElement("label", { className: "block text-sm font-medium mb-2" }, "\uC785\uB825\uAC12 (\uD0ED\uBCC4 \uB3C5\uB9BD)"),
                        React.createElement("input", { type: "text", value: inputValue, onChange: (e) => setInputValue(e.target.value), placeholder: "\uAC01 \uD0ED\uB9C8\uB2E4 \uB2E4\uB978 \uAC12\uC744 \uC785\uB825\uD574\uBCF4\uC138\uC694", className: "w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" }),
                        React.createElement("p", { className: "text-xs text-gray-500 mt-1" },
                            "\uD604\uC7AC \uAC12: \"",
                            inputValue,
                            "\""))),
                React.createElement("div", { className: "bg-green-50 rounded-lg p-4" },
                    React.createElement("h3", { className: "font-semibold text-green-800 mb-3" }, "\uC601\uAD6C \uC800\uC7A5 \uC0C1\uD0DC (\uBE0C\uB77C\uC6B0\uC800 \uC7AC\uC2DC\uC791 \uD6C4\uC5D0\uB3C4 \uC720\uC9C0)"),
                    React.createElement("div", { className: "mb-4" },
                        React.createElement("label", { className: "block text-sm font-medium mb-2" },
                            "\uBA54\uBAA8 (",
                            notes.length,
                            "\uAE00\uC790)"),
                        React.createElement("textarea", { value: notes, onChange: (e) => setNotes(e.target.value), placeholder: "\uC774 \uD0ED\uB9CC\uC758 \uBA54\uBAA8\uB97C \uC791\uC131\uD574\uBCF4\uC138\uC694", className: "w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500", rows: 3 })),
                    React.createElement("div", null,
                        React.createElement("label", { className: "block text-sm font-medium mb-2" }, "\uC120\uD638 \uC0C9\uC0C1"),
                        React.createElement("div", { className: "flex items-center space-x-2" },
                            React.createElement("input", { type: "color", value: favoriteColor, onChange: (e) => setFavoriteColor(e.target.value), className: "w-12 h-8 border border-gray-300 rounded" }),
                            React.createElement("span", { className: "text-sm text-gray-600" }, favoriteColor)),
                        React.createElement("div", { className: "w-full h-4 rounded mt-2", style: { backgroundColor: favoriteColor } })))),
            React.createElement("div", { className: "mt-6 p-4 bg-yellow-50 rounded-lg" },
                React.createElement("h4", { className: "font-semibold text-yellow-800 mb-2" }, "\uD83D\uDCA1 \uC0AC\uC6A9 \uBC29\uBC95"),
                React.createElement("ul", { className: "text-sm text-yellow-700 space-y-1" },
                    React.createElement("li", null, "\u2022 \uC0AC\uC774\uB4DC\uBC14\uC5D0\uC11C \uAC19\uC740 \uD398\uC774\uC9C0(\uC608: \uBD84\uC11D, \uB300\uC2DC\uBCF4\uB4DC)\uB97C \uC5EC\uB7EC \uBC88 \uD074\uB9AD\uD558\uC5EC \uC911\uBCF5 \uD0ED\uC744 \uC0DD\uC131\uD558\uC138\uC694"),
                    React.createElement("li", null, "\u2022 \uAC01 \uD0ED\uC5D0\uC11C \uC704\uC758 \uAC12\uB4E4\uC744 \uBCC0\uACBD\uD558\uACE0 \uB2E4\uB978 \uD0ED\uC73C\uB85C \uC774\uB3D9\uD574\uBCF4\uC138\uC694"),
                    React.createElement("li", null, "\u2022 \uBA54\uBAA8\uB9AC \uC0C1\uD0DC\uB294 \uD0ED\uBCC4\uB85C \uB3C5\uB9BD\uC801\uC73C\uB85C \uC720\uC9C0\uB418\uACE0, \uC601\uAD6C \uC800\uC7A5 \uC0C1\uD0DC\uB294 \uBE0C\uB77C\uC6B0\uC800\uB97C \uB2EB\uC544\uB3C4 \uC720\uC9C0\uB429\uB2C8\uB2E4"),
                    React.createElement("li", null, "\u2022 F5\uB85C \uD398\uC774\uC9C0\uB97C \uC0C8\uB85C\uACE0\uCE68\uD558\uACE0 \uD0ED \uAC04 \uC774\uB3D9\uD574\uBCF4\uC138\uC694"))),
            React.createElement("details", { className: "mt-4" },
                React.createElement("summary", { className: "cursor-pointer text-sm font-medium text-gray-600" }, "\uAC1C\uBC1C\uC790 \uC815\uBCF4"),
                React.createElement("div", { className: "mt-2 p-3 bg-gray-100 rounded text-xs font-mono" },
                    React.createElement("p", null,
                        React.createElement("strong", null, "useTabInstance:"),
                        " \uD0ED\uBCC4 \uBA54\uBAA8\uB9AC \uC0C1\uD0DC \uAD00\uB9AC"),
                    React.createElement("p", null,
                        React.createElement("strong", null, "useTabInstanceLocalStorage:"),
                        " \uD0ED\uBCC4 \uC601\uAD6C \uC800\uC7A5"),
                    React.createElement("p", null,
                        React.createElement("strong", null, "useCurrentTabInfo:"),
                        " \uD604\uC7AC \uD0ED \uBA54\uD0C0\uB370\uC774\uD130"))))));
}
export default TabInstanceExample;
