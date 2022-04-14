const output = document.getElementById("output");
const code = document.getElementById("code");
var boilerplateCode = "";
var test_cases = null;


function addToOutput(s) {
    output.value += s + "\n";
}

output.value = "Initializing please wait...\n";

async function main() {
    let pyodide = await loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.19.1/full/",
    });
    pyodide.runPython(`import math`);
    output.value += "Ready!\n";
    return pyodide;
}

let pyodideReadyPromise = main();

async function evaluatePython() {
    let pyodide = await pyodideReadyPromise;
    try {
        pyodide.runPython(` l = {} `);
        let escapedCode = JSON.stringify(code.value);
        pyodide.runPython(`exec( ${escapedCode}, {'math':math}, l ) `);
    } catch (err) {
        addToOutput(err);
        return;
    }

    var proxy = pyodide.globals.get('l').get('dist');
    var passesTestCases = true;

    function matchingAnswers(a,b){
        if (a === b){
            return true;
        }
        const atype = typeof a;
        const btype = typeof b;

        if ( atype !== btype){
            return false;
        }

        if( atype === 'number' && btype === 'number' && Math.abs(a-b) < 0.0001) {
            return true;
        }
        return false
    }

    for (var testCase of test_cases){
        const testArgs = testCase.slice(0,-1);
        const expectedAns = testCase.slice(-1).pop();
        var ans = proxy.apply(null,testArgs)

        console.log(ans,expectedAns)

        if (ans === undefined || !matchingAnswers(ans,expectedAns))
        {
            passesTestCases = false;
            break
        }
    }

    if (passesTestCases) {
        addToOutput("🎉 Tests Passed 🎉");
    } else {
        addToOutput("Tests failed");
    }

}

fetch('./data/level01.json')
  .then(response => response.json())
  .then(data => init(data) );

function resetCode() {
    code.value = boilerplateCode;
}

function init(data){
    boilerplateCode+= data['boilerplate_code'];
    test_cases = data['test_cases'];
    resetCode();
}
