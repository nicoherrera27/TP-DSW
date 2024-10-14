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
  const zonaSur = Selector("h2").withText("Sur");

  // Una vez seleccionado el contenedor de "Sur", navegamos al botón de eliminar
  const botonEliminar = zonaSur
    .parent("a")
    .parent("div")
    .sibling("div")
    .find("button.btn.btn-danger");

  // Clic en el botón de eliminar
  await t
    .hover(zonaSur) // Si es necesario para asegurar que el botón es visible
    .click(botonEliminar);

  await t.eval(() => location.reload(true));

  // Espera redirección o cualquier cambio que ocurra tras eliminar
  await t.expect(Selector("h2").withText("Sur").exists).notOk();

  // Si te redirige a la home o a otra página, navega de vuelta a la lista de zonas
  await t.navigateTo("/zone");

  // Validar que la zona "Sur" ya no está presente
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
