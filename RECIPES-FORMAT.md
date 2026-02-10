# Personal recipes format

Add your recipes in **`my-recipes.json`**. The app loads this file and uses only these recipes. Use the same structure as below.

## Recipe object

| Field         | Type     | Required | Description |
|--------------|----------|----------|-------------|
| `name`       | string   | yes      | Recipe title (e.g. "Oatmeal with banana") |
| `meal`       | string   | yes      | One of: `breakfast`, `lunch/dinner`, `snack`. Use `lunch/dinner` for main meals; the planner picks one for lunch and one for dinner (no repeat same day). |
| `ingredients`| string[] | yes      | List of ingredients (e.g. `["40 g oats", "1 banana"]`) |
| `steps`      | string[] | yes      | Cooking steps in order |
| `nutrition`  | object   | no*      | Per serving; use `0` if unknown |

\* If you omit `nutrition`, the app will treat values as 0. For meal plans and cards it’s better to add rough numbers.

## Nutrition object

```json
"nutrition": {
  "calories": 285,
  "protein": 8,
  "carbs": 52,
  "fat": 5,
  "fiber": 6
}
```

All values are numbers: **calories** in kcal, **protein**, **carbs**, **fat**, **fiber** in grams.

## Example

```json
[
  {
    "name": "My favourite soup",
    "meal": "lunch/dinner",
    "ingredients": ["100 g chicken", "50 g rice", "500 ml broth", "Salt"],
    "steps": ["Boil broth. Add rice and chicken.", "Simmer 15 min. Season."],
    "nutrition": { "calories": 250, "protein": 25, "carbs": 22, "fat": 4, "fiber": 1 }
  }
]
```

- **File name:** `my-recipes.json` (in the same folder as `index.html`).
- **Encoding:** Save as UTF-8.
- **Valid JSON:** No trailing commas, use double quotes. You can validate at [jsonlint.com](https://jsonlint.com).
