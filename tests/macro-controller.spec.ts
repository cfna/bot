import { MacroController } from "../src"

describe('MacroController Tests', () => {

    test('New instance wihtout options should use work with all defaults', () => {
        const macroController = new MacroController()
        expect(macroController).toBeDefined()
    })
})