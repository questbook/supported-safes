import { SupportedSafes } from "../index";

test("SupportedSafes", () => {
    expect(new SupportedSafes().getSafe(900001, "")).toBeDefined();  
});