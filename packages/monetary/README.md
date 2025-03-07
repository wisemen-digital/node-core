# Wisemen Monetary Package for TypeScript

## Features

✔ Accurate Financial Calculations – `Monetary` provides the tools to accurately perform moneraty operations \
✔ Persistence Support – Seamlessly store and retrieve monetary values with extenstions for `TypeORM`. \
✔ DTO Validation – Ensure data integrity with built-in validation for monetary objects. \
✔ Immutability – Monetary is fully immutable, meaning no state bugs. \
✔ TypeScript Support – Fully typed for a smooth developer experience.


## Philosophy

Wisemen Monetary places the responsibility of accurately dealing with monetary values with the developer, but helps where needed by providing the necessary tools.

## Example

```typescript
// 10 euros with precision 4
import { Monetary } from './monetary'

const price = new Monetary({
  amount: 10_0000,
  currency: Currency.EUR,
  precision: 4
})

// 2 euros discount with precision 0
const flatDiscount = new Monetary({
  amount: 2,
  currency: Currency.EUR,
  precision: 0
})

const bonusDiscountRate = 0.90 // 90 percent of discounted price

const discountedPrice = price
  .subtract(flatDiscount)        // subtract 2 euros
  .multiply(bonusDiscountRate)   // take 90 percent of price
  .toPrecision(2)                // only store up to cents
  .floor()

discountedPrice.toString() // -> "7,20 euros"
```


## Deep Dive

### Monetary operations

#### Rounding

Monetary stores the current amount internally as a regular javascript `number` which means it can be both an `integer` or a `float`. Monetary objects will never perform any type of rounding on the internal value automatically. The point at which rounding of the monetary value takes place and the specific rounding operation is determined by the developer. Rounding always respects the set precision.

Monetary supports 3 rounding operations:
- `round()`: rounds half up to the nearest integer
- `ceil()`: rounds up to the nearest integer
- `floor()`: rounds down to the nearest integer

```typescript
// 10 euros with precsion 2
const price = new Monetary({
  amount: 1000,
  currency: Currency.EUR,
  precision: 2
})

price.isRounded() // -> true

const discountedPrice =  price.multiply(.9999) // -> 9.999 euros
discountedPrice.isRounded() // -> false

discountedPrice.round() // -> 10 euros
discountedPrice.floor() // -> 9.99 euros
discountedPrice.ceil() // -> 10 euros
```

#### Adding and subtracting

Monetary only allows values with the same currency to be added or subtracted from each other.

```typescript
// 10 euros with precsion 2
const euros = new Monetary({
  amount: 1000,
  currency: Currency.EUR,
  precision: 2
})

// 10 USD with precsion 2
const dollars = new Monetary({
  amount: 1000,
  currency: Currency.USD,
  precision: 2
})

euros.add(dollars) // -> throws IllegalMonetaryOperationError
euros.subtract(dollars) // -> throws IllegalMonetaryOperationError
```

Adding or subtracting values with different precisions will use the highest precision of the two in the resulting value. The amount of the value with the lowest precision is increased to the higher precision before the operation is performed.

```typescript
// 10 euros with precsion 2
const euros = new Monetary({
  amount: 1000,
  currency: Currency.EUR,
  precision: 2
})

// 10 euros with precsion 4
const morePreciseEuros = new Monetary({
  amount: 1000000,
  currency: Currency.EUR,
  precision: 4
})

euros.add(morePreciseEuros) // -> 20 euros with precision 4
euros.subtract(morePreciseEuros) // -> 0 euros with precision 4
```

#### Changing precision

Changing the precision of a monetary value adjusts the internal amount. The value is multiplied by 10<sup>(newPrecision - oldPrecision)</sup>. A decrease in precision can result in an unrounded value.

```typescript
// 9,50 euros with precsion 2
const euros = new Monetary({
  amount: 950,
  currency: Currency.EUR,
  precision: 2
})

euros.toPrecision(4) // -> amount of 95000
euros.toPrecision(0) // -> amount of 9,50 (unrounded)
```

### Persistence

Storing arbitrary precision is not possible in Monetary. Monetary storing mechanisms require a set precision. All stored values will have the set precision. Values with a lower precision are normalized to the set precision. Values with a higher precision will trigger an error when stored.

```typescript
class Entity {
  @MonetaryColumn({defaultPrecision: 4})
  amount: Monetary
}

// 9,50 euros with precsion 2
const euros = new Monetary({
  amount: 950,
  currency: Currency.EUR,
  precision: 2
})

// 9,50 euros with precsion 5
const highPrecisionEuros = new Monetary({
  amount: 950000,
  currency: Currency.EUR,
  precision: 5
})

await entityRepository.insert({amount: euros}) // -> stored as 95000
await entityRepository.insert({amount: highPrecisionEuros}) // -> throws PrecisionLossError
```

Monetary provides 2 storing mechanisms for `TypeORM`.

#### Storing only the amount

When the currency of a monetary value is static (i.e. only EUR is supported) monetary values can be stored as just the amount. The amount is stored as an `int4` column.

```typescript
class Entity {
  @MonetaryAmountColumn({
    monetaryPrecision: 4,  
    currency: Currency.EUR // the static currency
  })
  amount: Monetary
}

// 9,50 dollars with precision 2
const dollars = new Monetary({
  amount: 950,
  currency: Currency.USD,
  precision: 2
})

await entityRepository.insert({amount: dollars}) // -> throws UnsupportedCurrencyError
```

#### Storing the amount and currency

Storing multiple currencies in a single field will store the monetary values as `jsonb`. It's possible to define a precision per currency. If a precision is not set for a currency, the default precision is used.

```typescript
class Entity {
  @MonetaryColumn({
    defaultPrecision: 2,
    currencyPrecisions: {
      [Currency.EUR]: 4
    }
  })
  amount: Monetary
}

// 9,50 dollars with precsion 2
const dollars = new Monetary({
  amount: 950,
  currency: Currency.USD,
  precision: 2
})

// 9,50 euros with precsion 2
const euros = new Monetary({
  amount: 950,
  currency: Currency.EUR,
  precision: 2
})


await entityRepository.insert({amount: dollars}) // -> stored with precision 2 as 950
await entityRepository.insert({amount: euros}) // -> stored with precision 4 as 95000
```

### DTO

Monetary provides a DTO `MonetaryDto` which defines `ApiProperty`s for open api documentation in `Nestjs` and validation for `class-validator`.

```json
{
  "amount": 950,
  "currency": "EUR",
  "precision": 2
}
```

#### Validation

The DTO validates it's internal properties. When you need to validate the DTO as a nested property you can use `IsMonetary`. This validator applies `IsObject`, `ValidateNested` and `Type` internally. You can optionally define allowed currencies and a maximum precision.

```typescript
class EntityDto {
  @IsMonetary({
    maxPrecision: 4, // optional max precision
    allowedCurrencies: new Set([Currency.EUR]) // optional allowed currencies
  })
  amount: MonetaryDto
}
```

#### Creating DTOs

A Monetary DTO can be made through a static method:

```typescript
const euros = new Monetary({
  amount: 950,
  currency: Currency.EUR,
  precision: 2
})

const dto = MonetaryDto.from(euros)
```

Or with a builder which allows invalid values for testing:
```typescript
const dto = new MonetaryDtoBuilder()
  .withAmount(950)
  .withCurrency(Currency.EUR)
  .withPrecision(2)
  .build()
```

#### Parsing DTOs

A Monetary DTO can be parsed by passing it to the constructor:

```typescript
const dto = new MonetaryDtoBuilder()
  .withAmount(950)
  .withCurrency(Currency.EUR)
  .withPrecision(2)
  .build()

const amount = new Monetary(dto)
```

or with a convenience method on the dto:

```typescript
const dto = new MonetaryDtoBuilder()
  .withAmount(950)
  .withCurrency(Currency.EUR)
  .withPrecision(2)
  .build()

const amount = dto.parse()
```




