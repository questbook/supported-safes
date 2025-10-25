import { SupportedPayouts } from "../index";

test("SupportedPayouts", () => {
    const apiKey = process.env.SAFE_API_KEY; // Optional: can be undefined
    expect(new SupportedPayouts().getSafe(900001, "", apiKey)).toBeDefined();
});
