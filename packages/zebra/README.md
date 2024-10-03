# @jollyes/zebra

Connect to Zebra printers

## Install

```bash
npm install @jollyes/zebra
npx cap sync
```

## API

<docgen-index>

* [`printLabel(...)`](#printlabel)
* [`searchPrinters()`](#searchprinters)
* [`connectToPrinter(...)`](#connecttoprinter)
* [`factoryReset()`](#factoryreset)
* [Type Aliases](#type-aliases)

</docgen-index>

<docgen-api>
<!--Update the source file JSDoc comments and rerun docgen to update the docs below-->

### printLabel(...)

```typescript
printLabel(options: { zpl: string; }) => any
```

| Param         | Type                          |
| ------------- | ----------------------------- |
| **`options`** | <code>{ zpl: string; }</code> |

**Returns:** <code>any</code>

--------------------


### searchPrinters()

```typescript
searchPrinters() => any
```

**Returns:** <code>any</code>

--------------------


### connectToPrinter(...)

```typescript
connectToPrinter(options: { printer: ZebraBluetoothPrinter; }) => any
```

| Param         | Type                                                                                  |
| ------------- | ------------------------------------------------------------------------------------- |
| **`options`** | <code>{ printer: <a href="#zebrabluetoothprinter">ZebraBluetoothPrinter</a>; }</code> |

**Returns:** <code>any</code>

--------------------


### factoryReset()

```typescript
factoryReset() => any
```

**Returns:** <code>any</code>

--------------------


### Type Aliases


#### ZebraBluetoothPrinter

<code>{ name: string; address: string; }</code>

</docgen-api>
