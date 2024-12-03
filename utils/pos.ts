// @ts-nocheck
import { IOrder } from "@/interfaces";
import { PermissionsAndroid } from "react-native";
import { BluetoothEscposPrinter } from "react-native-bluetooth-escpos-printer";
// Bluetooth Printer Connectivity
const connectToPrinter = async () => {
  try {
    // Scan for available Bluetooth devices
    const devices = await BluetoothEscposPrinter.bluetoothDeviceList();

    // Connect to a specific printer (replace with your printer's MAC address)
    await BluetoothEscposPrinter.connectDevice("XX:XX:XX:XX:XX:XX");
  } catch (error) {
    console.error("Printer connection error:", error);
  }
};
const printReceipt = async (order: IOrder) => {
  try {
    await BluetoothEscposPrinter.printerInit();
    await BluetoothEscposPrinter.printerLeftSpace(0);

    // Print business logo and address
    await BluetoothEscposPrinter.printText(
      `
  _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
 |                                                           |
 |                      Restaurant                           |
 |               Av. Mariscal Castilla 29001                 |
 |                  El Tambo, Huancayo                       |
 |_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _|

`,
      {
        encoding: "GBK",
        codepage: 0,
        widthtimes: 1,
        heigthtimes: 1,
        align: BluetoothEscposPrinter.ALIGN.CENTER,
      }
    );

    await BluetoothEscposPrinter.printText(
      "                           RECIBO\n\n",
      {
        encoding: "GBK",
        codepage: 0,
        widthtimes: 1,
        heigthtimes: 1,
        bold: true,
        align: BluetoothEscposPrinter.ALIGN.CENTER,
      }
    );

    await BluetoothEscposPrinter.printText(`Mozo(a): ${order.name}\n`, {});
    await BluetoothEscposPrinter.printText(`Mesa: ${order.table}\n`, {});
    await BluetoothEscposPrinter.printText(
      `Fecha: ${order.date.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })}\n\n`,
      {}
    );

    const subTotal =
      order.entradas.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      ) +
      order.bebidas.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const total = subTotal + subTotal * 0.18;

    for (const item of order.entradas) {
      await BluetoothEscposPrinter.printText(
        `Entrada: ${item.meal} - $${item.price.toFixed(2)} x ${
          item.quantity
        }\n`,
        {}
      );
    }

    for (const item of order.bebidas) {
      await BluetoothEscposPrinter.printText(
        `Bebida: ${item.meal} - $${item.price.toFixed(2)} x ${item.quantity}\n`,
        {}
      );
    }

    await BluetoothEscposPrinter.printText(
      `\nSubtotal: $${subTotal.toFixed(2)}\n`,
      {
        bold: true,
      }
    );
    await BluetoothEscposPrinter.printText(
      `IVA (18%): $${(subTotal * 0.18).toFixed(2)}\n`,
      {
        bold: true,
      }
    );
    await BluetoothEscposPrinter.printText(`\nTOTAL: $${total.toFixed(2)}\n`, {
      bold: true,
      widthtimes: 2,
      heigthtimes: 2,
    });

    await BluetoothEscposPrinter.printText(`\n¡Gracias por su visita!\n`, {});
    await BluetoothEscposPrinter.printText(
      `
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
`,
      {
        align: BluetoothEscposPrinter.ALIGN.CENTER,
      }
    );

    await BluetoothEscposPrinter.cutPaper();
  } catch (error) {
    console.error("Printing error:", error);
  }
};

// Request Bluetooth Permissions (React Native)
const requestBluetoothPermissions = async () => {
  try {
    // Use PermissionsAndroid for Android
    // For iOS, configure in Info.plist
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      await connectToPrinter();
    }
  } catch (error) {
    console.error("Permission error:", error);
  }
};

export { connectToPrinter, printReceipt, requestBluetoothPermissions };
