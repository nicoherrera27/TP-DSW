import { Selector } from "testcafe";

fixture`Pruebas de Zonas`.page`http://localhost:4200`;

test("Verificar que el botón Zona muestra la lista correcta de zonas", async (t) => {
  const zoneLink = Selector("a").withText("Zona");

  await t.click(zoneLink);

  const zoneList = Selector("ul li h2");

  const zones = ["Este", "Oeste", "Norte", "Sur"];

  for (let i = 0; i < zones.length; i++) {
    await t.expect(zoneList.nth(i).innerText).eql(zones[i]);
  }
});

test('Eliminar la zona "Sur"', async (t) => {
  const zoneLink = Selector("a").withText("Zona");
  await t.click(zoneLink);

  const zonaSur = Selector("h2").withText("Sur");

  const botonEliminar = zonaSur
    .parent("a")
    .parent("div")
    .sibling("div")
    .find("button.btn.btn-danger");

  await t
    .hover(zonaSur)
    .click(botonEliminar);

  await t.eval(() => location.reload(true));

  await t.expect(Selector("h2").withText("Sur").exists).notOk();

  await t.navigateTo("/zone");

  await t.expect(Selector("h2").withText("Sur").exists).notOk();
});

test('Crear la zona "Sur"', async (t) => {
  const zoneLink = Selector("a").withText("Zona");
  await t.click(zoneLink);

  const inputName = Selector("input#zone-name");
  await t.typeText(inputName, "Sur");

  const createButton = Selector("button").withText("Crear zona");
  await t.click(createButton);

  await t.eval(() => location.reload());

  await t.expect(Selector("h2").withText("Sur").exists).ok();
});

test('Modificar la zona "Sur" a "Sur de Rosario"', async (t) => {
  const zoneLink = Selector("a").withText("Zona");
  await t.click(zoneLink);

  const zonaSurH2 = Selector("h2").withText("Sur");

  await t.scrollIntoView(zonaSurH2).hover(zonaSurH2).click(zonaSurH2);

  const inputNombreZona = Selector("input").withAttribute(
    "formcontrolname",
    "name"
  );

  await t
    .selectText(inputNombreZona)
    .pressKey("delete")
    .typeText(inputNombreZona, "Sur de Rosario");

  const botonActualizar = Selector("button").withText("Actualizar zona");
  await t.click(botonActualizar);
});
