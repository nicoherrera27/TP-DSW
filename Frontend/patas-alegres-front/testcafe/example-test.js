import { Selector } from "testcafe";

fixture`My Angular App Tests`.page("http://localhost:4200");

test("Check if page loads", async (t) => {
  await t
    .expect(Selector("h1").innerText)
    .eql("Bienvenidos a patas-alegres-front!!!");
});
