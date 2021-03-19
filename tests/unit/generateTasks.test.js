
const gen = require("../../import-lib/generateTasks")
const largeDiagrams = require("./testDiagrams")

test("Empty String as Input", () => {
    gen("").catch(resp => {
        expect(resp.name).toEqual("MalformedDiagramError")
    })
})

test("Undefined as Input", () => {
    gen(undefined).catch(resp => {
        expect(resp.name).toEqual("MalformedDiagramError")
    })
})

test("Empty Diagram as Input", () => {
    diagram = {}
    gen(diagram).catch(resp => {
        expect(resp.name).toEqual("MalformedDiagramError")
    })
})


test("Partial Diagram as Input", () => {
    diagram = {"project": {"name": "test"}}
    gen(diagram).catch(resp => {
        expect(resp.name).toEqual("MalformedDiagramError")
    })
})

test("Valid Diagram as Input", () => {
    diagram = JSON.parse(largeDiagrams.getValid())
    gen(diagram).then(resp => {
        expect(resp).toStrictEqual(JSON.parse(largeDiagrams.getValidResp()))
    })
})

test("Extra Key in Diagram", () => {
    diagram = JSON.parse(largeDiagrams.getExtraKey())
    gen(diagram).catch(resp => {
        expect(resp.name).toEqual("MalformedDiagramError")
    })
})

test("Missing Name in Diagram", () => {
    diagram = JSON.parse(largeDiagrams.getMissingName())
    gen(diagram).catch(resp => {
        expect(resp.name).toEqual("MalformedDiagramError")
    })
})

test("Missing Nodes in Diagram", () => {
    diagram = JSON.parse(largeDiagrams.getMissingNodes())
    gen(diagram).catch(resp => {
        expect(resp.name).toEqual("MalformedDiagramError")
    })
})